# ⚙️ treemk.config.json - Complete Guide

## 📋 What is it?

`treemk.config.json` lets you save your preferred options so you don't have to type them every time.

## 🚀 Quick Setup

### Method 1: Interactive Setup (Easiest!)
```bash
treemk --setup
# Answer a few questions, config file is created!

# Or setup and run immediately:
treemk --setup --run
```

### Method 2: Manual Creation
Create `treemk.config.json` in your project folder:

```json
{
  "template": "node",
  "output": "./my-app",
  "boilerplate": true,
  "gitInit": true,
  "install": false
}
```

Then just run:
```bash
treemk
```

## 📝 All Config Options

### Input Source (Choose ONE)

```json
{
  "template": "node"
}
```
Uses built-in template: `node`, `react`, or `python`

```json
{
  "input": "structure.txt"
}
```
Uses a file (can be anywhere: `./structure.txt`, `~/Downloads/structure.txt`, etc.)

```json
{
  "textInput": "src/index.js\nsrc/app.js\nREADME.md"
}
```
Inline text structure (use `\n` for newlines)

```json
{
  "jsonInput": "{\"src\":[\"index.js\"],\"tests\":[\"test.js\"]}"
}
```
Inline JSON structure

```json
{
  "templateUse": "my-api"
}
```
Uses your saved template

```json
{
  "fromUrl": "https://example.com/structure.txt"
}
```
Fetches structure from URL

### Output & Behavior

```json
{
  "output": "./my-project",     // Where to create (default: ./output)
  "boilerplate": true,           // Add smart code (default: false)
  "gitInit": true,               // Initialize git (default: false)
  "gitCommit": true,             // Create first commit (default: false)
  "gitPush": false,              // Push to GitHub (default: false)
  "install": true,               // Auto npm/pip install (default: false)
  "preview": false,              // Just show tree (default: false)
  "dryRun": false,               // Test without creating (default: false)
  "verbose": true                // Show all messages (default: true)
}
```

## 🎯 Common Configurations

### 1. Quick Development Setup
```json
{
  "template": "node",
  "output": "./api",
  "boilerplate": true,
  "gitInit": true,
  "install": true
}
```
**Usage:** `treemk` → Creates ready-to-code Node.js API

### 2. React App with Git
```json
{
  "template": "react",
  "output": "./my-react-app",
  "boilerplate": true,
  "gitInit": true
}
```
**Usage:** `treemk` → React app ready to code

### 3. From Custom File
```json
{
  "input": "my-structure.txt",
  "output": "./project",
  "boilerplate": true,
  "gitInit": true,
  "gitCommit": true
}
```
**Usage:** `treemk` → Reads from `my-structure.txt`

### 4. Using Saved Template
```json
{
  "templateUse": "my-microservice",
  "output": "./service",
  "boilerplate": true,
  "install": true
}
```
**Usage:** `treemk` → Uses your saved template

### 5. Preview Only
```json
{
  "template": "node",
  "preview": true
}
```
**Usage:** `treemk` → Shows tree without creating files

### 6. Production-Ready Setup
```json
{
  "template": "node",
  "output": "./prod-api",
  "boilerplate": true,
  "install": true,
  "gitInit": true,
  "gitCommit": true,
  "gitPush": false
}
```
**Usage:** `treemk` → Complete production setup (except push)

## 🔧 Auto-Detection Feature

If your config has **no input source**, treemk will:

1. **Auto-detect** common files in current directory:
   - `structure.txt`
   - `project-structure.txt`
   - `tree.txt`
   - `structure.json`

2. **Fallback** to built-in `node` template if none found

Example:
```json
{
  "output": "./app",
  "boilerplate": true
}
```

Run `treemk` → Auto-detects `structure.txt` if present, or uses `node` template

## 💡 Override Config with CLI

CLI options always win over config:

**Config:**
```json
{
  "template": "node",
  "output": "./app"
}
```

**Command:**
```bash
treemk --template react --output ./react-app
```

**Result:** Uses `react` template and creates in `./react-app`

## 🎨 Multiple Configs

You can have different configs for different purposes:

```bash
# Default config
treemk.config.json

# Specific configs
treemk.api.json
treemk.frontend.json
treemk.microservice.json
```

Use specific config:
```bash
treemk --config treemk.api.json
```

## 📚 Complete Examples

### Example 1: Minimal Config (Recommended)
```json
{
  "template": "node",
  "boilerplate": true
}
```
Just run `treemk` and it creates in `./output` (default)

### Example 2: Team Standard
```json
{
  "input": "team-structure.txt",
  "output": "./new-project",
  "boilerplate": true,
  "gitInit": true,
  "install": true
}
```
Everyone on team uses same structure

### Example 3: Full Automation
```json
{
  "template": "node",
  "output": "./automated-api",
  "boilerplate": true,
  "install": true,
  "gitInit": true,
  "gitCommit": true
}
```
One command → Complete working project

### Example 4: Multi-line Text Input
```json
{
  "textInput": "src/\n  components/\n    App.jsx\n  index.js\nREADME.md",
  "output": "./app",
  "boilerplate": true
}
```
No external file needed!

## 🚨 Common Issues & Solutions

### Issue: "No input provided"

**Problem:** Config has no input source

**Solution:** Add one:
```json
{
  "template": "node",  // ← Add this
  "output": "./app"
}
```

### Issue: Config not loading

**Problem:** File not in current directory

**Solution:** Make sure you're in the right folder:
```bash
pwd  # Check current directory
ls treemk.config.json  # Should exist here
```

### Issue: CLI options not working

**Problem:** Might be typo in config

**Solution:** CLI always overrides:
```bash
treemk --template react  # Uses react even if config says node
```

## 🎯 Best Practices

1. **Keep it simple** - Only include options you need
2. **Use templates** - Faster than file paths
3. **Enable boilerplate** - Gets you started faster
4. **Version control** - Commit config with your project
5. **Team configs** - Share same structure across team

## 📋 Quick Reference

```json
{
  // INPUT (choose one)
  "template": "node|react|python",
  "input": "file.txt",
  "textInput": "inline\ntext",
  "jsonInput": "{\"json\":\"structure\"}",
  "templateUse": "saved-template",
  "fromUrl": "https://...",
  
  // OUTPUT
  "output": "./folder",
  
  // FEATURES
  "boilerplate": true|false,
  "gitInit": true|false,
  "gitCommit": true|false,
  "gitPush": true|false,
  "install": true|false,
  "preview": true|false,
  "dryRun": true|false,
  "verbose": true|false
}
```

## 🔄 Workflow Examples

### Daily Development
```bash
# One-time setup
treemk --setup

# Daily use
treemk  # That's it!
```

### Multiple Projects
```bash
# API project
echo '{"template":"node","output":"./api","boilerplate":true}' > api.json
treemk --config api.json

# Frontend project
echo '{"template":"react","output":"./app","boilerplate":true}' > app.json
treemk --config app.json
```

### Template Workflow
```bash
# Save once
treemk -i my-structure.txt --template-save company-standard

# Use in config
cat > treemk.config.json << 'EOF'
{
  "templateUse": "company-standard",
  "boilerplate": true,
  "gitInit": true
}
EOF

# Use forever
treemk --output ./project-1
treemk --output ./project-2
treemk --output ./project-3
```

---

# 🧪 Config Feature Testing Guide

## Quick Test Commands

### Test 1: Interactive Setup
```bash
treemk --setup
# Answer the prompts, then verify treemk.config.json was created
cat treemk.config.json
```

### Test 2: Setup and Run Immediately
```bash
treemk --setup --run
# Creates config and immediately generates project
ls -la my-project/  # or whatever folder you specified
```

### Test 3: Config with Built-in Template
```bash
cat > treemk.config.json << 'EOF'
{
  "template": "node",
  "output": "./test-node",
  "boilerplate": true,
  "gitInit": true
}
EOF

treemk
# Should create Node.js project in ./test-node/
ls test-node/
rm -rf test-node/
```

### Test 4: Config with File Input
```bash
# Create structure file first
cat > structure.txt << 'EOF'
src/index.js
src/app.js
tests/test.js
README.md
EOF

# Create config
cat > treemk.config.json << 'EOF'
{
  "input": "structure.txt",
  "output": "./test-file",
  "boilerplate": true
}
EOF

treemk
# Should create project from structure.txt
ls test-file/
rm -rf test-file/ structure.txt
```

### Test 5: Config with Inline Text
```bash
cat > treemk.config.json << 'EOF'
{
  "textInput": "src/index.js\nsrc/app.js\nREADME.md",
  "output": "./test-inline",
  "boilerplate": true
}
EOF

treemk
ls test-inline/
rm -rf test-inline/
```

### Test 6: Config with Auto-Detection
```bash
# Create a structure file with common name
cat > structure.txt << 'EOF'
src/server.js
src/routes/api.js
README.md
EOF

# Create config WITHOUT input source
cat > treemk.config.json << 'EOF'
{
  "output": "./test-auto",
  "boilerplate": true
}
EOF

treemk
# Should auto-detect structure.txt
ls test-auto/
rm -rf test-auto/ structure.txt
```

### Test 7: Config with Saved Template
```bash
# Save a template first
treemk --text "src/server.js\nsrc/models/User.js\ntests/test.js" --template-save test-api

# Create config using saved template
cat > treemk.config.json << 'EOF'
{
  "templateUse": "test-api",
  "output": "./test-saved",
  "boilerplate": true
}
EOF

treemk
ls test-saved/
rm -rf test-saved/
treemk --template-remove test-api
```

### Test 8: CLI Override Config
```bash
cat > treemk.config.json << 'EOF'
{
  "template": "node",
  "output": "./config-output",
  "boilerplate": false
}
EOF

# Override with CLI options
treemk --template react --output ./cli-output --boilerplate
# Should use react template and cli-output folder (not config values)
ls cli-output/
rm -rf cli-output/
```

### Test 9: Config with All Features
```bash
cat > treemk.config.json << 'EOF'
{
  "template": "node",
  "output": "./full-test",
  "boilerplate": true,
  "gitInit": true,
  "install": false
}
EOF

treemk
# Should create Node.js project with boilerplate and git
cd full-test && git status && cd ..
rm -rf full-test/
```

### Test 10: Auto-Detection Fallback (No Files)
```bash
# Make sure no structure files exist
rm -f structure.txt project-structure.txt tree.txt structure.json

# Create config without input
cat > treemk.config.json << 'EOF'
{
  "output": "./fallback-test",
  "boilerplate": true
}
EOF

treemk
# Should fallback to 'node' template
ls fallback-test/
rm -rf fallback-test/
```

### Test 11: Preview Mode in Config
```bash
cat > treemk.config.json << 'EOF'
{
  "template": "react",
  "preview": true
}
EOF

treemk
# Should only show tree preview, not create files
```

### Test 12: Multiple Output Runs
```bash
cat > treemk.config.json << 'EOF'
{
  "template": "node",
  "boilerplate": true,
  "gitInit": true
}
EOF

# Create multiple projects with same config
treemk --output ./api-1
treemk --output ./api-2
treemk --output ./api-3

ls api-1/ api-2/ api-3/
rm -rf api-1/ api-2/ api-3/
```

## Clean Up After Tests

```bash
# Remove config file
rm -f treemk.config.json

# Remove any test directories
rm -rf test-* my-project fallback-test api-* cli-output config-output full-test

# List templates to verify cleanup
treemk --template-list
```

## Expected Results Checklist

```
[ ] --setup creates treemk.config.json
[ ] --setup --run creates config and project immediately
[ ] Config with template works
[ ] Config with input file works
[ ] Config with textInput works
[ ] Config auto-detects structure.txt
[ ] Config auto-detects other common files
[ ] Config falls back to node template
[ ] CLI options override config
[ ] Config with all features works
[ ] Preview mode in config works
[ ] Multiple runs with same config work
```

## Troubleshooting

### If "No input provided" error:

**Check 1:** Does config have an input source?
```bash
cat treemk.config.json
# Should have: template, input, textInput, templateUse, or fromUrl
```

**Check 2:** Is there a structure file in current directory?
```bash
ls structure.txt project-structure.txt tree.txt
```

**Check 3:** Try explicit input:
```bash
treemk --template node
```

### If config not loading:

**Check 1:** Is file in current directory?
```bash
pwd
ls treemk.config.json
```

**Check 2:** Is JSON valid?
```bash
cat treemk.config.json | jq .
# or
node -e "console.log(JSON.parse(require('fs').readFileSync('treemk.config.json', 'utf8')))"
```

---

**All config features tested! ✅**

**Config file = One-time setup, infinite reuse! 🚀**