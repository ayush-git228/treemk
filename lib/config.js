import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

export async function loadConfig() {
  const configPath = path.resolve(process.cwd(), 'treemk.config.json');
  
  try {
    const configData = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configData);
    console.log(chalk.blue('ℹ') + ' Loaded config from treemk.config.json');
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
  return {
    ...configOptions,
    ...Object.fromEntries(
      Object.entries(cliOptions).filter(([_, v]) => v !== undefined && v !== null && v !== false)
    )
  };
}