#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { StructureGenerator } from './lib/structure-generator.js';
import { 
  saveTemplate, 
  loadTemplate, 
  listTemplates, 
  removeTemplate,
  getBuiltInTemplate 
} from './lib/templates.js';
import { loadConfig, mergeOptions } from './lib/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readFromStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', chunk => {
      data += chunk;
    });

    process.stdin.on('end', () => {
      resolve(data);
    });

    process.stdin.on('error', reject);

    // Timeout after 100ms if no data
    setTimeout(() => {
      if (!data) {
        process.stdin.pause();
        resolve(null);
      }
    }, 100);
  });
}

function printHelp() {
  console.log(chalk.bold('\n📦 treemk') + ' - Generate folder structures from text, JSON, or trees\n');
  console.log(chalk.bold('Usage:'));
  console.log('  treemk [options]\n');
  console.log(chalk.bold('Basic Options:'));
  console.log('  -i, --input <file>           Input file path (absolute or relative)');
  console.log('  -o, --output <path>          Output directory (default: ./output)');
  console.log('  -b, --boilerplate            Add context-aware boilerplate content');
  console.log('  -d, --dry-run                Show what would be created without writing');
  console.log('  -j, --json                   Parse input as JSON');
  console.log('  -h, --help                   Show this help message\n');
  
  console.log(chalk.bold('Template Management:'));
  console.log('  --template <name>         Use built-in template (react|node|python)');
  console.log('  --template-save <name>    Save current input as reusable template');
  console.log('  --template-use <name>     Load and use a saved template');
  console.log('  --template-list              List all saved templates');
  console.log('  --template-remove <name>  Delete a saved template\n');
  
  console.log(chalk.bold('Git Integration:'));
  console.log('  -g, --git-init               Initialize git repository');
  console.log('  --git-commit                 Create initial commit');
  console.log('  --git-push                   Push to GitHub (requires gh CLI)\n');
  
  console.log(chalk.bold('Advanced Options:'));
  console.log('  --install                    Auto-install dependencies (npm/pip)');
  console.log('  --preview                    Preview structure as ASCII tree');
  console.log('  -u, --from-url <url>         Fetch structure from URL');
  console.log('  --text <structure>           Pass structure as text argument');
  console.log('  --json-input <json>          Pass JSON structure as argument');
  console.log('  --config                     Use treemk.config.json if present\n');
  
  console.log(chalk.bold('Examples:'));
  console.log('  # From file (any location)');
  console.log('  treemk -i ~/Downloads/tree.txt -o ./myapp -b\n');
  
  console.log('  # From stdin (pipe)');
  console.log('  cat structure.txt | treemk -o ./myapp -b\n');
  
  console.log('  # Inline text (no file needed!)');
  console.log('  treemk --text "src/index.js\\nsrc/app.js\\nREADME.md" -o ./app\n');
  
  console.log('  # Inline JSON (no file needed!)');
  console.log('  treemk --json-input \'{"src":["index.js"]}\' -o ./app\n');
  
  console.log('  # Template workflow');
  console.log('  treemk --template-use myproject -o ./app --git-init\n');
  
  console.log('  # Full automation');
  console.log('  treemk --template node -o ./api -b --install -g --git-commit\n');
  
  console.log('  # Preview before creating');
  console.log('  treemk -i structure.txt --preview\n');
  
  console.log(chalk.bold('Config File (treemk.config.json):'));
  console.log('  Place in your working directory for default options:');
  console.log('  {');
  console.log('    "output": "./app",');
  console.log('    "boilerplate": true,');
  console.log('    "gitInit": true,');
  console.log('    "install": true');
  console.log('  }\n');
  
  console.log(chalk.bold('Input Format Examples:'));
  console.log('\n  Tree format:');
  console.log('  src/');
  console.log('  ├── components/');
  console.log('  │   └── App.jsx');
  console.log('  └── index.js\n');
  
  console.log('  Plain paths:');
  console.log('  src/components/App.jsx');
  console.log('  src/index.js');
  console.log('  package.json\n');
  
  console.log('  JSON format:');
  console.log('  {');
  console.log('    "src": {');
  console.log('      "components": ["App.jsx"],');
  console.log('      "index.js": null');
  console.log('    }');
  console.log('  }\n');
}

async function resolveInputPath(inputPath) {
  // Try absolute path first
  let resolved = path.resolve(inputPath);
  try {
    await fs.access(resolved);
    return resolved;
  } catch (e) {
    // File doesn't exist at absolute path
  }

  // Try relative to current working directory
  resolved = path.resolve(process.cwd(), inputPath);
  try {
    await fs.access(resolved);
    return resolved;
  } catch (e) {
    // File doesn't exist at cwd
  }

  // Try relative to script location
  resolved = path.resolve(__dirname, inputPath);
  try {
    await fs.access(resolved);
    return resolved;
  } catch (e) {
    // File doesn't exist at script location
  }

  // Try common locations
  const commonPaths = [
    path.join(process.env.HOME || process.env.USERPROFILE, 'Downloads', inputPath),
    path.join(process.env.HOME || process.env.USERPROFILE, 'Documents', inputPath),
    path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop', inputPath),
  ];

  for (const p of commonPaths) {
    try {
      await fs.access(p);
      return p;
    } catch (e) {
      // Continue to next path
    }
  }

  throw new Error(`Cannot find file: ${inputPath}`);
}

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const cliOptions = {
    input: null,
    output: null,
    boilerplate: false,
    dryRun: false,
    json: false,
    gitInit: false,
    gitCommit: false,
    gitPush: false,
    install: false,
    preview: false,
    help: false,
    fromUrl: null,
    template: null,
    templateSave: null,
    templateUse: null,
    templateList: false,
    templateRemove: null,
    useConfig: true,
    textInput: null,
    jsonInput: null,
    verbose: true,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--input':
      case '-i':
        cliOptions.input = args[++i];
        break;
      case '--output':
      case '-o':
        cliOptions.output = args[++i];
        break;
      case '--boilerplate':
      case '-b':
        cliOptions.boilerplate = true;
        break;
      case '--dry-run':
      case '-d':
        cliOptions.dryRun = true;
        break;
      case '--json':
      case '-j':
        cliOptions.json = true;
        break;
      case '--git-init':
      case '-g':
        cliOptions.gitInit = true;
        break;
      case '--git-commit':
        cliOptions.gitCommit = true;
        break;
      case '--git-push':
        cliOptions.gitPush = true;
        break;
      case '--install':
        cliOptions.install = true;
        break;
      case '--preview':
        cliOptions.preview = true;
        break;
      case '--from-url':
      case '-u':
        cliOptions.fromUrl = args[++i];
        break;
      case '--template':
      case '-t':
        cliOptions.template = args[++i];
        break;
      case '--template-save':
        cliOptions.templateSave = args[++i];
        break;
      case '--template-use':
        cliOptions.templateUse = args[++i];
        break;
      case '--template-list':
        cliOptions.templateList = true;
        break;
      case '--template-remove':
        cliOptions.templateRemove = args[++i];
        break;
      case '--text':
        cliOptions.textInput = args[++i];
        break;
      case '--json-input':
        cliOptions.jsonInput = args[++i];
        break;
      case '--verbose':
        cliOptions.verbose = true;
        break;
      case '--quiet':
        cliOptions.verbose = false;
        break;
      case '--help':
      case '-h':
        cliOptions.help = true;
        break;
      default:
        if (!arg.startsWith('-') && !cliOptions.input) {
          cliOptions.input = arg;
        }
    }
  }

  // Handle help
  if (cliOptions.help) {
    printHelp();
    return;
  }

  // Handle template list
  if (cliOptions.templateList) {
    await listTemplates();
    return;
  }

  // Handle template remove
  if (cliOptions.templateRemove) {
    try {
      await removeTemplate(cliOptions.templateRemove);
    } catch (error) {
      console.error(chalk.red('✗') + ` ${error.message}`);
      process.exit(1);
    }
    return;
  }

  // Load config file (only from current working directory)
  const configOptions = cliOptions.useConfig ? await loadConfig() : {};

  // Merge options: config < cli (CLI takes precedence)
  const options = mergeOptions(configOptions, cliOptions);

  let input = '';

  // Priority order for input sources:
  // 1. Inline text argument (--text)
  // 2. Inline JSON argument (--json-input)
  // 3. Piped input (stdin)
  // 4. URL fetch (--from-url)
  // 5. Template use (--template-use)
  // 6. File input (--input)
  // 7. Built-in template (--template)

  // Check for inline text input
  if (options.textInput) {
    input = options.textInput.replace(/\\n/g, '\n');
    console.log(chalk.blue('ℹ') + ' Using inline text input');
  }

  // Check for inline JSON input
  if (options.jsonInput && !input) {
    try {
      // Validate JSON
      JSON.parse(options.jsonInput);
      input = options.jsonInput;
      console.log(chalk.blue('ℹ') + ' Using inline JSON input');
    } catch (error) {
      console.error(chalk.red('✗') + ` Invalid JSON input: ${error.message}`);
      process.exit(1);
    }
  }

  // Check for piped input (stdin)
  if (!process.stdin.isTTY && !input) {
    input = await readFromStdin();
    if (input) {
      console.log(chalk.blue('ℹ') + ' Reading from stdin (piped input)');
    }
  }

  // Read from URL if specified
  if (options.fromUrl && !input) {
    try {
      console.log(chalk.blue('ℹ') + ` Fetching from ${options.fromUrl}...`);
      const response = await fetch(options.fromUrl);
      input = await response.text();
      console.log(chalk.green('✓') + ' Successfully fetched from URL');
    } catch (error) {
      console.error(chalk.red('✗') + ` Failed to fetch from URL: ${error.message}`);
      process.exit(1);
    }
  }

  // Read from template (user-saved)
  if (options.templateUse && !input) {
    try {
      input = await loadTemplate(options.templateUse);
    } catch (error) {
      console.error(chalk.red('✗') + ` ${error.message}`);
      process.exit(1);
    }
  }

  // Read from file if specified (with smart path resolution)
  if (options.input && !input) {
    try {
      const resolvedPath = await resolveInputPath(options.input);
      console.log(chalk.blue('ℹ') + ` Reading from: ${resolvedPath}`);
      input = await fs.readFile(resolvedPath, 'utf8');
    } catch (error) {
      console.error(chalk.red('✗') + ` Failed to read input file: ${error.message}`);
      console.log(chalk.yellow('💡 Tip: File paths can be:'));
      console.log('   - Absolute: /home/user/structure.txt');
      console.log('   - Relative: ./structure.txt or ../structure.txt');
      console.log('   - Or just filename if in common locations (Downloads, Documents, Desktop)');
      process.exit(1);
    }
  }

  // Use built-in template if specified
  if (options.template && !input) {
    input = getBuiltInTemplate(options.template);
    if (!input) {
      console.error(chalk.red('✗') + ` Unknown built-in template: ${options.template}`);
      console.log('Available templates: react, node, python');
      process.exit(1);
    }
    console.log(chalk.blue('ℹ') + ` Using built-in template: ${options.template}`);
  }

  // Handle template save - need input first
  if (options.templateSave) {
    if (!input) {
      console.error(chalk.red('✗') + ' No input provided to save as template');
      console.log('Use --input, --text, --json-input, or pipe data to save as template');
      process.exit(1);
    }

    try {
      await saveTemplate(options.templateSave, input);
      // If template-save is the only action, exit
      if (!options.output && !options.preview) {
        console.log(chalk.green('✓') + ' Template saved successfully!');
        console.log(chalk.blue('ℹ') + ` Use it with: treemk --template-use ${options.templateSave} -o ./myapp`);
        return;
      }
    } catch (error) {
      console.error(chalk.red('✗') + ` ${error.message}`);
      process.exit(1);
    }
  }

  if (!input) {
    console.error(chalk.red('✗') + ' No input provided.');
    console.log('\n' + chalk.bold('Quick start options:'));
    console.log('  1. From file:      treemk -i structure.txt -o ./app');
    console.log('  2. Inline text:    treemk --text "src/index.js\\nREADME.md" -o ./app');
    console.log('  3. Inline JSON:    treemk --json-input \'{"src":["index.js"]}\' -o ./app');
    console.log('  4. From pipe:      cat structure.txt | treemk -o ./app');
    console.log('  5. Use template:   treemk --template node -o ./app');
    console.log('\nRun ' + chalk.cyan('treemk --help') + ' for full documentation.');
    process.exit(1);
  }

  // Create structure
  const generator = new StructureGenerator({
    output: options.output || './output',
    boilerplate: options.boilerplate,
    dryRun: options.dryRun,
    gitInit: options.gitInit,
    gitCommit: options.gitCommit,
    gitPush: options.gitPush,
    install: options.install,
    preview: options.preview,
    verbose: options.verbose,
  });

  try {
    const paths = await generator.parseInput(input.trim());
    
    if (paths.length === 0) {
      console.error(chalk.red('✗') + ' No valid paths found in input');
      process.exit(1);
    }
    
    await generator.createStructure(paths);
    
    if (!options.preview && !options.dryRun) {
      console.log('\n' + chalk.green('✓ Success!') + ' Structure created at: ' + chalk.cyan(path.resolve(options.output || './output')));
    }
  } catch (error) {
    console.error(chalk.red('✗') + ` Error: ${error.message}`);
    if (options.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});