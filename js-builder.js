const fs = require('fs').promises;
const path = require('path');
const { minify } = require('terser');

class JSBuilder {
  constructor(config = {}) {
    this.config = {
      inputDir: config.inputDir || 'js',
      outputDir: config.outputDir || 'dist',
      sourceMaps: config.sourceMaps !== false,
      minify: config.minify !== false,
      babel: config.babel !== false,
      bundle: config.bundle || false,
      watch: config.watch || false,
      target: config.target || 'es5',
      format: config.format || 'iife',
      globalName: config.globalName || 'App',
      ...config
    };

    this.terserOptions = this.getTerserOptions();
  }

  getTerserOptions() {
    return {
      compress: {
        drop_console: this.config.production,
        drop_debugger: this.config.production,
        pure_funcs: this.config.production ? ['console.log', 'console.info'] : [],
        passes: 2,
        ...this.config.terserCompress
      },
      mangle: {
        toplevel: this.config.production,
        ...this.config.terserMangle
      },
      format: {
        comments: this.config.production ? false : 'some',
        ...this.config.terserFormat
      },
      sourceMap: this.config.sourceMaps ? {
        includeSources: true,
        ...this.config.terserSourceMap
      } : false,
      ...this.config.terserOptions
    };
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  async transpileWithBabel(code, filename) {
    if (!this.config.babel) return code;

    try {
      const babel = require('@babel/core');
      const result = await babel.transformAsync(code, {
        presets: [
          ['@babel/preset-env', {
            targets: this.config.target === 'modern' ? {
              esmodules: true
            } : {
              ie: '11',
              chrome: '60',
              firefox: '60',
              safari: '10'
            },
            modules: false
          }]
        ],
        sourceMaps: this.config.sourceMaps,
        filename
      });
      return result.code;
    } catch (error) {
      console.warn(`⚠️  Babel not available, skipping transpilation...`);
      return code;
    }
  }

  async minifyCode(code, filename) {
    if (!this.config.minify) return { code };

    try {
      const result = await minify(code, {
        ...this.terserOptions,
        sourceMap: this.config.sourceMaps ? {
          filename: path.basename(filename),
          url: path.basename(filename) + '.map',
          ...this.terserOptions.sourceMap
        } : false
      });

      return result;
    } catch (error) {
      console.error(`❌ Minification failed for ${filename}:`, error.message);
      return { code };
    }
  }

  async bundleWithRollup(inputFile, outputFile) {
    try {
      const rollup = require('rollup');
      const { nodeResolve } = require('@rollup/plugin-node-resolve');
      const commonjs = require('@rollup/plugin-commonjs');
      const replace = require('@rollup/plugin-replace');

      console.log(`📦 Bundling: ${inputFile}`);

      const bundle = await rollup.rollup({
        input: inputFile,
        plugins: [
          replace({
            'process.env.NODE_ENV': JSON.stringify(this.config.production ? 'production' : 'development'),
            preventAssignment: true
          }),
          nodeResolve({
            browser: true,
            preferBuiltins: false
          }),
          commonjs()
        ],
        external: this.config.external || []
      });

      const { output } = await bundle.generate({
        format: this.config.format,
        name: this.config.globalName,
        sourcemap: this.config.sourceMaps,
        compact: this.config.minify
      });

      await bundle.close();
      return output[0];
    } catch (error) {
      console.warn('⚠️  Rollup not available, using simple bundling...');
      throw error;
    }
  }

  async processFile(inputFile, outputFile) {
    try {
      console.log(`📦 Processing: ${inputFile}`);
      const startTime = Date.now();
      
      let code;
      let map = null;

      if (this.config.bundle) {
        // Use Rollup for bundling
        try {
          const result = await this.bundleWithRollup(inputFile, outputFile);
          code = result.code;
          map = result.map;
        } catch {
          // Fallback to simple processing if Rollup fails
          code = await fs.readFile(inputFile, 'utf8');
        }
      } else {
        // Simple file processing
        code = await fs.readFile(inputFile, 'utf8');
      }
      
      // Babel transpilation
      if (this.config.babel) {
        code = await this.transpileWithBabel(code, inputFile);
      }

      // Minification
      if (this.config.minify) {
        const minifyResult = await this.minifyCode(code, outputFile);
        code = minifyResult.code;
        if (!map) map = minifyResult.map;
      }

      // Ensure output directory exists
      await this.ensureDirectoryExists(path.dirname(outputFile));

      // Write JavaScript file
      await fs.writeFile(outputFile, code);
      
      // Write source map if available
      if (map && this.config.sourceMaps) {
        await fs.writeFile(`${outputFile}.map`, map);
        console.log(`✅ Source map created: ${outputFile}.map`);
      }

      const endTime = Date.now();
      const fileSize = Buffer.byteLength(code, 'utf8');
      
      console.log(`✅ ${path.basename(outputFile)} created successfully!`);
      console.log(`   Size: ${(fileSize / 1024).toFixed(2)} KB`);
      console.log(`   Time: ${endTime - startTime}ms\n`);

      return { code, map };
    } catch (error) {
      console.error(`❌ Error processing ${inputFile}:`, error.message);
      throw error;
    }
  }

  async buildFile(fileName) {
    const inputFile = path.join(this.config.inputDir, fileName);
    const outputFileName = this.config.minify 
      ? fileName.replace('.js', '.min.js')
      : fileName;
    const outputFile = path.join(this.config.outputDir, outputFileName);

    try {
      await fs.access(inputFile);
      return await this.processFile(inputFile, outputFile);
    } catch {
      console.warn(`⚠️  File not found: ${inputFile}`);
      return null;
    }
  }

  async bundleApp(entryPoint = 'main.js') {
    const inputFile = path.join(this.config.inputDir, entryPoint);
    const outputFileName = this.config.minify 
      ? 'bundle.min.js' 
      : 'bundle.js';
    const outputFile = path.join(this.config.outputDir, outputFileName);

    return await this.processFile(inputFile, outputFile);
  }

  async buildAll() {
    console.log('🚀 Starting JavaScript build process...\n');
    const startTime = Date.now();

    try {
      // Ensure input directory exists
      await fs.access(this.config.inputDir);
    } catch {
      console.error(`❌ Input directory not found: ${this.config.inputDir}`);
      return;
    }

    try {
      if (this.config.bundle) {
        // Bundle mode - create single bundle
        await this.bundleApp(this.config.entry || 'main.js');
      } else {
        // Individual file processing mode
        const files = await fs.readdir(this.config.inputDir);
        const jsFiles = files.filter(file => 
          file.endsWith('.js') && !file.endsWith('.min.js')
        );

        if (jsFiles.length === 0) {
          console.warn('⚠️  No JavaScript files found in input directory');
          return;
        }

        // Process files in parallel
        const results = await Promise.allSettled(
          jsFiles.map(file => this.buildFile(file))
        );

        // Summary
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        
        console.log('📊 Build Summary:');
        console.log(`   ✅ Successful: ${successful}`);
        if (failed > 0) console.log(`   ❌ Failed: ${failed}`);
      }

      const totalTime = Date.now() - startTime;
      console.log(`   ⏱️  Total time: ${totalTime}ms`);

    } catch (error) {
      console.error('❌ Build failed:', error.message);
    }
  }

  async watch() {
    if (!this.config.watch) return;

    try {
      const chokidar = require('chokidar');
      console.log(`👀 Watching ${this.config.inputDir} for changes...\n`);

      const watcher = chokidar.watch(`${this.config.inputDir}/**/*.js`, {
        ignored: /\.min\.js$/,
        persistent: true
      });

      watcher.on('change', async (filePath) => {
        console.log(`🔄 File changed: ${filePath}`);
        
        if (this.config.bundle) {
          await this.bundleApp();
        } else {
          const fileName = path.basename(filePath);
          await this.buildFile(fileName);
        }
      });

      watcher.on('add', async (filePath) => {
        console.log(`➕ New file: ${filePath}`);
        
        if (!this.config.bundle) {
          const fileName = path.basename(filePath);
          await this.buildFile(fileName);
        }
      });
    } catch (error) {
      console.warn('⚠️  Watch mode not available (chokidar not installed)');
    }
  }

  // Utility method for code analysis
  async analyzeBundle(filePath) {
    try {
      const code = await fs.readFile(filePath, 'utf8');
      const stats = {
        size: Buffer.byteLength(code, 'utf8'),
        lines: code.split('\n').length,
        functions: (code.match(/function\s+\w+/g) || []).length,
        classes: (code.match(/class\s+\w+/g) || []).length,
        imports: (code.match(/import\s+.+from/g) || []).length
      };

      console.log('📈 Bundle Analysis:');
      console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`   Lines: ${stats.lines}`);
      console.log(`   Functions: ${stats.functions}`);
      console.log(`   Classes: ${stats.classes}`);
      console.log(`   Imports: ${stats.imports}`);

      return stats;
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
    }
  }
}

// CLI support
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const builder = new JSBuilder({
    watch: args.includes('--watch'),
    bundle: args.includes('--bundle'),
    sourceMaps: !args.includes('--no-maps'),
    minify: args.includes('--minify') || args.includes('--production'),
    production: args.includes('--production')
  });

  switch (command) {
    case 'build':
      builder.buildAll();
      break;
    case 'bundle':
      builder.bundleApp();
      break;
    case 'watch':
      builder.buildAll().then(() => builder.watch());
      break;
    case 'analyze':
      const file = args[1] || 'dist/bundle.min.js';
      builder.analyzeBundle(file);
      break;
    default:
      console.log('Usage: node js-builder.js [build|bundle|watch|analyze] [options]');
      console.log('Options:');
      console.log('  --production    Production build');
      console.log('  --watch        Enable watch mode');
      console.log('  --bundle       Bundle files');
      console.log('  --no-maps      Disable source maps');
      console.log('  --minify       Force minification');
      break;
  }
}

module.exports = JSBuilder;
