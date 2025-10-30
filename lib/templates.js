import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

const TEMPLATE_DIR = path.join(os.homedir(), '.treemk', 'templates');

async function ensureTemplateDir() {
  try {
    await fs.mkdir(TEMPLATE_DIR, { recursive: true });
  } catch (error) {
    throw new Error(`Failed to create template directory: ${error.message}`);
  }
}

export async function saveTemplate(name, content) {
  await ensureTemplateDir();
  const templatePath = path.join(TEMPLATE_DIR, `${name}.txt`);
  
  try {
    await fs.writeFile(templatePath, content, 'utf8');
    console.log(chalk.green('✓') + ` Template '${name}' saved to ${templatePath}`);
    return true;
  } catch (error) {
    throw new Error(`Failed to save template: ${error.message}`);
  }
}

export async function loadTemplate(name) {
  const templatePath = path.join(TEMPLATE_DIR, `${name}.txt`);
  
  try {
    const content = await fs.readFile(templatePath, 'utf8');
    console.log(chalk.blue('ℹ') + ` Using template '${name}'`);
    return content;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Template '${name}' not found`);
    }
    throw new Error(`Failed to load template: ${error.message}`);
  }
}

export async function listTemplates() {
  await ensureTemplateDir();
  
  try {
    const files = await fs.readdir(TEMPLATE_DIR);
    const templates = files
      .filter(f => f.endsWith('.txt'))
      .map(f => f.replace('.txt', ''));
    
    if (templates.length === 0) {
      console.log(chalk.yellow('No templates found.'));
      console.log(`Templates are stored in: ${chalk.cyan(TEMPLATE_DIR)}`);
    } else {
      console.log(chalk.bold('\n📦 Available Templates:\n'));
      for (const template of templates) {
        const templatePath = path.join(TEMPLATE_DIR, `${template}.txt`);
        const stats = await fs.stat(templatePath);
        const size = (stats.size / 1024).toFixed(2);
        console.log(`  ${chalk.green('•')} ${chalk.cyan(template)} ${chalk.gray(`(${size} KB)`)}`);
      }
      console.log();
    }
    
    return templates;
  } catch (error) {
    throw new Error(`Failed to list templates: ${error.message}`);
  }
}

export async function removeTemplate(name) {
  const templatePath = path.join(TEMPLATE_DIR, `${name}.txt`);
  
  try {
    await fs.unlink(templatePath);
    console.log(chalk.green('✓') + ` Template '${name}' removed`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Template '${name}' not found`);
    }
    throw new Error(`Failed to remove template: ${error.message}`);
  }
}

export function getBuiltInTemplate(name) {
  const templates = {
    react: `
src/
├── components/
│   ├── App.jsx
│   └── index.js
├── styles/
│   └── App.css
├── index.js
public/
├── index.html
package.json
.gitignore
README.md
`,
    node: `
src/
├── index.js
├── routes/
├── controllers/
├── models/
├── middleware/
└── utils/
tests/
config/
.env
.gitignore
package.json
README.md
`,
    python: `
src/
├── __init__.py
├── main.py
├── models/
│   └── __init__.py
├── utils/
│   └── __init__.py
tests/
├── __init__.py
requirements.txt
.gitignore
README.md
`,
  };

  return templates[name] || null;
}