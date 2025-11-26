import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "polyglot-environment-switcher" is now active!');

    let disposable = vscode.commands.registerCommand('polyglot.switch', () => {
        vscode.window.showInformationMessage('Polyglot: Switch Environment triggered!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
