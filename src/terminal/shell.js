"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellHelper = exports.ShellType = void 0;
var os = require("os");
var path = require("path");
var ShellType;
(function (ShellType) {
    ShellType["PowerShell"] = "powershell";
    ShellType["CMD"] = "cmd";
    ShellType["Bash"] = "bash";
    ShellType["Zsh"] = "zsh";
    ShellType["Fish"] = "fish";
    ShellType["Unknown"] = "unknown";
})(ShellType || (exports.ShellType = ShellType = {}));
var ShellHelper = /** @class */ (function () {
    function ShellHelper() {
    }
    ShellHelper.getShellType = function (shellPath) {
        var lowerPath = shellPath.toLowerCase();
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
    };
    ShellHelper.getActivationCommand = function (shellType, envType, envPath, version) {
        if (envType === 'python') {
            return this.getPythonActivationCommand(shellType, envPath);
        }
        else {
            return this.getNodeActivationCommand(shellType, envPath, version);
        }
    };
    ShellHelper.getPythonActivationCommand = function (shellType, venvPath) {
        var isWindows = os.platform() === 'win32';
        switch (shellType) {
            case ShellType.PowerShell:
                return "& \"".concat(path.join(venvPath, 'Scripts', 'Activate.ps1'), "\"");
            case ShellType.CMD:
                return "\"".concat(path.join(venvPath, 'Scripts', 'activate.bat'), "\"");
            case ShellType.Bash:
            case ShellType.Zsh:
            case ShellType.Fish:
                // Standard venv structure on Unix is bin/activate
                // On Windows with Git Bash, it might still be Scripts/activate or bin/activate depending on how it was created.
                // But usually if we are in a unix shell on windows, python might still create Scripts.
                // Let's try to detect or assume standard based on OS for now.
                if (isWindows) {
                    // Git Bash on Windows often uses Scripts
                    return "source \"".concat(path.join(venvPath, 'Scripts', 'activate'), "\"");
                }
                return "source \"".concat(path.join(venvPath, 'bin', 'activate'), "\"");
            default:
                // Fallback
                return isWindows ? "\"".concat(path.join(venvPath, 'Scripts', 'activate.bat'), "\"") : "source \"".concat(path.join(venvPath, 'bin', 'activate'), "\"");
        }
    };
    ShellHelper.getNodeActivationCommand = function (shellType, dirPath, version) {
        // For Node, we usually want to cd into the directory first
        // And then run nvm use if version is present
        var cdCommand = "cd \"".concat(dirPath, "\"");
        if (shellType === ShellType.PowerShell) {
            cdCommand = "Set-Location \"".concat(dirPath, "\"");
        }
        var useCommand = '';
        if (version && version !== 'default') {
            // This assumes nvm is installed and available in the shell
            useCommand = "nvm use ".concat(version);
        }
        else {
            // If no specific version, maybe just nvm use to read .nvmrc if it exists
            useCommand = "nvm use";
        }
        // Chain commands
        var separator = (shellType === ShellType.PowerShell || shellType === ShellType.CMD) ? '; ' : ' && ';
        return "".concat(cdCommand).concat(separator).concat(useCommand);
    };
    return ShellHelper;
}());
exports.ShellHelper = ShellHelper;
