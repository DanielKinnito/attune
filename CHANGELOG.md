# Changelog

All notable changes to the "Attune" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2025-11-26

### Added

- Initial release
- Automatic detection of Node.js environments (package.json)
- Automatic detection of Python virtual environments (venv, .venv, env)
- Support for Node version managers (.nvmrc, .tool-versions)
- Cross-shell support (PowerShell, CMD, Bash, Zsh, Fish)
- Custom environment profiles via `.vscode/attune.json`
- Startup command automation
- Status bar indicator showing active environment
- `Attune: Switch Environment` command
- Recursive workspace scanning with configurable depth
- Smart deduplication of detected environments

[Unreleased]: https://github.com/yourusername/attune/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/yourusername/attune/releases/tag/v0.0.1
