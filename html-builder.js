const fs = require('fs').promises;
const path = require('path');

class HTMLBuilder {
  constructor(config = {}) {
    this.config = {
      inputDir: config.inputDir || '.',
      outputDir: config.outputDir || '.',
      minify: config.minify !== false,
      obfuscate: config.obfuscate || false,
      watch: config.watch || false,
      sourceMaps: config.sourceMaps !== false,
      ...config
    };

    this.minifyOptions = {
      removeComments: true,
      removeCommentsFromCDATA: true,
      removeCDATASectionsFromCDATA: true,
      collapseWhitespace: true,
      conservativeCollapse: false,
      preserveLineBreaks: false,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      preventAttributesEscaping: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true,
      removeIgnored: false,
      removeEmptyElements: false,
      lint: false,
      keepClosingSlash: false,
      caseSensitive: false,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: false,
      ...this.config.minifyOptions
    };
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  // Simple HTML minifier (tidak menggunakan library eksternal)
  minifyHTML(html) {
    if (!this.config.minify) return html;

    return html
      // Remove HTML comments (kecuali conditional comments)
      .replace(/<!--(?!\[if\s)[\s\S]*?-->/g, '')
      // Remove whitespace between tags
      .replace(/>\s+</g, '><')
      // Remove multiple whitespaces
      .replace(/\s{2,}/g, ' ')
      // Remove whitespace around = in attributes
      .replace(/\s*=\s*/g, '=')
      // Remove quotes from attributes jika tidak perlu
      .replace(/=["']([^"'\s>]*?)["']/g, '=$1')
      // Remove trailing spaces
      .replace(/\s+$/gm, '')
      // Remove leading spaces
      .replace(/^\s+/gm, '')
      // Join lines
      .replace(/\n/g, '')
      .trim();
  }

  // Obfuscate HTML structure (membuat susah dibaca tapi fungsi sama)
  obfuscateHTML(html) {
    if (!this.config.obfuscate) return html;

    let obfuscated = html;
    const classMap = new Map();
    const idMap = new Map();
    
    // Generate random strings untuk class dan id
    const generateRandomString = (length = 8) => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    // Replace class names
    const classMatches = obfuscated.match(/class=["']([^"']*)["']/g) || [];
    classMatches.forEach(match => {
      const classes = match.match(/class=["']([^"']*)["']/)[1].split(/\s+/);
      let newClasses = classes.map(cls => {
        if (!classMap.has(cls)) {
          classMap.set(cls, generateRandomString());
        }
        return classMap.get(cls);
      }).join(' ');
      
      obfuscated = obfuscated.replace(match, `class="${newClasses}"`);
    });

    // Replace id names
    const idMatches = obfuscated.match(/id=["']([^"']*)["']/g) || [];
    idMatches.forEach(match => {
      const id = match.match(/id=["']([^"']*)["']/)[1];
      if (!idMap.has(id)) {
        idMap.set(id, generateRandomString());
      }
      obfuscated = obfuscated.replace(match, `id="${idMap.get(id)}"`);
    });

    return obfuscated;
  }

  async processFile(inputFile, outputFile) {
    try {
      console.log(`🌐 Processing: ${inputFile}`);
      const startTime = Date.now();

      let html = await fs.readFile(inputFile, 'utf8');
      const originalSize = Buffer.byteLength(html, 'utf8');

      // Create source map data
      let sourceMapData = null;
      if (this.config.sourceMaps) {
        sourceMapData = {
          version: 3,
          file: path.basename(outputFile),
          sourceRoot: '',
          sources: [path.relative(path.dirname(outputFile), inputFile)],
          names: [],
          mappings: 'AAAA', // Simple mapping
          sourcesContent: [html]
        };
      }

      // Apply obfuscation first
      if (this.config.obfuscate) {
        html = this.obfuscateHTML(html);
        console.log(`🔒 HTML obfuscated`);
      }

      // Apply minification
      html = this.minifyHTML(html);

      // Ensure output directory exists
      await this.ensureDirectoryExists(path.dirname(outputFile));

      // Write HTML file
      await fs.writeFile(outputFile, html);

      // Write source map if enabled
      if (sourceMapData && this.config.sourceMaps) {
        const mapFile = `${outputFile}.map`;
        await fs.writeFile(mapFile, JSON.stringify(sourceMapData, null, 2));
        
        // Add source map reference to HTML
        const htmlWithMap = html + `\n<!--# sourceMappingURL=${path.basename(mapFile)} -->`;
        await fs.writeFile(outputFile, htmlWithMap);
        
        console.log(`✅ Source map created: ${path.basename(mapFile)}`);
      }

      const endTime = Date.now();
      const finalSize = Buffer.byteLength(html, 'utf8');
      const compression = ((originalSize - finalSize) / originalSize * 100).toFixed(1);

      console.log(`✅ ${path.basename(outputFile)} created successfully!`);
      console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`   Minified: ${(finalSize / 1024).toFixed(2)} KB`);
      console.log(`   Saved: ${compression}%`);
      console.log(`   Time: ${endTime - startTime}ms\n`);

      return { html, sourceMap: sourceMapData };
    } catch (error) {
      console.error(`❌ Error processing ${inputFile}:`, error.message);
      throw error;
    }
  }

  async buildFile(fileName) {
    const inputFile = path.join(this.config.inputDir, fileName);
    // Output langsung ke root directory (tidak ke dist), tetap nama .html
    const outputFile = fileName;

    try {
      await fs.access(inputFile);
      return await this.processFile(inputFile, outputFile);
    } catch {
      console.warn(`⚠️  File not found: ${inputFile}`);
      return null;
    }
  }

  async buildAll() {
    console.log('🚀 Starting HTML build process...\n');
    const startTime = Date.now();

    try {
      // Ensure input directory exists
      await fs.access(this.config.inputDir);
    } catch {
      console.error(`❌ Input directory not found: ${this.config.inputDir}`);
      return;
    }

    try {
      // Get all HTML files from current directory
      const files = await fs.readdir(this.config.inputDir);
      const htmlFiles = files.filter(file => 
        file.endsWith('.html') && !file.endsWith('.min.html')
      );

      if (htmlFiles.length === 0) {
        console.warn('⚠️  No HTML files found in input directory');
        return;
      }

      console.log(`📁 Found ${htmlFiles.length} HTML files: ${htmlFiles.join(', ')}\n`);

      // Process files
      const results = await Promise.allSettled(
        htmlFiles.map(file => this.buildFile(file))
      );

      // Summary
      const successful = results.filter(r => r.status === 'fulfilled' && r.value !== null).length;
      const failed = results.filter(r => r.status === 'rejected' || r.value === null).length;
      const totalTime = Date.now() - startTime;

      console.log('📊 HTML Build Summary:');
      console.log(`   ✅ Successful: ${successful}`);
      if (failed > 0) console.log(`   ❌ Failed: ${failed}`);
      console.log(`   ⏱️  Total time: ${totalTime}ms`);

    } catch (error) {
      console.error('❌ HTML build failed:', error.message);
    }
  }

  async watch() {
    if (!this.config.watch) return;

    try {
      const chokidar = require('chokidar');
      console.log(`👀 Watching ${this.config.inputDir} for HTML changes...\n`);

      const watcher = chokidar.watch(`${this.config.inputDir}/**/*.html`, {
        ignored: /\.min\.html$/,
        persistent: true
      });

      watcher.on('change', async (filePath) => {
        console.log(`🔄 HTML file changed: ${filePath}`);
        const fileName = path.basename(filePath);
        await this.buildFile(fileName);
      });

      watcher.on('add', async (filePath) => {
        console.log(`➕ New HTML file: ${filePath}`);
        const fileName = path.basename(filePath);
        await this.buildFile(fileName);
      });
    } catch (error) {
      console.warn('⚠️  Watch mode not available (chokidar not installed)');
    }
  }
}

// CLI support
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const builder = new HTMLBuilder({
    watch: args.includes('--watch'),
    minify: !args.includes('--no-minify'),
    obfuscate: args.includes('--obfuscate'),
    sourceMaps: !args.includes('--no-maps')
  });

  switch (command) {
    case 'build':
      builder.buildAll();
      break;
    case 'watch':
      builder.buildAll().then(() => builder.watch());
      break;
    default:
      console.log('Usage: node html-builder.js [build|watch] [options]');
      console.log('Options:');
      console.log('  --watch       Enable watch mode');
      console.log('  --no-minify   Disable minification');
      console.log('  --obfuscate   Obfuscate class/id names');
      console.log('  --no-maps     Disable source maps');
      break;
  }
}

module.exports = HTMLBuilder;