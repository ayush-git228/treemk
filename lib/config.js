import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

export async function loadConfig() {
  const configPath = path.resolve(process.cwd(), 'treemk.config.json');
  
  try {
    const configData = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configData);
    console.log(chalk.blue('ℹ') + ' Loaded config from treemk.config.json');
    
    // Auto-detect input source if not provided in config
    if (!config.input && !config.textInput && !config.jsonInput && !config.templateUse && !config.template && !config.fromUrl) {
      console.log(chalk.blue('ℹ') + ' No input source in config, attempting auto-detection...');
      
      // Try to find common structure files in current directory
      const possibleFiles = [
        'structure.txt',
        'project-structure.txt', 
        'tree.txt',
        'structure.json',
        'project.txt'
      ];
      
      for (const file of possibleFiles) {
        try {
          const filePath = path.resolve(process.cwd(), file);
          await fs.access(filePath);
          config.input = file;
          console.log(chalk.green('✓') + ` Auto-detected input file: ${chalk.cyan(file)}`);
          return config;
        } catch {
          // File doesn't exist, continue to next
        }
      }
      
      // If no file found, use a sensible default template
      if (!config.input) {
        console.log(chalk.yellow('⚠') + ' No input file found, using built-in node template as default');
        config.template = 'node';
      }
    }
    
    return config;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(chalk.yellow('⚠') + ` Failed to parse config file: ${error.message}`);
    }
    return {};
  }
}

export function mergeOptions(configOptions, cliOptions) {
  // CLI options take precedence over config file
  // Only merge CLI options that are explicitly set (not default false/null/undefined)
  const merged = { ...configOptions };
  
  for (const [key, value] of Object.entries(cliOptions)) {
    // Override config with CLI option if it's explicitly set
    if (value !== undefined && value !== null) {
      // For boolean flags, only override if true or explicitly false
      if (typeof value === 'boolean') {
        if (value === true) {
          merged[key] = value;
        }
      } else {
        // For other types, always override if present
        merged[key] = value;
      }
    }
  }
  
  return merged;
}