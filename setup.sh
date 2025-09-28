#!/bin/bash

echo "🚀 Setting up Advanced Build System v2.0..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 14.0.0 or higher.${NC}"
    echo -e "${YELLOW}💡 Visit: https://nodejs.org${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="14.0.0"
if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    echo -e "${RED}❌ Node.js version $NODE_VERSION is not supported. Please upgrade to $REQUIRED_VERSION or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: v$NODE_VERSION${NC}"

# Install dependencies
echo ""
echo -e "${BLUE}📦 Installing dependencies...${NC}"
if npm install; then
    echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Create directories
echo ""
echo -e "${BLUE}📁 Creating directories...${NC}"
mkdir -p css js dist

# Create CSS files with empty templates for user customization
echo -e "${CYAN}🎨 Creating CSS files...${NC}"

cat > css/styles.css << 'EOF'
/* 
 * Main Styles - Add your custom styles here
 * This file will be processed and minified to styles.min.css
 */

/* Example styles - replace with your own */
:root {
  --primary: #007bff;
  --secondary: #6c757d;
  --success: #28a745;
  --danger: #dc3545;
  --warning: #ffc107;
  --info: #17a2b8;
}

/* Add your styles below */
EOF

cat > css/vendor.css << 'EOF'
/* 
 * Vendor/Third-party CSS - Add vendor stylesheets here
 * This file will be processed and minified to vendor.min.css
 */

/* Examples: Bootstrap, Foundation, Material UI, etc. */

/* Add your vendor CSS below */
EOF

# Create JS files with empty templates for user customization
echo -e "${YELLOW}⚡ Creating JavaScript files...${NC}"

cat > js/main.js << 'EOF'
/* 
 * Main JavaScript - Add your main application code here
 * This file will be processed, transpiled, and minified to main.min.js
 */

// Example main application class - replace with your own
class App {
  constructor() {
    this.version = '1.0.0';
    this.init();
  }

  init() {
    console.log(`🚀 App v${this.version} initialized`);
    // Add your initialization code here
  }
}

// Add your main application code below
EOF

cat > js/plugins.js << 'EOF'
/* 
 * Plugins/Utilities JavaScript - Add your utility functions and plugins here
 * This file will be processed, transpiled, and minified to plugins.min.js
 */

// Example utility functions - replace with your own
const Utils = {
  // DOM ready function
  ready: function(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  },

  // Simple selector function
  $: function(selector) {
    return document.querySelector(selector);
  }
};

// Add your utility functions and plugins below
EOF

# Create HTML file with empty template for user customization
echo -e "${PURPLE}🌐 Creating HTML file...${NC}"

cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Build System v2.0 - VIKRI AHPAD TANTOWI</title>
    
    <!-- Meta tags -->
    <meta name="description" content="Advanced Build System for CSS, JavaScript, and HTML processing">
    <meta name="author" content="VIKRI AHPAD TANTOWI">
    
    <!-- CSS Files (will be minified) -->
    <link rel="stylesheet" href="vendor.min.css">
    <link rel="stylesheet" href="styles.min.css">
</head>
<body>
    <!-- Add your HTML content here -->
    
    <header>
        <h1>Welcome to Advanced Build System v2.0</h1>
        <p>Your HTML, CSS, and JavaScript build system is ready!</p>
    </header>

    <main>
        <section>
            <h2>Build System Features</h2>
            <ul>
                <li>✅ CSS Processing with PostCSS</li>
                <li>✅ JavaScript Transpilation with Babel</li>
                <li>✅ HTML Minification with source maps</li>
                <li>✅ Watch mode for development</li>
                <li>✅ Production optimization</li>
            </ul>
        </section>

        <section>
            <h2>Getting Started</h2>
            <ol>
                <li>Edit your CSS files in the <code>css/</code> directory</li>
                <li>Edit your JavaScript files in the <code>js/</code> directory</li>
                <li>Edit this HTML file as needed</li>
                <li>Run <code>npm run build</code> to build all files</li>
                <li>Open the minified HTML files in your browser</li>
            </ol>
        </section>
    </main>

    <!-- JavaScript Files (will be minified) -->
    <script src="plugins.min.js"></script>
    <script src="main.min.js"></script>
</body>
</html>
EOF

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo ""
echo -e "${CYAN}📁 Project structure:${NC}"
echo -e "├── css/"
echo -e "│   ├── styles.css      ${YELLOW}(Your main styles - customize this)${NC}"
echo -e "│   └── vendor.css      ${YELLOW}(Third-party styles - customize this)${NC}"
echo -e "├── js/"
echo -e "│   ├── main.js         ${YELLOW}(Your main application - customize this)${NC}"
echo -e "│   └── plugins.js      ${YELLOW}(Your utilities & plugins - customize this)${NC}"
echo -e "├── dist/               ${BLUE}(Build output - will be created after build)${NC}"
echo -e "├── index.html          ${YELLOW}(Your main HTML file - customize this)${NC}"
echo -e "├── package.json        ${GREEN}(Dependencies & scripts)${NC}"
echo -e "├── css-builder.js      ${GREEN}(CSS build system)${NC}"
echo -e "├── js-builder.js       ${GREEN}(JavaScript build system)${NC}"
echo -e "├── html-builder.js     ${GREEN}(HTML build system)${NC}"
echo -e "└── index.js            ${GREEN}(Main build system)${NC}"
echo ""
echo -e "${PURPLE}🎯 Available Commands:${NC}"
echo -e "${GREEN}• npm run build${NC}           - Build all files (CSS, JS, HTML)"
echo -e "${GREEN}• npm run build:production${NC} - Optimized production build"
echo -e "${GREEN}• npm run dev${NC}             - Development mode with watch"
echo -e "${GREEN}• npm run watch${NC}           - Watch mode for all file types"
echo -e "${GREEN}• npm run clean${NC}           - Clean build files"
echo -e "${GREEN}• npm run analyze${NC}         - Analyze bundle sizes"
echo ""
echo -e "${BLUE}🚀 Next steps:${NC}"
echo -e "1. ${CYAN}Customize your files${NC}    - Edit CSS, JS, and HTML files"
echo -e "2. ${CYAN}npm run build${NC}           - Build all files"
echo -e "3. ${CYAN}Open index.min.html${NC}     - View your built website"
echo -e "4. ${CYAN}npm run dev${NC}             - Start development mode"
echo ""
echo -e "${PURPLE}💡 Pro Tips:${NC}"
echo -e "• HTML files will be minified and obfuscated in production mode"
echo -e "• Use ${YELLOW}--production${NC} flag for maximum optimization and obfuscation"
echo -e "• Source maps are generated for easier debugging"
echo -e "• The build system handles file watching automatically"
echo ""
echo -e "${GREEN}🎉 Happy building!${NC}"

# Make the script executable for future runs
chmod +x setup.sh