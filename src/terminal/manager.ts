import * as vscode from 'vscode';
import { ShellHelper, ShellType } from './shell';

export class TerminalManager {
    private terminal: vscode.Terminal | undefined;

    constructor() { }

    public getTerminal(): vscode.Terminal {
        if (!this.terminal || this.terminal.exitStatus !== undefined) {
            this.terminal = vscode.window.createTerminal('Attune Environment');
        }
        return this.terminal;
    }

    public async runActivation(envType: 'node' | 'python', envPath: string, version?: string) {
        const term = this.getTerminal();
        term.show();

        // We need to fetch the shell path from the terminal options or settings to determine type
        // However, vscode API doesn't easily give the shell path of an *existing* terminal object directly 
        // in a way that maps 1:1 to our enum without some heuristics or reading settings.
        // For now, we'll read the default shell setting.

        // This is a simplification. In reality, the terminal might be using a different profile.
        // But for MVP/Phase 2, reading the default setting is a good start.
        const shellPath = this.getShellPath();
        const shellType = ShellHelper.getShellType(shellPath);

        const command = ShellHelper.getActivationCommand(shellType, envType, envPath, version);
        term.sendText(command);
    }

    public runCommand(command: string) {
        const term = this.getTerminal();
        term.show();
        term.sendText(command);
    }

    public dispose() {
        if (this.terminal) {
            this.terminal.dispose();
            this.terminal = undefined;
        }
    }

    private getShellPath(): string {
        // Heuristic to get default shell
        const config = vscode.workspace.getConfiguration('terminal.integrated');
        // This API has changed over time, 'defaultProfile' is the modern way
        // But resolving the actual path from the profile name is complex.
        // Fallback to a safe default based on OS if we can't easily determine.

        // For this implementation, we'll try to guess based on OS if we can't find a specific setting
        // Or just assume the user is using the OS default.
        if (process.platform === 'win32') {
            return 'powershell.exe'; // Reasonable default for VS Code on Windows
        }
        return '/bin/bash';
    }
}
