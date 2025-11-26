import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';

export enum ShellType {
    PowerShell = 'powershell',
    CMD = 'cmd',
    Bash = 'bash',
    Zsh = 'zsh',
    Fish = 'fish',
    Unknown = 'unknown'
}

export class ShellHelper {
    public static getShellType(shellPath: string): ShellType {
        const lowerPath = shellPath.toLowerCase();
        if (lowerPath.includes('powershell') || lowerPath.includes('pwsh')) {
            return ShellType.PowerShell;
        }
        if (lowerPath.includes('cmd.exe')) {
            return ShellType.CMD;
        }
        if (lowerPath.includes('bash')) {
            return ShellType.Bash;
        }
        if (lowerPath.includes('zsh')) {
            return ShellType.Zsh;
        }
        if (lowerPath.includes('fish')) {
            return ShellType.Fish;
        }
        return ShellType.Unknown;
    }

    public static getActivationCommand(shellType: ShellType, envType: 'node' | 'python', envPath: string, version?: string): string {
        if (envType === 'python') {
            return this.getPythonActivationCommand(shellType, envPath);
        } else {
            return this.getNodeActivationCommand(shellType, envPath, version);
        }
    }

    private static getPythonActivationCommand(shellType: ShellType, venvPath: string): string {
        const isWindows = os.platform() === 'win32';

        switch (shellType) {
            case ShellType.PowerShell:
                return `& "${path.join(venvPath, 'Scripts', 'Activate.ps1')}"`;
            case ShellType.CMD:
                return `"${path.join(venvPath, 'Scripts', 'activate.bat')}"`;
            case ShellType.Bash:
            case ShellType.Zsh:
            case ShellType.Fish:
                // Standard venv structure on Unix is bin/activate
                // On Windows with Git Bash, it might still be Scripts/activate or bin/activate depending on how it was created.
                // But usually if we are in a unix shell on windows, python might still create Scripts.
                // Let's try to detect or assume standard based on OS for now.
                if (isWindows) {
                    // Git Bash on Windows often uses Scripts
                    return `source "${path.join(venvPath, 'Scripts', 'activate')}"`;
                }
                return `source "${path.join(venvPath, 'bin', 'activate')}"`;
            default:
                // Fallback
                return isWindows ? `"${path.join(venvPath, 'Scripts', 'activate.bat')}"` : `source "${path.join(venvPath, 'bin', 'activate')}"`;
        }
    }

    private static getNodeActivationCommand(shellType: ShellType, dirPath: string, version?: string): string {
        // For Node, we usually want to cd into the directory first
        // And then run nvm use if version is present

        let cdCommand = `cd "${dirPath}"`;
        if (shellType === ShellType.PowerShell) {
            cdCommand = `Set-Location "${dirPath}"`;
        }

        let useCommand = '';
        if (version && version !== 'default') {
            // This assumes nvm is installed and available in the shell
            useCommand = `nvm use ${version}`;
        } else {
            // If no specific version, maybe just nvm use to read .nvmrc if it exists
            useCommand = `nvm use`;
        }

        // Chain commands
        const separator = (shellType === ShellType.PowerShell || shellType === ShellType.CMD) ? '; ' : ' && ';
        return `${cdCommand}${separator}${useCommand}`;
    }
}
