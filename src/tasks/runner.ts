import * as vscode from 'vscode';
import { TerminalManager } from '../terminal/manager';

export class TaskRunner {
    constructor(private terminalManager: TerminalManager) { }

    public async runStartupCommand(command: string) {
        if (!command) {
            return;
        }

        // We assume the environment is already activated in the terminal
        // Just send the command
        this.terminalManager.runCommand(command);
    }
}
