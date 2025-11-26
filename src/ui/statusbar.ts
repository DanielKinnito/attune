import * as vscode from 'vscode';
import { EnvironmentProfile } from '../environment/detector';

export class StatusBarManager {
    private statusBarItem: vscode.StatusBarItem;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.statusBarItem.command = 'attune.switch';
        this.statusBarItem.text = '$(terminal) Attune: Select Env';
        this.statusBarItem.tooltip = 'Click to switch environment';
        this.statusBarItem.show();
    }

    public update(profile: EnvironmentProfile) {
        const icon = profile.type === 'node' ? '$(symbol-event)' : '$(symbol-method)';
        this.statusBarItem.text = `${icon} ${profile.name}`;
        if (profile.version) {
            this.statusBarItem.text += ` (${profile.version})`;
        }

        let tooltip = `Active Environment: ${profile.name}\nPath: ${profile.path}`;
        if (profile.startupCommand) {
            tooltip += `\nStartup Command: ${profile.startupCommand}`;
        }
        this.statusBarItem.tooltip = tooltip;
    }

    public dispose() {
        this.statusBarItem.dispose();
    }
}
