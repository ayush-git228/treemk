# 🌳 treemk 📦 - Project Structure Generator

**Generate complete project folders in seconds**

## 🚀 Quick Start (3 Ways)

### 1. Inline Text (Easiest!)
```bash
npx treemk --text "src/index.js
src/app.js
tests/test.js
README.md" -o ./myapp
```

### 2. Inline JSON
```bash
npx treemk --json-input '{"src":["index.js","app.js"],"tests":["test.js"]}' -o ./myapp
```

### 3. From File
```bash
npx treemk -i structure.txt -o ./myapp
```

## 📥 Installation

```bash
# Use directly (recommended)
npx treemk --help

# Or install globally
npm install -g treemk
```

## 🎯 Common Use Cases

### Create a Node.js API
```bash
npx treemk --template node -o ./my-api --boilerplate --install --git-init
```

### Create React App
```bash
npx treemk --template react -o ./my-react-app --boilerplate
```

### Save Your Own Template
```bash
# Save once
npx treemk --text "src/server.js
src/routes/api.js
tests/test.js" --template-save my-api

# Reuse forever
npx treemk --template-use my-api -o ./new-api
```

### Preview Before Creating
```bash
npx treemk -i structure.txt --preview
```

## 📝 Input Formats

### Plain Text (Simple)
```
src/index.js
src/components/App.jsx
tests/test.js
package.json
```

### Tree Format (Visual)
```
my-app/
├── src/
│   ├── index.js
│   └── components/
│       └── App.jsx
└── package.json
```

### JSON Format
```json
{
  "src": {
    "components": ["App.jsx"],
    "index.js": null
  },
  "package.json": null
}
```

## 🎨 Smart Boilerplate (--boilerplate)

Automatically generates working code for:

- **server.js** → Express server ready to run
- **route.js** → RESTful API routes
- **model.js** → Database models
- **test.js** → Jest test setup
- **.env** → Environment variables template
- **.gitignore** → Comprehensive ignore rules
- **Dockerfile** → Docker configuration
- And more!

## 📋 All Commands

### Basic
```bash
-i, --input <file>      # File path (works from anywhere!)
-o, --output <path>     # Where to create (default: ./output)
-b, --boilerplate       # Add smart code templates
-h, --help              # Show help
```

### Templates
```bash
--template <name>           # Use: react, node, python
--template-save <name>      # Save for reuse
--template-use <name>       # Load saved template
--template-list             # Show all templates
--template-remove <name>    # Delete template
```

### Inline Input (No files!)
```bash
--text "<structure>"        # Pass structure directly
--json-input '<json>'       # Pass JSON directly
```

### Git
```bash
-g, --git-init         # Initialize git
--git-commit           # Make first commit
--git-push             # Push to GitHub (needs gh CLI)
```

### Advanced
```bash
--install              # Auto npm/pip install
--preview              # Show tree preview
-u, --from-url <url>   # Fetch from URL
-d, --dry-run          # Preview without creating
```

## 💡 Real Examples

### Example 1: Quick Microservice
```bash
npx treemk --text "src/server.js
src/routes/users.js
src/routes/products.js
src/models/User.js
tests/api.test.js
.env
.gitignore
package.json" -o ./my-service -b --install -g
```

### Example 2: Python Project
```bash
npx treemk --template python -o ./my-python-app -b --install --git-init
```

### Example 3: From Anywhere
```bash
# File in Downloads folder? No problem!
npx treemk -i structure.txt -o ./app

# File on Desktop? Works!
npx treemk -i ~/Desktop/project.txt -o ./app
```

### Example 4: Full Automation
```bash
npx treemk --template node \
  -o ./api \
  --boilerplate \
  --install \
  --git-init \
  --git-commit
```

## ⚙️ Config File (Optional)

Create `treemk.config.json` in your project folder:

```json
{
  "output": "./app",
  "boilerplate": true,
  "gitInit": true,
  "install": true
}
```

Then just run:
```bash
npx treemk --template node
```

## 📂 Where Templates Are Saved

`~/.treemk/templates/` - Your saved templates live here

## 🔍 Troubleshooting

**"Cannot find file"**
- Try absolute path: `/home/user/structure.txt`
- Or just filename if in Downloads/Documents/Desktop
- Use `--text` to avoid files entirely!

**"No input provided"**
```bash
# Use one of these:
npx treemk --text "src/index.js"
npx treemk -i file.txt
npx treemk --template node
cat file.txt | npx treemk -o ./app
```

## 📦 Requirements

- Node.js 16+ (check: `node --version`)
- npm comes with Node.js
- Optional: `gh` CLI for GitHub push

## 🎓 Complete Tutorial

See [QuickStart.md] for step-by-step guide.

## 📄 License

MIT License - Free to use for everyone!

## ⭐ Quick Reference Card

```bash
# Fastest ways to create projects:
npx treemk --template node -o ./app -b         # Node.js
npx treemk --template react -o ./app -b        # React
npx treemk --template python -o ./app -b       # Python

# No file needed:
npx treemk --text "src/index.js..." -o ./app

# Save template once, use forever:
npx treemk -i my-structure.txt --template-save my-template
npx treemk --template-use my-template -o ./new-project
```

---

**Made for developers who value speed! ⚡**
