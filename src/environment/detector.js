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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentDetector = void 0;
var vscode = require("vscode");
var fs = require("fs");
var path = require("path");
var glob_1 = require("glob");
var EnvironmentDetector = /** @class */ (function () {
    function EnvironmentDetector() {
    }
    EnvironmentDetector.prototype.detectEnvironments = function () {
        return __awaiter(this, void 0, void 0, function () {
            var profiles, workspaceFolders, _i, workspaceFolders_1, folder, rootPath, _a, nodeProfiles, pythonProfiles;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        profiles = [];
                        workspaceFolders = vscode.workspace.workspaceFolders;
                        if (!workspaceFolders) {
                            return [2 /*return*/, profiles];
                        }
                        _i = 0, workspaceFolders_1 = workspaceFolders;
                        _b.label = 1;
                    case 1:
                        if (!(_i < workspaceFolders_1.length)) return [3 /*break*/, 4];
                        folder = workspaceFolders_1[_i];
                        rootPath = folder.uri.fsPath;
                        return [4 /*yield*/, Promise.all([
                                this.detectNodeEnvironments(rootPath),
                                this.detectPythonEnvironments(rootPath)
                            ])];
                    case 2:
                        _a = _b.sent(), nodeProfiles = _a[0], pythonProfiles = _a[1];
                        profiles.push.apply(profiles, __spreadArray(__spreadArray([], nodeProfiles, false), pythonProfiles, false));
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, profiles];
                }
            });
        });
    };
    EnvironmentDetector.prototype.detectNodeEnvironments = function (rootPath) {
        return __awaiter(this, void 0, void 0, function () {
            var profiles, packageJsonFiles, _i, packageJsonFiles_1, file, dirPath, version, content, match;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        profiles = [];
                        return [4 /*yield*/, (0, glob_1.glob)('**/package.json', {
                                cwd: rootPath,
                                ignore: ['**/node_modules/**', '**/dist/**', '**/out/**'],
                                absolute: true,
                                maxDepth: 3
                            })];
                    case 1:
                        packageJsonFiles = _a.sent();
                        for (_i = 0, packageJsonFiles_1 = packageJsonFiles; _i < packageJsonFiles_1.length; _i++) {
                            file = packageJsonFiles_1[_i];
                            dirPath = path.dirname(file);
                            version = 'default';
                            if (fs.existsSync(path.join(dirPath, '.nvmrc'))) {
                                version = fs.readFileSync(path.join(dirPath, '.nvmrc'), 'utf8').trim();
                            }
                            else if (fs.existsSync(path.join(dirPath, '.tool-versions'))) {
                                content = fs.readFileSync(path.join(dirPath, '.tool-versions'), 'utf8');
                                match = content.match(/nodejs\s+(.+)/);
                                if (match) {
                                    version = match[1].trim();
                                }
                            }
                            profiles.push({
                                name: "Node.js (".concat(path.relative(rootPath, dirPath) || 'Root', ")"),
                                type: 'node',
                                path: dirPath,
                                version: version
                            });
                        }
                        return [2 /*return*/, profiles];
                }
            });
        });
    };
    EnvironmentDetector.prototype.detectPythonEnvironments = function (rootPath) {
        return __awaiter(this, void 0, void 0, function () {
            var profiles, potentialVenvs, venvDirs, _i, potentialVenvs_1, file, venvRoot, _a, venvDirs_1, venvPath;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        profiles = [];
                        return [4 /*yield*/, (0, glob_1.glob)('**/{pyvenv.cfg,bin/activate,Scripts/activate}', {
                                cwd: rootPath,
                                ignore: ['**/node_modules/**', '**/dist/**', '**/out/**'],
                                absolute: true,
                                maxDepth: 4
                            })];
                    case 1:
                        potentialVenvs = _b.sent();
                        venvDirs = new Set();
                        for (_i = 0, potentialVenvs_1 = potentialVenvs; _i < potentialVenvs_1.length; _i++) {
                            file = potentialVenvs_1[_i];
                            venvRoot = path.dirname(file);
                            if (file.endsWith('activate')) {
                                venvRoot = path.dirname(venvRoot); // Go up from bin or Scripts
                            }
                            venvDirs.add(venvRoot);
                        }
                        for (_a = 0, venvDirs_1 = venvDirs; _a < venvDirs_1.length; _a++) {
                            venvPath = venvDirs_1[_a];
                            profiles.push({
                                name: "Python Venv (".concat(path.relative(rootPath, venvPath) || 'Root', ")"),
                                type: 'python',
                                path: venvPath
                            });
                        }
                        // 2. Look for project definitions if no venv found in that specific dir, 
                        // but maybe we want to list them as "Potential Python Project"
                        // For now, let's stick to concrete environments we can activate.
                        return [2 /*return*/, profiles];
                }
            });
        });
    };
    return EnvironmentDetector;
}());
exports.EnvironmentDetector = EnvironmentDetector;
