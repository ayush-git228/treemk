import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { getBoilerplate } from './boilerplate.js';

export class StructureGenerator {
  constructor(options = {}) {
    this.options = {
      output: options.output || './output',
      boilerplate: options.boilerplate || false,
      dryRun: options.dryRun || false,
      gitInit: options.gitInit || false,
      gitCommit: options.gitCommit || false,
      gitPush: options.gitPush || false,
      install: options.install || false,
      preview: options.preview || false,
      verbose: options.verbose !== false,
    };
    this.created = { dirs: 0, files: 0 };
    this.skipped = { dirs: 0, files: 0 };
  }

  log(message, type = 'info') {
    if (!this.options.verbose) return;
    
    const prefix = {
      info: chalk.blue('ℹ'),
      success: chalk.green('✓'),
      warning: chalk.yellow('⚠'),
      error: chalk.red('✗'),
      create: chalk.green('+'),
      skip: chalk.gray('○'),
    }[type] || '';

    console.log(`${prefix} ${message}`);
  }

  async parseInput(input) {
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(input);
      this.log('Detected JSON input format', 'info');
      return this.flattenJSON(parsed);
    } catch (e) {
      // Not JSON, continue
    }

    // Check if it's a tree structure or plain paths
    const lines = input.split('\n').filter(line => line.trim());
    
    if (this.isTreeStructure(lines)) {
      this.log('Detected tree structure format', 'info');
      return this.parseTree(lines);
    } else {
      this.log('Detected plain path format', 'info');
      return this.parsePlainPaths(lines);
    }
  }

  isTreeStructure(lines) {
    return lines.some(line => /[│├└─]/.test(line));
  }

  parseTree(lines) {
    const paths = [];
    const stack = [];

    for (const line of lines) {
      // Clean tree characters
      const cleaned = line
        .replace(/^[│\s]*[├└]──\s*/, '')
        .replace(/^[│\s]*/, '')
        .trim();

      if (!cleaned) continue;

      // Calculate depth based on indentation
      const indent = line.search(/[^\s│]/);
      const depth = Math.floor(indent / 2);

      // Adjust stack to current depth
      stack.length = depth;

      // Build full path
      const fullPath = [...stack, cleaned].join('/');
      paths.push(fullPath);

      // If it's a directory (ends with /), add to stack
      if (cleaned.endsWith('/')) {
        stack.push(cleaned.replace(/\/$/, ''));
      }
    }

    return paths;
  }

  parsePlainPaths(lines) {
    return lines.map(line => line.trim()).filter(Boolean);
  }

  flattenJSON(obj, prefix = '') {
    const paths = [];

    for (const [key, value] of Object.entries(obj)) {
      const fullPath = prefix ? `${prefix}/${key}` : key;

      if (Array.isArray(value)) {
        // Array of files
        if (value.length === 0) {
          // Empty directory
          paths.push(`${fullPath}/`);
        } else {
          paths.push(`${fullPath}/`);
          value.forEach(file => {
            paths.push(`${fullPath}/${file}`);
          });
        }
      } else if (typeof value === 'object' && value !== null) {
        // Nested object
        paths.push(`${fullPath}/`);
        paths.push(...this.flattenJSON(value, fullPath));
      } else {
        // File
        paths.push(fullPath);
      }
    }

    return paths;
  }

  generatePreview(paths) {
    console.log(chalk.bold('\n📦 Structure Preview:\n'));
    
    const tree = this.buildTree(paths);
    this.printTree(tree, '', true);
    
    console.log(chalk.bold('\nSummary:'));
    const fileCount = paths.filter(p => !p.endsWith('/')).length;
    const dirCount = paths.filter(p => p.endsWith('/')).length;
    console.log(chalk.cyan(`  Directories: ${dirCount}`));
    console.log(chalk.cyan(`  Files: ${fileCount}`));
    console.log();
  }

  buildTree(paths) {
    const tree = {};
    
    for (const p of paths) {
      const parts = p.split('/').filter(Boolean);
      let current = tree;
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        const isDir = p.endsWith('/') || !isLast;
        
        if (!current[part]) {
          current[part] = isDir ? {} : null;
        }
        
        if (isDir && current[part] !== null) {
          current = current[part];
        }
      }
    }
    
    return tree;
  }

  printTree(tree, prefix = '', isLast = true) {
    const entries = Object.entries(tree);
    
    entries.forEach(([name, children], index) => {
      const isLastEntry = index === entries.length - 1;
      const connector = isLastEntry ? '└── ' : '├── ';
      const isDir = children !== null;
      
      const displayName = isDir ? chalk.cyan(name + '/') : chalk.green(name);
      console.log(prefix + connector + displayName);
      
      if (isDir && Object.keys(children).length > 0) {
        const newPrefix = prefix + (isLastEntry ? '    ' : '│   ');
        this.printTree(children, newPrefix, isLastEntry);
      }
    });
  }

  async createStructure(paths) {
    const rootPath = path.resolve(this.options.output);

    // Preview mode - just show what would be created
    if (this.options.preview) {
      this.generatePreview(paths);
      return;
    }

    if (!this.options.dryRun) {
      await fs.mkdir(rootPath, { recursive: true });
    }

    this.log(`\nCreating structure in: ${chalk.cyan(rootPath)}\n`, 'info');

    const processedPaths = new Set();

    for (let itemPath of paths) {
      itemPath = itemPath.trim().replace(/\/$/, '');
      if (!itemPath || processedPaths.has(itemPath)) continue;
      
      processedPaths.add(itemPath);

      const isDirectory = itemPath.endsWith('/') || !path.extname(itemPath);
      const fullPath = path.join(rootPath, itemPath);

      try {
        if (!this.options.dryRun) {
          const exists = await fs.access(fullPath).then(() => true).catch(() => false);
          
          if (exists) {
            this.log(`${chalk.gray(itemPath)} (already exists)`, 'skip');
            isDirectory ? this.skipped.dirs++ : this.skipped.files++;
            continue;
          }
        }

        if (isDirectory) {
          if (!this.options.dryRun) {
            await fs.mkdir(fullPath, { recursive: true });
          }
          this.log(`${chalk.cyan(itemPath)}/`, 'create');
          this.created.dirs++;
        } else {
          // Ensure parent directory exists
          const dir = path.dirname(fullPath);
          if (!this.options.dryRun) {
            await fs.mkdir(dir, { recursive: true });
          }

          // Create file with optional boilerplate
          const content = this.options.boilerplate 
            ? getBoilerplate(itemPath) 
            : '';

          if (!this.options.dryRun) {
            await fs.writeFile(fullPath, content, 'utf8');
          }

          this.log(`${chalk.green(itemPath)}`, 'create');
          this.created.files++;
        }
      } catch (error) {
        this.log(`Failed to create ${itemPath}: ${error.message}`, 'error');
      }
    }

    if (!this.options.preview) {
      this.printSummary();
    }

    // Post-creation tasks
    if (!this.options.dryRun && !this.options.preview) {
      if (this.options.install) {
        await this.installDependencies(rootPath);
      }

      if (this.options.gitInit) {
        await this.initGit(rootPath);
      }

      if (this.options.gitCommit) {
        await this.gitCommit(rootPath);
      }

      if (this.options.gitPush) {
        await this.gitPush(rootPath);
      }
    }
  }

  async installDependencies(rootPath) {
    this.log('\nChecking for dependencies...', 'info');

    const packageJsonPath = path.join(rootPath, 'package.json');
    const requirementsPath = path.join(rootPath, 'requirements.txt');

    try {
      await fs.access(packageJsonPath);
      this.log('Found package.json - installing npm dependencies...', 'info');
      try {
        execSync('npm install', { cwd: rootPath, stdio: 'inherit' });
        this.log('npm dependencies installed successfully', 'success');
      } catch (error) {
        this.log(`Failed to install npm dependencies: ${error.message}`, 'error');
      }
    } catch (error) {
      // package.json doesn't exist
    }

    try {
      await fs.access(requirementsPath);
      this.log('Found requirements.txt - installing Python dependencies...', 'info');
      try {
        execSync('pip install -r requirements.txt', { cwd: rootPath, stdio: 'inherit' });
        this.log('Python dependencies installed successfully', 'success');
      } catch (error) {
        this.log(`Failed to install Python dependencies: ${error.message}`, 'error');
      }
    } catch (error) {
      // requirements.txt doesn't exist
    }
  }

  async initGit(rootPath) {
    try {
      this.log('\nInitializing git repository...', 'info');
      execSync('git init', { cwd: rootPath, stdio: 'ignore' });
      this.log('Git repository initialized', 'success');
    } catch (error) {
      this.log(`Failed to initialize git: ${error.message}`, 'error');
    }
  }

  async gitCommit(rootPath) {
    try {
      this.log('\nCreating initial commit...', 'info');
      execSync('git add .', { cwd: rootPath, stdio: 'ignore' });
      execSync('git commit -m "Initial commit"', { cwd: rootPath, stdio: 'ignore' });
      this.log('Initial commit created', 'success');
    } catch (error) {
      this.log(`Failed to create commit: ${error.message}`, 'error');
    }
  }

  async gitPush(rootPath) {
    try {
      // Check if gh CLI is installed
      execSync('gh --version', { stdio: 'ignore' });
      
      this.log('\nAttempting to push to GitHub...', 'info');
      execSync('gh repo create --source=. --public --push', { cwd: rootPath, stdio: 'inherit' });
      this.log('Repository pushed to GitHub', 'success');
    } catch (error) {
      this.log('Failed to push to GitHub. Make sure gh CLI is installed and configured.', 'warning');
    }
  }

  printSummary() {
    console.log('\n' + chalk.bold('Summary:'));
    console.log(chalk.green(`  ✓ Created: ${this.created.dirs} directories, ${this.created.files} files`));
    if (this.skipped.dirs || this.skipped.files) {
      console.log(chalk.gray(`  ○ Skipped: ${this.skipped.dirs} directories, ${this.skipped.files} files (already exist)`));
    }
    if (this.options.dryRun) {
      console.log(chalk.yellow('\n  (Dry run - no files were actually created)'));
    }
  }
}