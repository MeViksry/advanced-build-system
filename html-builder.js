const fs = require('fs').promises;
const path = require('path');

class HTMLBuilder {
  constructor(config = {}) {
    this.config = {
      inputDir: config.inputDir || '.',
      outputDir: config.outputDir || '.',
      sourceMaps: config.sourceMaps !== false,
      minify: config.minify !== false,
      watch: config.watch || false,
      production: config.production || false,
      obfuscate: config.obfuscate || false,
      ...config
    };

    this.minifierOptions = this.getMinifierOptions();
  }

  getMinifierOptions() {
    return {
      caseSensitive: false,
      collapseWhitespace: true,
      conservativeCollapse: false,
      removeComments: true,
      removeCommentsFromCDATA: true,
      removeCDATASectionsFromCDATA: true,
      removeEmptyAttributes: true,
      removeEmptyElements: false,
      removeOptionalTags: false,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: this.config.production,
      minifyJS: this.config.production,
      minifyURLs: false,
      sortAttributes: true,
      sortClassName: true,
      ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/],
      ...this.config.minifierOptions
    };
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  // Simple HTML obfuscation to make it harder to read
  obfuscateHTML(html) {
    if (!this.config.obfuscate) return html;

    // Replace common class names and IDs with obfuscated versions
    const classMap = new Map();
    const idMap = new Map();
    let classCounter = 0;
    let idCounter = 0;

    // Generate random-like class names
    const generateObfuscatedName = (prefix, counter) => {
      const chars = 'abcdefghijklmnopqrstuvwxyz';
      let result = prefix;
      let num = counter;
      while (num > 0) {
        result += chars[num % chars.length];
        num = Math.floor(num / chars.length);
      }
      return result + Math.random().toString(36).substr(2, 3);
    };

    // Obfuscate class names
    html = html.replace(/class\s*=\s*["']([^"']+)["']/g, (match, classes) => {
      const classList = classes.split(/\s+/).map(cls => {
        if (!classMap.has(cls)) {
          classMap.set(cls, generateObfuscatedName('c', classCounter++));
        }
        return classMap.get(cls);
      });
      return `class="${classList.join(' ')}"`;
    });

    // Obfuscate ID attributes
    html = html.replace(/id\s*=\s*["']([^"']+)["']/g, (match, id) => {
      if (!idMap.has(id)) {
        idMap.set(id, generateObfuscatedName('i', idCounter++));
      }
      return `id="${idMap.get(id)}"`;
    });

    // Remove unnecessary spaces between tags
    html = html.replace(/>\s+</g, '><');
    
    // Remove line breaks and multiple spaces
    html = html.replace(/\n\s*/g, '');
    html = html.replace(/\s{2,}/g, ' ');

    return html;
  }

  async minifyHTML(html) {
    if (!this.config.minify) return html;

    try {
      const { minify } = require('html-minifier-terser');
      
      let result = await minify(html, this.minifierOptions);
      
      // Apply additional obfuscation if requested
      if (this.config.obfuscate || this.config.production) {
        result = this.obfuscateHTML(result);
      }

      return result;
    } catch (error) {
      console.warn('⚠️  HTML minification not available, using basic compression...');
      
      // Fallback basic minification
      let result = html
        .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
        .replace(/>\s+</g, '><') // Remove whitespace between tags
        .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single
        .trim();

      if (this.config.obfuscate || this.config.production) {
        result = this.obfuscateHTML(result);
      }

      return result;
    }
  }

  generateSourceMap(originalHtml, minifiedHtml, fileName) {
    if (!this.config.sourceMaps) return null;

    // Simple source map generation
    const sourceMap = {
      version: 3,
      file: fileName,
      sources: [fileName.replace('.min.html', '.html')],
      names: [],
      mappings: '', // Simplified - in real implementation, this would be properly generated
      sourcesContent: [originalHtml]
    };

    return JSON.stringify(sourceMap, null, 2);
  }

  async processFile(inputFile, outputFile) {
    try {
      console.log(`📦 Processing HTML: ${inputFile}`);
      const startTime = Date.now();

      const originalHtml = await fs.readFile(inputFile, 'utf8');
      
      // Minify HTML
      const minifiedHtml = await this.minifyHTML(originalHtml);

      // Generate source map
      const sourceMap = this.generateSourceMap(originalHtml, minifiedHtml, path.basename(outputFile));

      // Ensure output directory exists
      await this.ensureDirectoryExists(path.dirname(outputFile));

      // Add source map comment if enabled
      let finalHtml = minifiedHtml;
      if (sourceMap && this.config.sourceMaps) {
        finalHtml += `\n<!--# sourceMappingURL=${path.basename(outputFile)}.map -->`;
      }

      // Write HTML file
      await fs.writeFile(outputFile, finalHtml);

      // Write source map if enabled
      if (sourceMap && this.config.sourceMaps) {
        await fs.writeFile(`${outputFile}.map`, sourceMap);
        console.log(`✅ Source map created: ${outputFile}.map`);
      }

      const endTime = Date.now();
      const originalSize = Buffer.byteLength(originalHtml, 'utf8');
      const minifiedSize = Buffer.byteLength(finalHtml, 'utf8');
      const compressionRatio = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);

      console.log(`✅ ${path.basename(outputFile)} created successfully!`);
      console.log(`   Original: ${(originalSize / 1024).toFixed(2)} KB`);
      console.log(`   Minified: ${(minifiedSize / 1024).toFixed(2)} KB`);
      console.log(`   Saved: ${compressionRatio}% (${((originalSize - minifiedSize) / 1024).toFixed(2)} KB)`);
      console.log(`   Time: ${endTime - startTime}ms\n`);

      return { html: finalHtml, map: sourceMap };
    } catch (error) {
      console.error(`❌ Error processing ${inputFile}:`, error.message);
      throw error;
    }
  }

  async buildFile(fileName) {
    const inputFile = path.join(this.config.inputDir, fileName);
    // Keep original .html extension, just add .min
    const outputFileName = fileName.replace('.html', '.min.html');
    const outputFile = path.join(this.config.outputDir, outputFileName);

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
      // Get all HTML files from input directory
      const files = await fs.readdir(this.config.inputDir);
      const htmlFiles = files.filter(file => 
        file.endsWith('.html') && !file.endsWith('.min.html')
      );

      if (htmlFiles.length === 0) {
        console.warn('⚠️  No HTML files found in input directory');
        return;
      }

      console.log(`📁 Found ${htmlFiles.length} HTML files: ${htmlFiles.join(', ')}`);

      // Process files in parallel
      const results = await Promise.allSettled(
        htmlFiles.map(file => this.buildFile(file))
      );

      // Summary
      const successful = results.filter(r => r.status === 'fulfilled' && r.value !== null).length;
      const failed = results.filter(r => r.status === 'rejected' || r.value === null).length;

      console.log('📊 HTML Build Summary:');
      console.log(`   ✅ Successful: ${successful}`);
      if (failed > 0) console.log(`   ❌ Failed: ${failed}`);

      const totalTime = Date.now() - startTime;
      console.log(`   ⏱️  Total time: ${totalTime}ms`);

    } catch (error) {
      console.error('❌ HTML Build failed:', error.message);
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

  // Utility method for HTML analysis
  async analyzeHTML(filePath) {
    try {
      const html = await fs.readFile(filePath, 'utf8');
      const stats = {
        size: Buffer.byteLength(html, 'utf8'),
        lines: html.split('\n').length,
        elements: (html.match(/<[^>]+>/g) || []).length,
        comments: (html.match(/<!--[\s\S]*?-->/g) || []).length,
        scripts: (html.match(/<script[^>]*>[\s\S]*?<\/script>/gi) || []).length,
        styles: (html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || []).length,
        images: (html.match(/<img[^>]*>/gi) || []).length
      };

      console.log('📈 HTML Analysis:');
      console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`   Lines: ${stats.lines}`);
      console.log(`   Elements: ${stats.elements}`);
      console.log(`   Comments: ${stats.comments}`);
      console.log(`   Scripts: ${stats.scripts}`);
      console.log(`   Styles: ${stats.styles}`);
      console.log(`   Images: ${stats.images}`);

      return stats;
    } catch (error) {
      console.error('❌ HTML Analysis failed:', error.message);
    }
  }
}

// CLI support
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const builder = new HTMLBuilder({
    watch: args.includes('--watch'),
    sourceMaps: !args.includes('--no-maps'),
    minify: !args.includes('--no-minify'),
    production: args.includes('--production'),
    obfuscate: args.includes('--obfuscate')
  });

  switch (command) {
    case 'build':
      builder.buildAll();
      break;
    case 'watch':
      builder.buildAll().then(() => builder.watch());
      break;
    case 'analyze':
      const file = args[1] || 'index.html';
      builder.analyzeHTML(file);
      break;
    default:
      console.log('Usage: node html-builder.js [build|watch|analyze] [options]');
      console.log('Options:');
      console.log('  --production    Production build with obfuscation');
      console.log('  --watch         Enable watch mode');
      console.log('  --no-maps       Disable source maps');
      console.log('  --no-minify     Disable minification');
      console.log('  --obfuscate     Obfuscate class names and IDs');
      break;
  }
}

module.exports = HTMLBuilder;