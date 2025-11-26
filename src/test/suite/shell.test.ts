import * as assert from 'assert';
import { ShellHelper, ShellType } from '../../terminal/shell';

suite('ShellHelper Tests', () => {
    suite('Python Activation Commands', () => {
        test('PowerShell: Should generate correct activation command', () => {
            const command = ShellHelper.getActivationCommand(
                ShellType.PowerShell,
                'python',
                'C:\\venv'
            );
            assert.ok(command.includes('Activate.ps1'));
            assert.ok(command.includes('C:\\venv'));
        });

        test('CMD: Should generate correct activation command', () => {
            const command = ShellHelper.getActivationCommand(
                ShellType.CMD,
                'python',
                'C:\\venv'
            );
            assert.ok(command.includes('activate.bat'));
            assert.ok(command.includes('C:\\venv'));
        });

        test('Bash: Should generate correct activation command', () => {
            const command = ShellHelper.getActivationCommand(
                ShellType.Bash,
                'python',
                '/home/user/venv'
            );
            assert.ok(command.includes('source'));
            assert.ok(command.includes('activate'));
        });

        test('Zsh: Should generate correct activation command', () => {
            const command = ShellHelper.getActivationCommand(
                ShellType.Zsh,
                'python',
                '/home/user/venv'
            );
            assert.ok(command.includes('source'));
            assert.ok(command.includes('activate'));
        });
    });

    suite('Node Activation Commands', () => {
        test('Should include nvm use command', () => {
            const command = ShellHelper.getActivationCommand(
                ShellType.Bash,
                'node',
                '/home/user/project',
                '20.11.0'
            );
            assert.ok(command.includes('nvm use'));
        });

        test('Should include version when specified', () => {
            const command = ShellHelper.getActivationCommand(
                ShellType.PowerShell,
                'node',
                'C:\\project',
                '18.17.0'
            );
            assert.ok(command.includes('18.17.0'));
        });

        test('Should handle default version', () => {
            const command = ShellHelper.getActivationCommand(
                ShellType.Bash,
                'node',
                '/home/user/project',
                'default'
            );
            assert.ok(command.includes('nvm use'));
        });
    });

    suite('Shell Type Detection', () => {
        test('Should detect PowerShell', () => {
            const type = ShellHelper.getShellType('C:\\Windows\\System32\\WindowsPowerShell\\powershell.exe');
            assert.strictEqual(type, ShellType.PowerShell);
        });

        test('Should detect pwsh', () => {
            const type = ShellHelper.getShellType('C:\\Program Files\\PowerShell\\7\\pwsh.exe');
            assert.strictEqual(type, ShellType.PowerShell);
        });

        test('Should detect CMD', () => {
            const type = ShellHelper.getShellType('C:\\Windows\\System32\\cmd.exe');
            assert.strictEqual(type, ShellType.CMD);
        });

        test('Should detect Bash', () => {
            const type = ShellHelper.getShellType('/bin/bash');
            assert.strictEqual(type, ShellType.Bash);
        });

        test('Should detect Zsh', () => {
            const type = ShellHelper.getShellType('/bin/zsh');
            assert.strictEqual(type, ShellType.Zsh);
        });

        test('Should detect Fish', () => {
            const type = ShellHelper.getShellType('/usr/bin/fish');
            assert.strictEqual(type, ShellType.Fish);
        });

        test('Should return Unknown for unrecognized shells', () => {
            const type = ShellHelper.getShellType('/some/random/shell');
            assert.strictEqual(type, ShellType.Unknown);
        });
    });
});
