# Advanced Build System v2.0

<div align="center">

![Build System Banner](https://img.shields.io/badge/Build_System-Advanced_v2.0-blue?style=for-the-badge&logo=webpack)
![Version](https://img.shields.io/badge/Version-2.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-%3E%3D14.0.0-brightgreen?style=for-the-badge&logo=node.js)
![Made with Love](https://img.shields.io/badge/Made_with-Viksry-red?style=for-the-badge)

**Comprehensive build system for HTML, CSS, and JavaScript with advanced minification and obfuscation**

</div>

---

## What's New in v2.0

- **HTML Minification & Obfuscation** - Advanced HTML processing with class/ID obfuscation
- **One-Command Setup** - Automated dependency installation and project setup
- **Enhanced CLI** - More intuitive command-line interface with better error handling
- **Production Optimization** - Aggressive minification for production builds
- **Source Map Support** - Full source map support for all file types
- **Parallel Processing** - Faster builds with concurrent file processing
- **Watch Mode for All** - Real-time rebuilding for HTML, CSS, and JavaScript

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Commands](#commands)
- [File Processing](#file-processing)
- [Configuration](#configuration)
- [Development Workflow](#development-workflow)
- [Production Builds](#production-builds)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Processing Capabilities

| File Type | Processing Features | Output | Obfuscation |
|:---------:|:-------------------|:-------|:-----------|
| **HTML** | Minification, Comment removal, Whitespace optimization | `.min.html` | Class/ID obfuscation |
| **CSS** | PostCSS, Autoprefixer, CSSnano, PurgeCSS | `.min.css` | - |
| **JavaScript** | Babel transpilation, Terser minification, Rollup bundling | `.min.js` | Variable mangling |

### Development Features

- **Real-time Watch Mode** - Automatic rebuilding on file changes
- **Source Maps** - Debug minified code with original source references  
- **Parallel Processing** - Fast builds with concurrent file processing
- **Error Handling** - Graceful failures with detailed error messages
- **CLI Interface** - Intuitive command-line tools with help documentation

### Production Optimizations

- **HTML Obfuscation** - Class names and IDs are obfuscated to prevent easy reverse-engineering
- **CSS Purging** - Remove unused CSS classes automatically
- **JavaScript Bundling** - Combine multiple JS files into optimized bundles
- **Compression** - Aggressive minification for smallest file sizes
- **Browser Compatibility** - ES5 transpilation for legacy browser support

---

## Installation

### Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0

### Quick Setup

```bash
# Clone or download the project
git clone https://github.com/MeViksry/advanced-build-system
cd advanced-build-system

# Run automated setup (installs dependencies and creates template files)
npm run setup

# Build your project
npm run build
```

### Manual Setup

```bash
# Install dependencies
npm install

# Create project structure
chmod +x setup.sh
./setup.sh

# Start building
npm run build
```

---

## Quick Start

### 1. Basic Build

```bash
npm run build
```

This processes all HTML, CSS, and JavaScript files:
- `index.html` → `index.min.html`
- `css/styles.css` → `dist/styles.min.css`
- `js/main.js` → `dist/main.min.js`

### 2. Development Mode

```bash
npm run dev
```

Enables watch mode for all file types with automatic rebuilding on changes.

### 3. Production Build

```bash
npm run build:production
```

Creates optimized production builds with:
- HTML obfuscation
- CSS purging
- JavaScript bundling and aggressive minification
- No source maps

---

## Project Structure

```
advanced-build-system/
├── css/
│   ├── styles.css          # Your main styles (customize)
│   └── vendor.css          # Third-party styles (customize)
├── js/
│   ├── main.js            # Your main application (customize)
│   └── plugins.js         # Utilities and plugins (customize)
├── dist/                  # Build output (auto-generated)
│   ├── styles.min.css     # Minified CSS
│   ├── styles.min.css.map # CSS source map
│   ├── main.min.js        # Minified JavaScript
│   └── main.min.js.map    # JS source map
├── index.html             # Your main HTML (customize)
├── index.min.html         # Minified HTML (auto-generated)
├── index.min.html.map     # HTML source map (auto-generated)
├── css-builder.js         # CSS processing engine
├── js-builder.js          # JavaScript processing engine
├── html-builder.js        # HTML processing engine
├── index.js               # Main build system
├── package.json           # Project configuration
├── setup.sh               # Automated setup script
└── README.md              # This documentation
```

---

## Commands

### NPM Scripts

| Command | Description | Use Case |
|:--------|:-----------|:---------|
| `npm run setup` | Install dependencies and create templates | First-time setup |
| `npm run build` | Build all files (HTML, CSS, JS) | General development |
| `npm run build:production` | Optimized production build | Production deployment |
| `npm run dev` | Development with watch mode | Active development |
| `npm run watch` | Watch mode only | File monitoring |
| `npm run clean` | Clean all build files | Cleanup |
| `npm run analyze` | Bundle analysis and statistics | Performance audit |

### CLI Commands

```bash
# Main build system
node index.js build --production --clean
node index.js watch --purge --bundle
node index.js stats

# Individual builders
node css-builder.js build --purge --no-maps
node js-builder.js bundle --production
node html-builder.js build --obfuscate
```

### CLI Options

| Option | Description | Applies To |
|:-------|:-----------|:-----------|
| `--production` | Production mode with full optimization | All |
| `--watch` | Enable file watching | All |
| `--clean` | Clean before build | All |
| `--no-maps` | Disable source maps | All |
| `--sequential` | Sequential instead of parallel processing | All |
| `--purge` | Enable PurgeCSS | CSS |
| `--bundle` | Bundle JavaScript files | JavaScript |
| `--no-minify` | Disable minification | JavaScript |
| `--obfuscate` | Obfuscate HTML class names and IDs | HTML |

---

## File Processing

### HTML Processing

The HTML builder processes HTML files with the following optimizations:

#### Development Mode
```html
<!-- Input: index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My App</title>
    <link rel="stylesheet" href="dist/styles.min.css">
</head>
<body>
    <!-- Comments are preserved -->
    <div class="container">
        <h1 id="main-title">Hello World</h1>
    </div>
    <script src="dist/main.min.js"></script>
</body>
</html>
```

#### Production Mode
```html
<!-- Output: index.min.html (obfuscated) -->
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>My App</title><link rel="stylesheet" href="dist/styles.min.css"></head><body><div class="ca3b"><h1 id="ixa2">Hello World</h1></div><script src="dist/main.min.js"></script></body></html>
```

#### Features:
- **Minification**: Removes whitespace, comments, and optional tags
- **Obfuscation**: Class names and IDs are replaced with short, random strings
- **Source Maps**: Original HTML structure preserved in source maps
- **Content Preservation**: Text content and functionality remain unchanged

### CSS Processing

Uses PostCSS pipeline with multiple optimization plugins:

```css
/* Input: css/styles.css */
:root {
  --primary: #007bff;
}

.btn {
  padding: 12px 24px;
  background: var(--primary);
  transform: scale(1);
  transition: all 0.3s ease;
}

.btn:hover {
  transform: scale(1.05);
}
```

```css
/* Output: dist/styles.min.css */
:root{--primary:#007bff}.btn{padding:12px 24px;background:var(--primary);-webkit-transform:scale(1);transform:scale(1);transition:all .3s ease}.btn:hover{-webkit-transform:scale(1.05);transform:scale(1.05)}
```

#### Processing Pipeline:
1. **PostCSS**: Modern CSS processing
2. **Autoprefixer**: Vendor prefix addition
3. **PurgeCSS**: Unused CSS removal (production)
4. **CSSnano**: Compression and optimization

### JavaScript Processing

Advanced JavaScript processing with modern tooling:

```javascript
// Input: js/main.js
class App {
  constructor() {
    this.version = '2.0.0';
    this.elements = document.querySelectorAll('.interactive');
  }
  
  async init() {
    const data = await fetch('/api/data');
    console.log('App initialized');
  }
}

const app = new App();
```

```javascript
// Output: dist/main.min.js (ES5 compatible)
var App=function(){function t(){this.version="2.0.0",this.elements=document.querySelectorAll(".interactive")}return t.prototype.init=function(){return __awaiter(this,void 0,void 0,function(){var t;return __generator(this,function(e){switch(e.label){case 0:return[4,fetch("/api/data")];case 1:return t=e.sent(),console.log("App initialized"),[2]}})})},t}(),app=new App;
```

#### Processing Pipeline:
1. **Babel**: ES6+ → ES5 transpilation
2. **Rollup**: Module bundling (optional)
3. **Terser**: Minification and optimization
4. **Source Maps**: Debug support

---

## Configuration

### Environment-Specific Builds

#### Development Configuration
```bash
# Fast builds with debugging support
npm run build
# - Source maps enabled
# - No obfuscation
# - Readable output
# - Fast processing
```

#### Production Configuration
```bash
# Optimized builds for deployment
npm run build:production
# - No source maps
# - HTML obfuscation enabled
# - CSS purging enabled
# - Maximum compression
# - Variable mangling
```

### Custom Configuration

Create custom build configurations by modifying the builders:

```javascript
// Example: Custom CSS configuration
const cssBuilder = new CSSBuilder({
  inputDir: 'src/styles',
  outputDir: 'build/css',
  purgeCSS: true,
  purgeCSSOptions: {
    content: ['**/*.html', '**/*.js'],
    safelist: ['active', 'hidden', /^btn-/]
  }
});
```

---

## Development Workflow

### 1. Setup Your Project

```bash
# Initial setup
npm run setup

# This creates template files you can customize:
# - css/styles.css (your main styles)
# - css/vendor.css (third-party styles)  
# - js/main.js (your main application)
# - js/plugins.js (utilities and plugins)
# - index.html (your main HTML file)
```

### 2. Customize Your Files

Edit the template files created by setup:

- **CSS Files**: Add your styles to `css/styles.css` and vendor styles to `css/vendor.css`
- **JavaScript Files**: Add your code to `js/main.js` and utilities to `js/plugins.js`
- **HTML Files**: Customize `index.html` with your content

### 3. Development Mode

```bash
# Start watch mode for active development
npm run dev

# This will:
# - Build all files initially
# - Watch for changes
# - Automatically rebuild when files change
# - Generate source maps for debugging
```

### 4. Testing

Open the generated `.min.html` files in your browser to test your built application.

### 5. Production Deploy

```bash
# Create production-optimized builds
npm run build:production

# Deploy the .min.html files and dist/ directory
```

---

## Production Builds

Production builds are optimized for deployment with maximum compression and obfuscation:

### HTML Obfuscation

Class names and IDs are obfuscated to make reverse-engineering more difficult:

```html
<!-- Before -->
<div class="header-navigation main-menu">
  <ul class="menu-items">
    <li><a href="#" id="home-link">Home</a></li>
  </ul>
</div>

<!-- After -->
<div class="xa7b2 mf9k1">
  <ul class="nq8c4">
    <li><a href="#" id="zr3x9">Home</a></li>
  </ul>
</div>
```

### File Size Comparison

Typical compression results:

```
Source Files:
├── index.html          4.2 KB
├── css/styles.css      8.1 KB  
├── css/vendor.css      12.3 KB
└── js/main.js          6.8 KB
   Total: 31.4 KB

Production Build:
├── index.min.html      1.1 KB (-74%)
├── dist/styles.min.css 2.3 KB (-72%)
├── dist/vendor.min.css 3.1 KB (-75%)
└── dist/main.min.js    2.2 KB (-68%)
   Total: 8.7 KB (-72% overall)
```

### Security Features

- **HTML Obfuscation**: Makes it harder to understand page structure
- **JavaScript Minification**: Variable names are mangled
- **CSS Optimization**: Class names are shortened
- **Comment Removal**: All development comments are stripped

---

## Browser Support

| Browser | Version | Status |
|:--------|:--------|:-------|
| Chrome | 60+ | ✅ Full Support |
| Firefox | 60+ | ✅ Full Support |
| Safari | 10+ | ✅ Full Support |
| Edge | 79+ | ✅ Full Support |
| IE | 11 | ⚠️ Legacy Mode Required |

### Legacy Browser Support

For IE11 support, the build system automatically:
- Transpiles ES6+ to ES5
- Adds necessary polyfills
- Includes vendor prefixes
- Uses compatible syntax

---

## Troubleshooting

### Common Issues

#### Dependencies Not Found
```bash
# Problem: Missing optional dependencies
# Solution: Install all dependencies
npm install

# Or install specific missing packages
npm install @babel/core @babel/preset-env
npm install @fullhuman/postcss-purgecss
npm install rollup @rollup/plugin-node-resolve
```

#### Permission Errors
```bash
# Problem: Cannot execute setup.sh
# Solution: Make it executable
chmod +x setup.sh
./setup.sh
```

#### Build Failures
```bash
# Problem: Build process fails
# Solution: Clean and rebuild
npm run clean
npm run build
```

#### Watch Mode Not Working
```bash
# Problem: Files not rebuilding automatically
# Solution: Install chokidar dependency
npm install chokidar

# Or use polling mode
node index.js watch --poll
```

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/MeViksry/advanced-build-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MeViksry/advanced-build-system/discussions)
- **Email**: Create an issue on GitHub for fastest response

---

## Examples

### Basic Usage

```bash
# Setup new project
npm run setup

# Edit your files
vim css/styles.css
vim js/main.js  
vim index.html

# Build for development
npm run build

# Build for production
npm run build:production
```

### Advanced Usage

```bash
# Watch mode with CSS purging
npm run dev -- --purge

# Production build with bundling
npm run build:production -- --bundle

# Sequential build (useful for debugging)
node index.js build --sequential --clean

# Analyze bundle sizes
npm run analyze
```

### Integration Examples

#### With Git Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run build:production"
    }
  }
}
```

#### With CI/CD
```yaml
# .github/workflows/build.yml
name: Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      - name: Install dependencies
        run: npm install
      - name: Build production
        run: npm run build:production
```

---

## Contributing

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/advanced-build-system
cd advanced-build-system

# Install development dependencies
npm install

# Create a feature branch
git checkout -b feature/new-feature

# Make your changes and test
npm run build
npm test

# Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

### Contribution Guidelines

- Follow existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Ensure all builds pass before submitting PR
- Use descriptive commit messages

### Reporting Issues

When reporting bugs, please include:
- Operating system and version
- Node.js version
- Build system version
- Steps to reproduce the issue
- Expected vs actual behavior
- Error messages or logs

---

## Changelog

### v2.0.0 (Latest)
- Added HTML minification and obfuscation
- Implemented one-command setup with `npm run setup`
- Added parallel processing for faster builds
- Enhanced CLI with better error handling
- Added source map support for all file types
- Improved production optimizations

### v1.0.0
- Initial release
- CSS and JavaScript processing
- Basic build system functionality

---

## License

MIT License - see the [LICENSE](LICENSE) file for details.

This project is open source and available under the MIT License.

---

## Acknowledgments

Built with:
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [PostCSS](https://postcss.org/) - CSS processing
- [Babel](https://babeljs.io/) - JavaScript transpiler
- [Rollup](https://rollupjs.org/) - Module bundler
- [Terser](https://terser.org/) - JavaScript compressor
- [html-minifier-terser](https://github.com/terser/html-minifier-terser) - HTML minifier

Special thanks to the open source community for providing these excellent tools.

---

<div align="center">

**⭐ Star this project if it helped you!**

[![GitHub Stars](https://img.shields.io/github/stars/MeViksry/advanced-build-system?style=social)](https://github.com/MeViksry/advanced-build-system)
[![GitHub Forks](https://img.shields.io/github/forks/MeViksry/advanced-build-system?style=social)](https://github.com/MeViksry/advanced-build-system)

**Made with ❤️ by [VIKRI AHPAD TANTOWI](https://github.com/MeViksry)**

*Building the future, one build at a time*

</div>