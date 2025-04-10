# Contributing to Unix Timestamp Converter

Thank you for considering contributing to the Unix Timestamp Converter! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please create an issue with the following information:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Screenshots if applicable
- Any relevant details about your browser and environment

### Suggesting Enhancements

Enhancement suggestions are welcome! Please include:
- A clear description of the feature
- Rationale for why this would be valuable
- Any implementation ideas you may have

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

#### Pull Request Guidelines

- Update the README.md with details of changes if applicable
- Update the version number in manifest.json following [SemVer](https://semver.org/)
- The PR should work in Chrome (and ideally other Chromium-based browsers)
- Maintain the existing code style

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Available npm scripts:
   ```bash
   # Lint JavaScript files
   npm run lint
   
   # Fix linting issues automatically
   npm run lint:fix
   
   # Generate extension icons
   npm run generate-icons
   ```
4. Load the extension in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension directory

## Coding Style

- Use consistent indentation (2 spaces)
- Follow JavaScript best practices
- Keep functions small and focused
- Add comments for complex logic

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
