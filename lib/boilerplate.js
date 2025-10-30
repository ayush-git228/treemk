import path from 'path';

// Context-aware boilerplate templates
const CONTEXT_TEMPLATES = {
  'server.js': `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`,

  'model.js': `import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Model = mongoose.model('Model', schema);

export default Model;
`,

  'route.js': `import express from 'express';
const router = express.Router();

// GET all
router.get('/', async (req, res) => {
  try {
    // TODO: Implement logic
    res.json({ message: 'GET all' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    // TODO: Implement logic
    res.json({ message: \`GET \${req.params.id}\` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    // TODO: Implement logic
    res.status(201).json({ message: 'Created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    // TODO: Implement logic
    res.json({ message: \`Updated \${req.params.id}\` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    // TODO: Implement logic
    res.json({ message: \`Deleted \${req.params.id}\` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
`,

  'test.js': `import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

describe('Test Suite', () => {
  beforeAll(() => {
    // Setup before tests
  });

  afterAll(() => {
    // Cleanup after tests
  });

  it('should pass this test', () => {
    expect(true).toBe(true);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
`,

  'Dockerfile': `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
`,

  '.env': `# Environment variables
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=root
DB_PASSWORD=

# API Keys
API_KEY=
`,

  '.gitignore': `# Dependencies
node_modules/
vendor/
__pycache__/
*.pyc
venv/
env/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Build output
dist/
build/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/
`,

  'README.md': `# Project Name

## Description

Add your project description here.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## Testing

\`\`\`bash
npm test
\`\`\`

## License

MIT
`,

  'package.json': `{
  "name": "my-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {}
}
`,

  'requirements.txt': `# Python dependencies
flask>=2.0.0
requests>=2.26.0
python-dotenv>=0.19.0
`,
};

// Extension-based fallback templates
const EXTENSION_TEMPLATES = {
  '.js': '// TODO: implement\n',
  '.jsx': 'import React from \'react\';\n\n// TODO: implement component\n',
  '.ts': '// TODO: implement\n',
  '.tsx': 'import React from \'react\';\n\n// TODO: implement component\n',
  '.py': '# TODO: implement\n',
  '.md': '# TODO\n',
  '.env': '# Environment variables\n',
  '.json': '{\n  \n}\n',
  '.html': '<!DOCTYPE html>\n<html>\n<head>\n  <title>TODO</title>\n</head>\n<body>\n  \n</body>\n</html>\n',
  '.css': '/* TODO: add styles */\n',
  '.scss': '/* TODO: add styles */\n',
  '.gitignore': 'node_modules/\n.env\n.DS_Store\n',
};

export function getBoilerplate(filePath) {
  const fileName = path.basename(filePath);
  
  // Check for context-aware templates first
  if (CONTEXT_TEMPLATES[fileName]) {
    return CONTEXT_TEMPLATES[fileName];
  }
  
  // Check filename patterns
  if (fileName.includes('server')) {
    return CONTEXT_TEMPLATES['server.js'];
  }
  if (fileName.includes('model')) {
    return CONTEXT_TEMPLATES['model.js'];
  }
  if (fileName.includes('route')) {
    return CONTEXT_TEMPLATES['route.js'];
  }
  if (fileName.includes('test') || fileName.includes('spec')) {
    return CONTEXT_TEMPLATES['test.js'];
  }
  
  // Fallback to extension-based templates
  const ext = path.extname(filePath);
  return EXTENSION_TEMPLATES[ext] || '';
}