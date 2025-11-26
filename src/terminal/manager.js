"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalManager = void 0;
var vscode = require("vscode");
var shell_1 = require("./shell");
var TerminalManager = /** @class */ (function () {
    function TerminalManager() {
    }
    TerminalManager.prototype.getTerminal = function () {
        if (!this.terminal || this.terminal.exitStatus !== undefined) {
            this.terminal = vscode.window.createTerminal('Attune Environment');
        }
        return this.terminal;
    };
    TerminalManager.prototype.runActivation = function (envType, envPath, version) {
        return __awaiter(this, void 0, void 0, function () {
            var term, shellPath, shellType, command;
            return __generator(this, function (_a) {
                term = this.getTerminal();
                term.show();
                shellPath = this.getShellPath();
                shellType = shell_1.ShellHelper.getShellType(shellPath);
                command = shell_1.ShellHelper.getActivationCommand(shellType, envType, envPath, version);
                term.sendText(command);
                return [2 /*return*/];
            });
        });
    };
    TerminalManager.prototype.runCommand = function (command) {
        var term = this.getTerminal();
        term.show();
        term.sendText(command);
    };
    TerminalManager.prototype.dispose = function () {
        if (this.terminal) {
            this.terminal.dispose();
            this.terminal = undefined;
        }
    };
    TerminalManager.prototype.getShellPath = function () {
        // Heuristic to get default shell
        var config = vscode.workspace.getConfiguration('terminal.integrated');
        // This API has changed over time, 'defaultProfile' is the modern way
        // But resolving the actual path from the profile name is complex.
        // Fallback to a safe default based on OS if we can't easily determine.
        // For this implementation, we'll try to guess based on OS if we can't find a specific setting
        // Or just assume the user is using the OS default.
        if (process.platform === 'win32') {
            return 'powershell.exe'; // Reasonable default for VS Code on Windows
        }
        return '/bin/bash';
    };
    return TerminalManager;
}());
exports.TerminalManager = TerminalManager;
