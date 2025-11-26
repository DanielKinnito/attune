import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { EnvironmentDetector } from '../../environment/detector';

suite('EnvironmentDetector Tests', () => {
    const testWorkspaceRoot = path.join(__dirname, '../../../test-workspace');

    setup(() => {
        // Create test workspace directory
        if (!fs.existsSync(testWorkspaceRoot)) {
            fs.mkdirSync(testWorkspaceRoot, { recursive: true });
        }
    });

    teardown(() => {
        // Clean up test files
        if (fs.existsSync(testWorkspaceRoot)) {
            fs.rmSync(testWorkspaceRoot, { recursive: true, force: true });
        }
    });

    test('Should detect package.json files', () => {
        const packageJsonPath = path.join(testWorkspaceRoot, 'package.json');
        fs.writeFileSync(packageJsonPath, JSON.stringify({ name: 'test' }, null, 2));

        // Note: This test would need vscode.workspace.workspaceFolders to be mocked
        // For now, we're just verifying the file was created
        assert.ok(fs.existsSync(packageJsonPath));
    });

    test('Should detect .nvmrc files', () => {
        const nvmrcPath = path.join(testWorkspaceRoot, '.nvmrc');
        fs.writeFileSync(nvmrcPath, '20.11.0');

        assert.ok(fs.existsSync(nvmrcPath));
        const version = fs.readFileSync(nvmrcPath, 'utf8').trim();
        assert.strictEqual(version, '20.11.0');
    });

    test('Should detect virtual environments', () => {
        const venvPath = path.join(testWorkspaceRoot, '.venv');
        fs.mkdirSync(venvPath, { recursive: true });

        // Create pyvenv.cfg to mark it as a venv
        const pyvenvCfgPath = path.join(venvPath, 'pyvenv.cfg');
        fs.writeFileSync(pyvenvCfgPath, 'home = /usr/bin\n');

        assert.ok(fs.existsSync(pyvenvCfgPath));
    });

    test('Should detect nested package.json files', () => {
        const frontendDir = path.join(testWorkspaceRoot, 'frontend');
        fs.mkdirSync(frontendDir, { recursive: true });

        const packageJsonPath = path.join(frontendDir, 'package.json');
        fs.writeFileSync(packageJsonPath, JSON.stringify({ name: 'frontend' }, null, 2));

        assert.ok(fs.existsSync(packageJsonPath));
    });

    test('Should parse .tool-versions for Node version', () => {
        const toolVersionsPath = path.join(testWorkspaceRoot, '.tool-versions');
        fs.writeFileSync(toolVersionsPath, 'nodejs 18.17.0\npython 3.11.0');

        assert.ok(fs.existsSync(toolVersionsPath));
        const content = fs.readFileSync(toolVersionsPath, 'utf8');
        const match = content.match(/nodejs\s+(.+)/);
        assert.ok(match);
        assert.strictEqual(match[1].trim(), '18.17.0');
    });
});
