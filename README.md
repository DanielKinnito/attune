# Attune

> Seamlessly switch between execution environments (Node.js, Python) in VS Code.

Attune is a VS Code extension that helps you effortlessly manage and switch between different development environments in your polyglot projects.

## ✨ Features

- **🔍 Smart Detection**: Automatically discovers Node.js and Python environments in your workspace
- **🌐 Cross-Platform**: Supports PowerShell, CMD, Bash, Zsh, and Fish
- **⚙️ Custom Profiles**: Define custom environments with startup commands
- **📊 Status Bar**: Always see your active environment at a glance
- **🚀 Automation**: Run startup commands automatically when switching environments

## 📦 Installation

1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Run `ext install attune`
4. Reload VS Code

## 🚀 Quick Start

1. Open a workspace with Node.js or Python projects
2. Look for the Attune status bar item in the bottom left
3. Click it or run `Attune: Switch Environment` from the Command Palette (`Ctrl+Shift+P`)
4. Select an environment from the list
5. The terminal will activate the environment automatically!

## 📖 Usage

### Automatic Detection

Attune automatically detects:

**Node.js Projects**

- Searches for `package.json` files recursively (up to 3 levels deep)
- Reads Node version from `.nvmrc` or `.tool-versions`
- Automatically runs `nvm use` when available

**Python Projects**

- Searches for virtual environments (`venv`, `.venv`, `env`)
- Detects `pyvenv.cfg`, `bin/activate`, or `Scripts/activate`
- Activates the virtual environment with the correct shell command

### Custom Configuration

Create a `.vscode/attune.json` file to define custom profiles:

```json
{
  "profiles": [
    {
      "name": "Frontend Dev",
      "type": "node",
      "path": "./frontend",
      "version": "20.11.0",
      "startupCommand": "npm run dev"
    },
    {
      "name": "Backend API",
      "type": "python",
      "path": "./.venv",
      "startupCommand": "uvicorn main:app --reload"
    }
  ]
}
```

#### Profile Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name for the profile |
| `type` | `"node"` \| `"python"` | Yes | Environment type |
| `path` | string | Yes | Path to the environment (relative or absolute) |
| `version` | string | No | Version string (displayed in status bar) |
| `startupCommand` | string | No | Command to run after activation |

### Shell Support

Attune intelligently generates activation commands based on your shell:

| Shell | Node.js | Python (Windows) | Python (Unix) |
|-------|---------|------------------|---------------|
| PowerShell | `nvm use` | `& "path\Scripts\Activate.ps1"` | `source path/bin/activate` |
| CMD | `nvm use` | `"path\Scripts\activate.bat"` | N/A |
| Bash/Zsh | `nvm use` | `source path/Scripts/activate` | `source path/bin/activate` |

## 🎨 Status Bar

The status bar shows:

- 🔵 `$(symbol-event)` for Node.js environments
- 🔴 `$(symbol-method)` for Python environments
- Environment name and version
- Hover to see full path and startup command

## ⚡ Commands

| Command | Description |
|---------|-------------|
| `Attune: Switch Environment` | Open the environment picker |

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## 📝 License

MIT © [Your Name]

## 🙏 Acknowledgments

Inspired by the magic systems in Brandon Sanderson's Cosmere, where different worlds have different rules and powers. Attune helps you harmonize with different development environments just as effortlessly.
