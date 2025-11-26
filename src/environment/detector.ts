import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { ConfigManager } from '../config/manager';

export interface EnvironmentProfile {
    name: string;
    type: 'node' | 'python';
    path: string;
    version?: string;
    startupCommand?: string;
}

export class EnvironmentDetector {
    private configManager: ConfigManager;

    constructor() {
        this.configManager = new ConfigManager();
    }

    public async detectEnvironments(): Promise<EnvironmentProfile[]> {
        const profiles: EnvironmentProfile[] = [];
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders) {
            return profiles;
        }

        // Get custom profiles first
        const customProfiles = await this.configManager.getCustomProfiles();
        profiles.push(...customProfiles);

        for (const folder of workspaceFolders) {
            const rootPath = folder.uri.fsPath;

            // Parallelize detection
            const [nodeProfiles, pythonProfiles] = await Promise.all([
                this.detectNodeEnvironments(rootPath),
                this.detectPythonEnvironments(rootPath)
            ]);

            // Deduplicate: If a custom profile points to the same path, prefer the custom one
            // We'll just append detected ones that don't match existing paths
            const existingPaths = new Set(profiles.map(p => p.path.toLowerCase()));

            for (const p of [...nodeProfiles, ...pythonProfiles]) {
                if (!existingPaths.has(p.path.toLowerCase())) {
                    profiles.push(p);
                }
            }
        }

        return profiles;
    }

    private async detectNodeEnvironments(rootPath: string): Promise<EnvironmentProfile[]> {
        const profiles: EnvironmentProfile[] = [];

        // Find package.json files (limit depth to avoid node_modules madness if not excluded)
        // We use glob for easier recursive search with excludes
        const packageJsonFiles = await glob('**/package.json', {
            cwd: rootPath,
            ignore: ['**/node_modules/**', '**/dist/**', '**/out/**'],
            absolute: true,
            maxDepth: 3
        });

        for (const file of packageJsonFiles) {
            const dirPath = path.dirname(file);
            // Check for version managers
            let version = 'default';
            if (fs.existsSync(path.join(dirPath, '.nvmrc'))) {
                version = fs.readFileSync(path.join(dirPath, '.nvmrc'), 'utf8').trim();
            } else if (fs.existsSync(path.join(dirPath, '.tool-versions'))) {
                // Simplified parsing for asdf
                const content = fs.readFileSync(path.join(dirPath, '.tool-versions'), 'utf8');
                const match = content.match(/nodejs\s+(.+)/);
                if (match) {
                    version = match[1].trim();
                }
            }

            profiles.push({
                name: `Node.js (${path.relative(rootPath, dirPath) || 'Root'})`,
                type: 'node',
                path: dirPath,
                version: version
            });
        }

        return profiles;
    }

    private async detectPythonEnvironments(rootPath: string): Promise<EnvironmentProfile[]> {
        const profiles: EnvironmentProfile[] = [];

        // 1. Look for venv directories
        // Heuristic: directories containing pyvenv.cfg or bin/activate or Scripts/activate
        const potentialVenvs = await glob('**/{pyvenv.cfg,bin/activate,Scripts/activate}', {
            cwd: rootPath,
            ignore: ['**/node_modules/**', '**/dist/**', '**/out/**'],
            absolute: true,
            maxDepth: 4
        });

        const venvDirs = new Set<string>();
        for (const file of potentialVenvs) {
            // If we found activate script, the venv root is up 1 or 2 levels
            // bin/activate -> ../
            // Scripts/activate -> ../
            // pyvenv.cfg -> ./
            let venvRoot = path.dirname(file);
            if (file.endsWith('activate')) {
                venvRoot = path.dirname(venvRoot); // Go up from bin or Scripts
            }
            venvDirs.add(venvRoot);
        }

        for (const venvPath of venvDirs) {
            profiles.push({
                name: `Python Venv (${path.relative(rootPath, venvPath) || 'Root'})`,
                type: 'python',
                path: venvPath
            });
        }

        return profiles;
    }
}
