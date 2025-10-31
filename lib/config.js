import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

export async function loadConfig() {
  const configPath = path.resolve(process.cwd(), 'treemk.config.json');
  
  try {
    const configData = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configData);
    console.log(chalk.blue('i') + ' Loaded config from treemk.config.json');
    return config;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(chalk.yellow('⚠') + ` Failed to parse config file: ${error.message}`);
    }
    return {};
  }
}

export function mergeOptions(configOptions, cliOptions) {
  // Start with config options as base
  const merged = { ...configOptions };
  
  // Override with CLI options that are explicitly set
  for (const [key, value] of Object.entries(cliOptions)) {
    // Skip null, undefined, and false boolean flags (unless they override a config true)
    if (value === null || value === undefined) {
      continue;
    }
    
    // For boolean flags
    if (typeof value === 'boolean') {
      // Only override if CLI value is true, or if we want to explicitly set false
      if (value === true) {
        merged[key] = value;
      }
    } 
    // For strings and other types
    else if (typeof value === 'string' && value.length > 0) {
      merged[key] = value;
    }
    // For numbers and other truthy values
    else if (value) {
      merged[key] = value;
    }
  }
  
  return merged;
}