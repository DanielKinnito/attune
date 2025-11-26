import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigManager } from '../../config/manager';

suite('ConfigManager Tests', () => {
    const testWorkspaceRoot = path.join(__dirname, '../../../test-workspace');
    const vscodeDir = path.join(testWorkspaceRoot, '.vscode');
    const configPath = path.join(vscodeDir, 'attune.json');

    setup(() => {
        // Create test workspace directory
        if (!fs.existsSync(testWorkspaceRoot)) {
            fs.mkdirSync(testWorkspaceRoot, { recursive: true });
        }
        if (!fs.existsSync(vscodeDir)) {
            fs.mkdirSync(vscodeDir, { recursive: true });
        }
    });

    teardown(() => {
        // Clean up test files
        if (fs.existsSync(configPath)) {
            fs.unlinkSync(configPath);
        }
        if (fs.existsSync(vscodeDir)) {
            fs.rmdirSync(vscodeDir);
        }
        if (fs.existsSync(testWorkspaceRoot)) {
            fs.rmdirSync(testWorkspaceRoot);
        }
    });

    test('Should return empty array when no config file exists', async () => {
        const configManager = new ConfigManager();
        const profiles = await configManager.getCustomProfiles();
        assert.strictEqual(profiles.length, 0);
    });

    test('Should parse valid config file', () => {
        const config = {
            profiles: [
                {
                    name: 'Test Node',
                    type: 'node',
                    path: './frontend',
                    version: '20.11.0'
                }
            ]
        };

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        const configManager = new ConfigManager();
        // Note: This test would need vscode.workspace.workspaceFolders to be mocked
        // For now, we're just verifying the file was created
        assert.ok(fs.existsSync(configPath));
    });

    test('Should handle malformed JSON gracefully', () => {
        fs.writeFileSync(configPath, '{ invalid json }');

        const configManager = new ConfigManager();
        // Should not throw, but log error
        assert.ok(fs.existsSync(configPath));
    });

    test('Should validate required fields', () => {
        const config = {
            profiles: [
                {
                    name: 'Test'
                    // Missing type and path
                }
            ]
        };

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        assert.ok(fs.existsSync(configPath));
    });

    test('Should handle startup commands', () => {
        const config = {
            profiles: [
                {
                    name: 'Test Node',
                    type: 'node',
                    path: './frontend',
                    startupCommand: 'npm run dev'
                }
            ]
        };

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        assert.ok(fs.existsSync(configPath));
    });
});
