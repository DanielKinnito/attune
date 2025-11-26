import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { EnvironmentProfile } from '../environment/detector';

export class ConfigManager {
    private static readonly CONFIG_FILE = 'attune.json';

    constructor() { }

    public async getCustomProfiles(): Promise<EnvironmentProfile[]> {
        const profiles: EnvironmentProfile[] = [];
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders) {
            return profiles;
        }

        for (const folder of workspaceFolders) {
            const configPath = path.join(folder.uri.fsPath, '.vscode', ConfigManager.CONFIG_FILE);
            if (fs.existsSync(configPath)) {
                try {
                    const content = fs.readFileSync(configPath, 'utf8');
                    const config = JSON.parse(content);
                    if (Array.isArray(config.profiles)) {
                        for (const p of config.profiles) {
                            // Validate and normalize
                            if (p.name && p.type && p.path) {
                                profiles.push({
                                    name: p.name,
                                    type: p.type,
                                    path: this.resolvePath(folder.uri.fsPath, p.path),
                                    version: p.version,
                                    startupCommand: p.startupCommand
                                });
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Failed to parse ${ConfigManager.CONFIG_FILE}:`, error);
                    vscode.window.showErrorMessage(`Failed to parse ${ConfigManager.CONFIG_FILE}. Check Output for details.`);
                }
            }
        }

        return profiles;
    }

    private resolvePath(rootPath: string, relativeOrAbsolutePath: string): string {
        if (path.isAbsolute(relativeOrAbsolutePath)) {
            return relativeOrAbsolutePath;
        }
        return path.join(rootPath, relativeOrAbsolutePath);
    }
}
