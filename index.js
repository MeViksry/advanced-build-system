const fs = require('fs').promises;
const path = require('path');
const CSSBuilder = require('./css-builder');
const JSBuilder = require('./js-builder');
const HTMLBuilder = require('./html-builder');

class AdvancedBuildSystem {
  constructor(config = {}) {
    this.config = {
      production: config.production || false,
      watch: config.watch || false,
      clean: config.clean !== false,
      parallel: config.parallel !== false,
      sourceMaps: config.sourceMaps !== false,
      ...config
    };

    // Initialize builders
    this.cssBuilder = new CSSBuilder({
      ...this.config.css,
      production: this.config.production,
      watch: this.config.watch,
      sourceMaps: this.config.sourceMaps
    });

    this.jsBuilder = new JSBuilder({
      ...this.config.js,
      production: this.config.production,
      watch: this.config.watch,
      sourceMaps: this.config.sourceMaps
    });

    this.htmlBuilder = new HTMLBuilder({
      ...this.config.html,
      production: this.config.production,
      watch: this.config.watch,
      sourceMaps: this.config.sourceMaps
    });
  }

  async cleanBuildDirectories() {
    if (!this.config.clean) return;

    console.log('🧹 Cleaning build directories...');
    
    try {
      const filesToRemove = ['*.min.html', '*.min.html.map'];
      const distPath = 'dist';

      // Clean HTML files in root
      const files = await fs.readdir('.');
      for (const file of files) {
        if (file.endsWith('.min.html') || file.endsWith('.min.html.map')) {
          await fs.unlink(file);
          console.log(`   🗑️  Removed: ${file}`);
        }
      }

      // Clean dist directory
      try {
        await fs.access(distPath);
        const distFiles = await fs.readdir(distPath);
        
        for (const file of distFiles) {
          const filePath = path.join(distPath, file);
          const stats = await fs.stat(filePath);
          
          if (stats.isFile()) {
            await fs.unlink(filePath);
            console.log(`   🗑️  Removed: ${filePath}`);
          }
        }
      } catch {
        // Dist directory doesn't exist, that's fine
      }

      console.log('✅ Clean completed!\n');
    } catch (error) {
      console.warn('⚠️  Clean failed:', error.message);
    }
  }

  async buildSequential() {
    console.log('🔄 Running sequential build...\n');
    const startTime = Date.now();

    try {
      // Build CSS first
      console.log('🎨 Building CSS...');
      await this.cssBuilder.buildAll();

      // Build JavaScript second
      console.log('⚡ Building JavaScript...');
      await this.jsBuilder.buildAll();

      // Build HTML last
      console.log('🌐 Building HTML...');
      await this.htmlBuilder.buildAll();

      const totalTime = Date.now() - startTime;
      console.log('📊 Sequential Build Summary:');
      console.log(`   🎨 CSS: ✅ Completed`);
      console.log(`   ⚡ JS: ✅ Completed`);
      console.log(`   🌐 HTML: ✅ Completed`);
      console.log(`   ⏱️  Total time: ${totalTime}ms\n`);

    } catch (error) {
      console.error('❌ Sequential build failed:', error.message);
      throw error;
    }
  }

  async buildParallel() {
    console.log('🔄 Running parallel build...\n');
    const startTime = Date.now();

    try {
      // Run all builds in parallel
      const results = await Promise.allSettled([
        this.cssBuilder.buildAll(),
        this.jsBuilder.buildAll(),
        this.htmlBuilder.buildAll()
      ]);

      const totalTime = Date.now() - startTime;
      const cssResult = results[0].status === 'fulfilled' ? '✅' : '❌';
      const jsResult = results[1].status === 'fulfilled' ? '✅' : '❌';
      const htmlResult = results[2].status === 'fulfilled' ? '✅' : '❌';

      console.log('📊 Parallel Build Summary:');
      console.log(`   🎨 CSS: ${cssResult} ${results[0].status === 'fulfilled' ? 'Success' : 'Failed'}`);
      console.log(`   ⚡ JS: ${jsResult} ${results[1].status === 'fulfilled' ? 'Success' : 'Failed'}`);
      console.log(`   🌐 HTML: ${htmlResult} ${results[2].status === 'fulfilled' ? 'Success' : 'Failed'}`);
      console.log(`   ⏱️  Total time: ${totalTime}ms\n`);

      // Check for failures
      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length > 0) {
        console.warn('⚠️  Some builds failed:');
        failures.forEach((failure, index) => {
          const type = ['CSS', 'JS', 'HTML'][index];
          console.warn(`   ${type}: ${failure.reason.message}`);
        });
      }

    } catch (error) {
      console.error('❌ Parallel build failed:', error.message);
      throw error;
    }
  }

  async buildAll() {
    console.log('🚀 Starting complete build process...\n');

    // Clean if enabled
    if (this.config.clean) {
      await this.cleanBuildDirectories();
    }

    // Choose build strategy
    if (this.config.parallel) {
      await this.buildParallel();
    } else {
      await this.buildSequential();
    }

    console.log('🎉 Build completed successfully!');
  }

  async watch() {
    console.log('👀 Starting watch mode...\n');

    // Initial build
    await this.buildAll();

    console.log('👀 Watching for file changes... (Press Ctrl+C to stop)\n');

    // Start all watchers
    await Promise.all([
      this.cssBuilder.watch(),
      this.jsBuilder.watch(),
      this.htmlBuilder.watch()
    ]);
  }

  async getProjectStats() {
    try {
      const stats = {
        css: { files: 0, size: 0 },
        js: { files: 0, size: 0 },
        html: { files: 0, size: 0 },
        dist: { files: 0, size: 0 }
      };

      // CSS stats
      try {
        const cssFiles = await fs.readdir('css');
        stats.css.files = cssFiles.filter(f => f.endsWith('.css')).length;
        for (const file of cssFiles) {
          if (file.endsWith('.css')) {
            const filePath = path.join('css', file);
            const stat = await fs.stat(filePath);
            stats.css.size += stat.size;
          }
        }
      } catch {}

      // JS stats  
      try {
        const jsFiles = await fs.readdir('js');
        stats.js.files = jsFiles.filter(f => f.endsWith('.js')).length;
        for (const file of jsFiles) {
          if (file.endsWith('.js')) {
            const filePath = path.join('js', file);
            const stat = await fs.stat(filePath);
            stats.js.size += stat.size;
          }
        }
      } catch {}

      // HTML stats
      try {
        const files = await fs.readdir('.');
        const htmlFiles = files.filter(f => f.endsWith('.html') && !f.endsWith('.min.html'));
        stats.html.files = htmlFiles.length;
        for (const file of htmlFiles) {
          const stat = await fs.stat(file);
          stats.html.size += stat.size;
        }
      } catch {}

      // Dist stats
      try {
        const distFiles = await fs.readdir('dist');
        stats.dist.files = distFiles.length;
        for (const file of distFiles) {
          const filePath = path.join('dist', file);
          const stat = await fs.stat(filePath);
          stats.dist.size += stat.size;
        }
      } catch {}

      return stats;
    } catch (error) {
      console.error('❌ Failed to get project stats:', error.message);
      return null;
    }
  }

  async showStats() {
    console.log('📈 Getting project statistics...\n');

    const stats = await this.getProjectStats();
    if (!stats) return;

    console.log('📊 Project Statistics:');
    console.log(`   🎨 CSS Files: ${stats.css.files} (${(stats.css.size / 1024).toFixed(2)} KB)`);
    console.log(`   ⚡ JS Files: ${stats.js.files} (${(stats.js.size / 1024).toFixed(2)} KB)`);
    console.log(`   🌐 HTML Files: ${stats.html.files} (${(stats.html.size / 1024).toFixed(2)} KB)`);
    console.log(`   📦 Built Files: ${stats.dist.files} (${(stats.dist.size / 1024).toFixed(2)} KB)`);
    
    const totalSource = stats.css.size + stats.js.size + stats.html.size;
    const totalBuilt = stats.dist.size;
    const compressionRatio = totalSource > 0 ? ((totalSource - totalBuilt) / totalSource * 100).toFixed(1) : 0;
    
    console.log(`   📊 Total Source: ${(totalSource / 1024).toFixed(2)} KB`);
    console.log(`   🗜️  Total Built: ${(totalBuilt / 1024).toFixed(2)} KB`);
    console.log(`   💾 Compression: ${compressionRatio}% saved`);
  }
}

// CLI support
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const buildSystem = new AdvancedBuildSystem({
    production: args.includes('--production'),
    watch: args.includes('--watch'),
    clean: args.includes('--clean'),
    parallel: !args.includes('--sequential'),
    sourceMaps: !args.includes('--no-maps'),
    
    // CSS specific options
    css: {
      purgeCSS: args.includes('--purge')
    },
    
    // JS specific options  
    js: {
      bundle: args.includes('--bundle'),
      minify: !args.includes('--no-minify')
    },
    
    // HTML specific options
    html: {
      obfuscate: args.includes('--obfuscate')
    }
  });

  switch (command) {
    case 'build':
      buildSystem.buildAll();
      break;
    case 'watch':
      buildSystem.watch();
      break;
    case 'stats':
      buildSystem.showStats();
      break;
    case 'clean':
      buildSystem.cleanBuildDirectories();
      break;
    default:
      console.log('🛠️  Advanced Build System v2.0');
      console.log('Usage: node index.js [command] [options]');
      console.log('');
      console.log('Commands:');
      console.log('  build       Build all files (CSS, JS, HTML)');
      console.log('  watch       Watch mode with auto-rebuild');
      console.log('  stats       Show project statistics');
      console.log('  clean       Clean build directories');
      console.log('');
      console.log('Options:');
      console.log('  --production    Production build with full optimization');
      console.log('  --watch         Enable watch mode');
      console.log('  --clean         Clean before build');
      console.log('  --sequential    Use sequential build instead of parallel');
      console.log('  --no-maps       Disable source maps');
      console.log('  --purge         Enable PurgeCSS for CSS');
      console.log('  --bundle        Bundle JavaScript files');
      console.log('  --no-minify     Disable minification');
      console.log('  --obfuscate     Obfuscate HTML class names and IDs');
      console.log('');
      console.log('Examples:');
      console.log('  node index.js build --production --clean');
      console.log('  node index.js watch --purge');
      console.log('  node index.js build --bundle --obfuscate');
      break;
  }
}

module.exports = AdvancedBuildSystem;