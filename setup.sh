#!/bin/bash

echo "🚀 Setting up Advanced Build System..."
echo ""

# Create directories
echo "📁 Creating directories..."
mkdir -p css js dist

# Create CSS files
echo "🎨 Creating CSS files..."

cat > css/styles.css << 'EOF'
/* Main Styles */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --border-radius: 4px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.btn-clicked {
  transform: scale(0.95);
}

.card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.header {
  background: linear-gradient(135deg, var(--primary-color), #0056b3);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 16px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 40px 0;
}

.grid.mobile-layout {
  grid-template-columns: 1fr;
}

@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
EOF

cat > css/vendor.css << 'EOF'
/* Vendor/Library styles */
.animate__animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.animate__fadeIn {
  animation-name: fadeIn;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate__slideInUp {
  animation-name: slideInUp;
}

@keyframes slideInUp {
  from {
    transform: translate3d(0, 100%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

/* Bootstrap-like utilities */
.d-none { display: none !important; }
.d-block { display: block !important; }
.d-flex { display: flex !important; }
.justify-content-center { justify-content: center !important; }
.align-items-center { align-items: center !important; }
.text-center { text-align: center !important; }
.text-left { text-align: left !important; }
.text-right { text-align: right !important; }
.mb-0 { margin-bottom: 0 !important; }
.mb-1 { margin-bottom: 0.25rem !important; }
.mb-2 { margin-bottom: 0.5rem !important; }
.mb-3 { margin-bottom: 1rem !important; }
.mb-4 { margin-bottom: 1.5rem !important; }
.mb-5 { margin-bottom: 3rem !important; }

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
}

.modal.show {
  display: flex;
  align-items: center;
  justify-content: center;
}
EOF

# Create JS files
echo "⚡ Creating JavaScript files..."

cat > js/main.js << 'EOF'
// Main Application JavaScript
class App {
  constructor() {
    this.version = '1.0.0';
    this.initialized = false;
    this.components = new Map();
    
    this.init();
  }

  init() {
    console.log(`🚀 App v${this.version} initializing...`);
    
    this.bindEvents();
    this.loadComponents();
    
    this.initialized = true;
    console.log('✅ App initialized successfully!');
  }

  bindEvents() {
    document.addEventListener('DOMContentLoaded', () => {
      this.onDOMReady();
    });

    window.addEventListener('load', () => {
      this.onWindowLoad();
    });

    window.addEventListener('resize', this.debounce(() => {
      this.onResize();
    }, 250));
  }

  onDOMReady() {
    console.log('📄 DOM is ready');
    this.initializeButtons();
    this.initializeCards();
  }

  onWindowLoad() {
    console.log('🌐 Window loaded');
    this.showContent();
  }

  onResize() {
    console.log('📱 Window resized');
    this.updateLayout();
  }

  initializeButtons() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleButtonClick(e);
      });
    });
  }

  initializeCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate__animated', 'animate__fadeIn');
    });
  }

  handleButtonClick(event) {
    const button = event.currentTarget;
    button.classList.add('btn-clicked');
    
    setTimeout(() => {
      button.classList.remove('btn-clicked');
    }, 300);

    console.log('🔘 Button clicked:', button.textContent);
  }

  showContent() {
    const content = document.querySelector('.content');
    if (content) {
      content.classList.add('animate__animated', 'animate__slideInUp');
    }
  }

  updateLayout() {
    const grid = document.querySelector('.grid');
    if (grid && window.innerWidth < 768) {
      grid.classList.add('mobile-layout');
    } else if (grid) {
      grid.classList.remove('mobile-layout');
    }
  }

  loadComponents() {
    // Dynamic component loading
    this.components.set('modal', new ModalComponent());
    this.components.set('tooltip', new TooltipComponent());
    console.log(`📦 Loaded ${this.components.size} components`);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  getComponent(name) {
    return this.components.get(name);
  }

  destroy() {
    this.components.clear();
    this.initialized = false;
    console.log('🗑️  App destroyed');
  }
}

// Component classes
class ModalComponent {
  constructor() {
    this.isOpen = false;
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-modal-trigger]')) {
        this.open(e.target.dataset.modalTrigger);
      }
      if (e.target.matches('[data-modal-close]')) {
        this.close();
      }
    });
  }

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      this.isOpen = true;
      console.log('🔲 Modal opened:', modalId);
    }
  }

  close() {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
      modal.classList.remove('show');
    });
    this.isOpen = false;
    console.log('🔲 Modal closed');
  }
}

class TooltipComponent {
  constructor() {
    this.tooltips = [];
    this.init();
  }

  init() {
    const elements = document.querySelectorAll('[data-tooltip]');
    elements.forEach(el => {
      this.createTooltip(el);
    });
  }

  createTooltip(element) {
    const tooltip = {
      element,
      text: element.dataset.tooltip,
      position: element.dataset.tooltipPosition || 'top'
    };

    element.addEventListener('mouseenter', () => {
      this.showTooltip(tooltip);
    });

    element.addEventListener('mouseleave', () => {
      this.hideTooltip(tooltip);
    });

    this.tooltips.push(tooltip);
  }

  showTooltip(tooltip) {
    console.log('💬 Showing tooltip:', tooltip.text);
  }

  hideTooltip(tooltip) {
    console.log('💬 Hiding tooltip');
  }
}

// Initialize app when script loads
const app = new App();

// Export for global access
window.App = app;
EOF

cat > js/plugins.js << 'EOF'
// Third-party plugins and utilities
(function(window) {
  'use strict';

  // Simple event emitter
  class EventEmitter {
    constructor() {
      this.events = {};
    }

    on(event, callback) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(callback);
    }

    off(event, callback) {
      if (this.events[event]) {
        this.events[event] = this.events[event].filter(cb => cb !== callback);
      }
    }

    emit(event, ...args) {
      if (this.events[event]) {
        this.events[event].forEach(callback => {
          callback.apply(this, args);
        });
      }
    }
  }

  // HTTP utility
  class HTTPClient {
    constructor(baseURL = '') {
      this.baseURL = baseURL;
      this.defaults = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }

    async request(url, options = {}) {
      const config = {
        ...this.defaults,
        ...options,
        headers: {
          ...this.defaults.headers,
          ...options.headers
        }
      };

      try {
        const response = await fetch(this.baseURL + url, config);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        
        return await response.text();
      } catch (error) {
        console.error('HTTP Request failed:', error);
        throw error;
      }
    }

    get(url, options = {}) {
      return this.request(url, { ...options, method: 'GET' });
    }

    post(url, data = {}, options = {}) {
      return this.request(url, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data)
      });
    }
  }

  // Storage utility
  class Storage {
    constructor(type = 'localStorage') {
      this.storage = window[type] || {};
      this.prefix = 'app_';
    }

    set(key, value) {
      try {
        const serializedValue = JSON.stringify(value);
        this.storage[this.prefix + key] = serializedValue;
        return true;
      } catch (error) {
        console.error('Storage set error:', error);
        return false;
      }
    }

    get(key, defaultValue = null) {
      try {
        const item = this.storage[this.prefix + key];
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Storage get error:', error);
        return defaultValue;
      }
    }
  }

  // Export all utilities
  window.Plugins = {
    EventEmitter,
    HTTPClient,
    Storage
  };

  console.log('🔧 Plugins loaded successfully!');

})(window);
EOF

# Create HTML file
echo "🌐 Creating HTML file..."

cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Build System Test - VIKRI AHPAD TANTOWI</title>
    <link rel="stylesheet" href="dist/styles.min.css">
    <link rel="stylesheet" href="dist/vendor.min.css">
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>Advanced Build System</h1>
            <p>Created by VIKRI AHPAD TANTOWI</p>
            <button class="btn btn-primary" data-tooltip="Click me to test!">Get Started</button>
        </div>
    </div>

    <div class="container">
        <div class="content">
            <div class="grid">
                <div class="card">
                    <h3>CSS Features</h3>
                    <p>✅ PostCSS Processing</p>
                    <p>✅ Autoprefixer</p>
                    <p>✅ CSSnano Minification</p>
                    <p>✅ Source Maps</p>
                    <p>✅ PurgeCSS (Optional)</p>
                </div>

                <div class="card">
                    <h3>JavaScript Features</h3>
                    <p>✅ Babel Transpilation</p>
                    <p>✅ Terser Minification</p>
                    <p>✅ Rollup Bundling</p>
                    <p>✅ Source Maps</p>
                    <p>✅ ES6+ Support</p>
                </div>

                <div class="card">
                    <h3>Development Tools</h3>
                    <p>✅ Watch Mode</p>
                    <p>✅ Parallel Processing</p>
                    <p>✅ Error Handling</p>
                    <p>✅ Build Statistics</p>
                    <p>✅ CLI Support</p>
                </div>
            </div>

            <div class="card">
                <h3>🚀 Quick Commands</h3>
                <p><code>npm run build</code> - Build all files</p>
                <p><code>npm run build:production</code> - Production build</p>
                <p><code>npm run dev</code> - Development with watch</p>
                <p><code>npm run clean</code> - Clean dist folder</p>
            </div>
        </div>
    </div>

    <script src="dist/plugins.min.js"></script>
    <script src="dist/main.min.js"></script>
</body>
</html>
EOF

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📁 Project structure:"
echo "├── css/"
echo "│   ├── styles.css      (Main styles)"
echo "│   └── vendor.css      (Vendor/library styles)"
echo "├── js/"
echo "│   ├── main.js         (Main application)"
echo "│   └── plugins.js      (Utilities & plugins)"
echo "├── dist/               (Build output - will be created)"
echo "├── index.html          (Test page)"
echo "├── package.json        (Dependencies & scripts)"
echo "├── css-builder.js      (CSS build system)"
echo "├── js-builder.js       (JS build system)"
echo "└── index.js            (Main build system)"
echo ""
echo "🎯 Next steps:"
echo "1. npm install          (Install dependencies)"
echo "2. npm run build        (Build all files)"
echo "3. Open index.html      (View result)"
echo ""
echo "🎉 Happy building!"