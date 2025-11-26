import * as vscode from 'vscode';
import { TerminalManager } from './terminal/manager';
import { EnvironmentDetector, EnvironmentProfile } from './environment/detector';
import { StatusBarManager } from './ui/statusbar';
import { TaskRunner } from './tasks/runner';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "attune" is now active!');

    const terminalManager = new TerminalManager();
    const environmentDetector = new EnvironmentDetector();
    const statusBarManager = new StatusBarManager();
    const taskRunner = new TaskRunner(terminalManager);

    let disposable = vscode.commands.registerCommand('attune.switch', async () => {
        const profiles = await environmentDetector.detectEnvironments();

        if (profiles.length === 0) {
            vscode.window.showInformationMessage('No environments detected.');
            return;
        }

        const items = profiles.map(p => ({
            label: p.name,
            description: p.type,
            profile: p
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select an environment to switch to'
        });

        if (selected) {
            const profile = selected.profile;
            vscode.window.showInformationMessage(`Switching to ${profile.name}...`);

            await terminalManager.runActivation(profile.type, profile.path, profile.version);
            statusBarManager.update(profile);

            if (profile.startupCommand) {
                await taskRunner.runStartupCommand(profile.startupCommand);
            }
        }
    });

    context.subscriptions.push(disposable);
    context.subscriptions.push(vscode.Disposable.from(
        { dispose: () => terminalManager.dispose() },
        { dispose: () => statusBarManager.dispose() }
    ));
}

export function deactivate() { }
