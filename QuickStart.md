# ⚡ Quick Start - 2 Minutes to Your Project

## Step 1: Setup (30 seconds)

```bash
# Navigate to your treemk folder
cd /path/to/treemk

# Install dependencies
npm install

# Make it available globally
npm link
```

## Step 2: Test It Works (10 seconds)

```bash
treemk --help
```

You should see colored help text. ✅

## Step 3: Create Your First Project (20 seconds)

### Option A: Use Built-in Template (Easiest)
```bash
treemk --template node -o ./my-first-app --boilerplate
```

### Option B: Inline Text (No File Needed)
```bash
treemk --text "src/index.js
src/app.js
tests/test.js
README.md
package.json" -o ./my-app --boilerplate
```

### Option C: From a File
```bash
# Create a file first
echo "src/index.js
README.md" > structure.txt

# Generate from it
treemk -i structure.txt -o ./my-app
```

## Step 4: Check Your Creation (20 seconds)

```bash
cd my-first-app  # or my-app
ls -la
cat src/index.js  # See the generated code!
```

## 🎉 You're Done!

## What You Can Do Now

### Save Templates for Reuse
```bash
treemk --text "src/server.js
src/routes/api.js
tests/test.js" --template-save my-api

# Use it anytime
treemk --template-use my-api -o ./new-project
```

### Full Automation
```bash
treemk --template node \
  -o ./my-api \
  --boilerplate \
  --install \
  --git-init \
  --git-commit
```

### Preview Before Creating
```bash
treemk --template react --preview
```

## 🎓 Learn More

- **See all commands:** `treemk --help`
- **Run all tests:** Check `TESTING.md`
- **Full guide:** Check `README.md`

## 💡 Pro Tips

1. **No file needed!** Use `--text` for quick structures
2. **Work from anywhere** - file paths are smart
3. **Save once, reuse forever** with templates
4. **Preview first** with `--preview`

## 🚀 Common Commands You'll Use

```bash
# Quick Node.js API
treemk --template node -o ./api -b --install -g

# Quick React App
treemk --template react -o ./app -b

# Save your structure
treemk -i my-structure.txt --template-save favorite

# Reuse it
treemk --template-use favorite -o ./new-project -b

# Preview any template
treemk --template node --preview
```

## ❓ Problems?

**treemk command not found?**
```bash
cd /path/to/treemk && npm link
```

**No colors showing?**
```bash
npm install chalk
```

**Need help?**
```bash
treemk --help
```

---

**That's it! Now go build something awesome! 🚀**