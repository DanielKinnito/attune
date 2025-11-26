# Contributing to Attune

Thank you for your interest in contributing to Attune! This guide will help you get started.

## 🛠️ Development Setup

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- VS Code

### Getting Started

1. **Fork and Clone**

   ```bash
   git clone https://github.com/yourusername/attune.git
   cd attune
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Compile TypeScript**

   ```bash
   npm run compile
   ```

4. **Run Tests**

   ```bash
   npm test
   ```

5. **Launch Extension**
   - Press `F5` in VS Code to open the Extension Development Host
   - Test your changes in the new window

## 📁 Project Structure

```
attune/
├── src/
│   ├── extension.ts          # Extension entry point
│   ├── config/
│   │   └── manager.ts         # Custom configuration loader
│   ├── environment/
│   │   └── detector.ts        # Environment detection logic
│   ├── terminal/
│   │   ├── manager.ts         # Terminal management
│   │   └── shell.ts           # Shell-specific command generation
│   ├── tasks/
│   │   └── runner.ts          # Startup command execution
│   ├── ui/
│   │   └── statusbar.ts       # Status bar management
│   └── test/
│       └── suite/             # Test files
├── package.json               # Extension manifest
└── tsconfig.json              # TypeScript configuration
```

## 🏗️ Architecture Overview

### Core Components

1. **EnvironmentDetector**: Scans workspace for environments
   - Uses `glob` for recursive file search
   - Detects `package.json`, `.nvmrc`, virtual environments
   - Merges detected profiles with custom configurations

2. **ConfigManager**: Loads `.vscode/attune.json`
   - Validates profile schema
   - Resolves relative paths

3. **ShellHelper**: Generates shell-specific commands
   - Detects shell type from VS Code settings/OS
   - Returns appropriate activation commands

4. **TerminalManager**: Manages terminal lifecycle
   - Creates or reuses terminal instance
   - Sends commands to terminal

5. **TaskRunner**: Executes startup commands
   - Runs after environment activation

6. **StatusBarManager**: Updates UI
   - Shows active environment
   - Provides click-to-switch functionality

### Data Flow

```
User clicks status bar / runs command
  ↓
Extension detects environments (EnvironmentDetector)
  ↓
User selects environment from QuickPick
  ↓
Terminal activates environment (TerminalManager + ShellHelper)
  ↓
TaskRunner executes startup command (if configured)
  ↓
StatusBarManager updates UI
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run watch

# Compile and run tests
npm run pretest
```

### Writing Tests

Tests are located in `src/test/suite/`. We use Mocha and the VS Code Test API.

Example test structure:

```typescript
import * as assert from 'assert';
import { ShellHelper, ShellType } from '../../terminal/shell';

suite('ShellHelper Tests', () => {
    test('Should generate PowerShell activation command', () => {
        const command = ShellHelper.getActivationCommand(
            ShellType.PowerShell,
            'python',
            'C:\\venv'
        );
        assert.strictEqual(command, '& "C:\\venv\\Scripts\\Activate.ps1"');
    });
});
```

## 📝 Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Use VS Code's built-in formatter
- **Naming**:
  - Classes: PascalCase
  - Functions/Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
- **Comments**: Use JSDoc for public APIs

## 🔄 Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write tests for new functionality
   - Update documentation if needed
   - Follow code style guidelines

3. **Test thoroughly**

   ```bash
   npm run compile
   npm test
   ```

4. **Commit with descriptive messages**

   ```bash
   git commit -m "feat: add support for Ruby environments"
   ```

5. **Push and create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Wait for review**
   - Address feedback
   - Keep PR focused and small

## 🐛 Bug Reports

When filing a bug report, please include:

- VS Code version
- Attune version
- Operating system
- Shell type
- Steps to reproduce
- Expected vs actual behavior
- Relevant logs (Output > Attune)

## 💡 Feature Requests

We welcome feature requests! Please:

- Check existing issues first
- Describe the use case
- Explain why it would be useful
- Provide examples if possible

## 📋 Roadmap

Potential future features:

- [ ] Support for more languages (Ruby, Go, Rust, etc.)
- [ ] Environment profiles per workspace folder
- [ ] Auto-switching based on file type
- [ ] Integration with Docker/DevContainers
- [ ] Custom shell command templates
- [ ] Environment variable management

## 📞 Contact

- GitHub Issues: [github.com/yourusername/attune/issues](https://github.com/yourusername/attune/issues)
- Discussions: [github.com/yourusername/attune/discussions](https://github.com/yourusername/attune/discussions)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
