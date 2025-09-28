#!/usr/bin/env node

const readline = require('readline');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class BuildCLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async showMainMenu() {
    console.clear();
    console.log('🚀 Advanced Build System CLI');
    console.log('Created by VIKRI AHPAD TANTOWI');
    console.log('================================\n');
    
    console.log('📋 Available Commands:');
    console.log('1. 🏗️  Complete Build (CSS + JS + HTML)');
    console.log('2. 🎨 Build CSS Only');
    console.log('3. ⚡ Build JavaScript Only');
    console.log('4. 🌐 Build HTML Only');
    console.log('5. 🏭 Production Build (All + Optimized)');
    console.log('6. 👀 Development Mode (Watch)');
    console.log('7. 📦 Bundle JavaScript');
    console.log('8. 🧹 Clean Build Directory');
    console.log('9. 📊 Analyze Bundle');
    console.log('10. ⚙️  Project Setup');
    console.log('0. ❌ Exit\n');
    
    return this.askQuestion('Choose an option (0-10): ');
  }

  async askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async executeCommand(command, args = []) {
    return new Promise((resolve, reject) => {
      console.log(`\n⚡ Executing: ${command} ${args.join(' ')}\n`);
      
      const process = spawn('node', [command, ...args], {
        stdio: 'inherit',
        cwd: __dirname
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(new Error(`Process exited with code ${code}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  async completeBuild() {
    console.log('\n🚀 Starting Complete Build...\n');
    
    try {
      // Build CSS
      console.log('🎨 Building CSS...');
      await this.executeCommand('css-builder.js', ['build']);
      
      // Build JavaScript
      console.log('\n⚡ Building JavaScript...');
      await this.executeCommand('js-builder.js', ['build']);
      
      // Build HTML
      console.log('\n🌐 Building HTML...');
      await this.executeCommand('html-builder.js', ['build']);
      
      console.log('\n✅ Complete build finished successfully!');
    } catch (error) {
      console.error('\n❌ Development mode failed:', error.message);
    }
  }

  async cleanBuild() {
    try {
      console.log('\n🧹 Cleaning build directory...');
      
      // Check if dist directory exists
      try {
        await fs.access('dist');
        const files = await fs.readdir('dist');
        
        for (const file of files) {
          await fs.unlink(path.join('dist', file));
          console.log(`🗑️  Removed: dist/${file}`);
        }
        
        console.log(`\n✅ Cleaned ${files.length} files from dist directory`);
      } catch (error) {
        console.log('📁 Dist directory is empty or doesn\'t exist');
      }
      
    } catch (error) {
      console.error('\n❌ Clean failed:', error.message);
    }
  }

  async setupProject() {
    console.log('\n⚙️  Setting up project...\n');
    
    try {
      // Run setup script
      const setupProcess = spawn('./setup.sh', [], {
        stdio: 'inherit',
        cwd: __dirname,
        shell: true
      });

      setupProcess.on('close', (code) => {
        if (code === 0) {
          console.log('\n✅ Project setup completed successfully!');
        } else {
          console.error('\n❌ Setup failed with code:', code);
        }
      });

    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
    }
  }

  async showBuildOptions(builderFile, builderName) {
    console.log(`\n🔧 ${builderName} Build Options:\n`);
    console.log('1. 🏗️  Normal Build');
    console.log('2. 👀 Watch Mode');
    console.log('3. 🏭 Production Mode');
    console.log('0. ⬅️  Back to Main Menu\n');
    
    const choice = await this.askQuestion('Choose build option (0-3): ');
    
    try {
      switch (choice) {
        case '1':
          await this.executeCommand(builderFile, ['build']);
          break;
        case '2':
          console.log('\nPress Ctrl+C to stop watching...\n');
          await this.executeCommand(builderFile, ['watch']);
          break;
        case '3':
          const productionArgs = builderName === 'CSS' ? ['build', '--purge', '--no-maps'] :
                               builderName === 'JavaScript' ? ['build', '--production'] :
                               ['build', '--obfuscate', '--no-maps'];
          await this.executeCommand(builderFile, productionArgs);
          break;
        case '0':
          return;
        default:
          console.log('❌ Invalid option');
      }
    } catch (error) {
      console.error(`\n❌ ${builderName} build failed:`, error.message);
    }
  }

  async run() {
    try {
      while (true) {
        const choice = await this.showMainMenu();
        
        switch (choice) {
          case '1':
            await this.completeBuild();
            break;
            
          case '2':
            await this.showBuildOptions('css-builder.js', 'CSS');
            break;
            
          case '3':
            await this.showBuildOptions('js-builder.js', 'JavaScript');
            break;
            
          case '4':
            await this.showBuildOptions('html-builder.js', 'HTML');
            break;
            
          case '5':
            await this.productionBuild();
            break;
            
          case '6':
            await this.developmentMode();
            break;
            
          case '7':
            console.log('\n📦 JavaScript Bundle Options:\n');
            console.log('1. 🏗️  Development Bundle');
            console.log('2. 🏭 Production Bundle');
            const bundleChoice = await this.askQuestion('Choose bundle option (1-2): ');
            
            try {
              if (bundleChoice === '1') {
                await this.executeCommand('js-builder.js', ['bundle']);
              } else if (bundleChoice === '2') {
                await this.executeCommand('js-builder.js', ['bundle', '--production']);
              }
            } catch (error) {
              console.error('\n❌ Bundle failed:', error.message);
            }
            break;
            
          case '8':
            await this.cleanBuild();
            break;
            
          case '9':
            try {
              await this.executeCommand('js-builder.js', ['analyze']);
            } catch (error) {
              console.error('\n❌ Analysis failed:', error.message);
            }
            break;
            
          case '10':
            await this.setupProject();
            break;
            
          case '0':
            console.log('\n👋 Goodbye! Thanks for using Advanced Build System!');
            this.rl.close();
            return;
            
          default:
            console.log('\n❌ Invalid option. Please choose 0-10.');
        }
        
        if (choice !== '6' && choice !== '10') { // Don't wait after watch mode or setup
          await this.askQuestion('\nPress Enter to continue...');
        }
      }
    } catch (error) {
      console.error('\n❌ CLI Error:', error.message);
      this.rl.close();
    }
  }
}

// Start CLI if run directly
if (require.main === module) {
  const cli = new BuildCLI();
  cli.run().catch(console.error);
}

module.exports = BuildCLI;) {
      console.error('\n❌ Build failed:', error.message);
    }
  }

  async productionBuild() {
    console.log('\n🏭 Starting Production Build...\n');
    
    try {
      // Production CSS build
      console.log('🎨 Building CSS (Production)...');
      await this.executeCommand('css-builder.js', ['build', '--purge', '--no-maps']);
      
      // Production JavaScript build
      console.log('\n⚡ Building JavaScript (Production)...');
      await this.executeCommand('js-builder.js', ['build', '--production']);
      
      // Production HTML build
      console.log('\n🌐 Building HTML (Production)...');
      await this.executeCommand('html-builder.js', ['build', '--obfuscate', '--no-maps']);
      
      console.log('\n🎉 Production build completed successfully!');
    } catch (error) {
      console.error('\n❌ Production build failed:', error.message);
    }
  }

  async developmentMode() {
    console.log('\n👀 Starting Development Mode (Watch)...\n');
    console.log('Press Ctrl+C to stop watching...\n');
    
    try {
      // Start watchers for all file types
      const cssWatcher = spawn('node', ['css-builder.js', 'watch'], {
        stdio: 'inherit',
        cwd: __dirname
      });

      const jsWatcher = spawn('node', ['js-builder.js', 'watch'], {
        stdio: 'inherit',
        cwd: __dirname
      });

      const htmlWatcher = spawn('node', ['html-builder.js', 'watch'], {
        stdio: 'inherit',
        cwd: __dirname
      });

      // Handle process termination
      process.on('SIGINT', () => {
        console.log('\n🛑 Stopping watchers...');
        cssWatcher.kill();
        jsWatcher.kill();
        htmlWatcher.kill();
        process.exit(0);
      });

    } catch (error) {
      console.error('\n❌ Development mode failed:', error.message);
    }
  }

  async cleanBuild() {
    try {
      console.log('\n🧹 Cleaning build directory...');
      
      // Check if dist directory exists
      try {
        await fs.access('dist');
        const files = await fs.readdir('dist');
        
        for (const file of files) {
          await fs.unlink(path.join('dist', file));
          console.log(`🗑️  Removed: dist/${file}`);
        }
        
        console.log(`\n✅ Cleaned ${files.length} files from dist directory`);
      } catch (error) {
        console.log('📁 Dist directory is empty or doesn\'t exist');
      }
      
    } catch (error) {
      console.error('\n❌ Clean failed:', error.message);
    }
  }

  async setupProject() {
    console.log('\n⚙️  Setting up project...\n');
    
    try {
      // Run setup script
      const setupProcess = spawn('./setup.sh', [], {
        stdio: 'inherit',
        cwd: __dirname,
        shell: true
      });

      setupProcess.on('close', (code) => {
        if (code === 0) {
          console.log('\n✅ Project setup completed successfully!');
        } else {
          console.error('\n❌ Setup failed with code:', code);
        }
      });

    } catch (error) {
      console.error('\n❌ Setup failed:', error.message);
    }
  }

  async showBuildOptions(builderFile, builderName) {
    console.log(`\n🔧 ${builderName} Build Options:\n`);
    console.log('1. 🏗️  Normal Build');
    console.log('2. 👀 Watch Mode');
    console.log('3. 🏭 Production Mode');
    console.log('0. ⬅️  Back to Main Menu\n');
    
    const choice = await this.askQuestion('Choose build option (0-3): ');
    
    try {
      switch (choice) {
        case '1':
          await this.executeCommand(builderFile, ['build']);
          break;
        case '2':
          console.log('\nPress Ctrl+C to stop watching...\n');
          await this.executeCommand(builderFile, ['watch']);
          break;
        case '3':
          const productionArgs = builderName === 'CSS' ? ['build', '--purge', '--no-maps'] :
                               builderName === 'JavaScript' ? ['build', '--production'] :
                               ['build', '--obfuscate', '--no-maps'];
          await this.executeCommand(builderFile, productionArgs);
          break;
        case '0':
          return;
        default:
          console.log('❌ Invalid option');
      }
    } catch (error) {
      console.error(`\n❌ ${builderName} build failed:`, error.message);
    }
  }

  async run() {
    try {
      while (true) {
        const choice = await this.showMainMenu();
        
        switch (choice) {
          case '1':
            await this.completeBuild();
            break;
            
          case '2':
            await this.showBuildOptions('css-builder.js', 'CSS');
            break;
            
          case '3':
            await this.showBuildOptions('js-builder.js', 'JavaScript');
            break;
            
          case '4':
            await this.showBuildOptions('html-builder.js', 'HTML');
            break;
            
          case '5':
            await this.productionBuild();
            break;
            
          case '6':
            await this.developmentMode();
            break;
            
          case '7':
            console.log('\n📦 JavaScript Bundle Options:\n');
            console.log('1. 🏗️  Development Bundle');
            console.log('2. 🏭 Production Bundle');
            const bundleChoice = await this.askQuestion('Choose bundle option (1-2): ');
            
            try {
              if (bundleChoice === '1') {
                await this.executeCommand('js-builder.js', ['bundle']);
              } else if (bundleChoice === '2') {
                await this.executeCommand('js-builder.js', ['bundle', '--production']);
              }
            } catch (error) {
              console.error('\n❌ Bundle failed:', error.message);
            }
            break;
            
          case '8':
            await this.cleanBuild();
            break;
            
          case '9':
            try {
              await this.executeCommand('js-builder.js', ['analyze']);
            } catch (error) {
              console.error('\n❌ Analysis failed:', error.message);
            }
            break;
            
          case '10':
            await this.setupProject();
            break;
            
          case '0':
            console.log('\n👋 Goodbye! Thanks for using Advanced Build System!');
            this.rl.close();
            return;
            
          default:
            console.log('\n❌ Invalid option. Please choose 0-10.');
        }
        
        if (choice !== '6' && choice !== '10') { // Don't wait after watch mode or setup
          await this.askQuestion('\nPress Enter to continue...');
        }
      }
    } catch (error) {
      console.error('\n❌ CLI Error:', error.message);
      this.rl.close();
    }
  }
}

// Start CLI if run directly
if (require.main === module) {
  const cli = new BuildCLI();
  cli.run().catch(console.error);
}

module.exports = BuildCLI;