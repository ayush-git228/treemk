# 🧪 Complete Testing Guide for treemk

Follow these steps from scratch to test every feature.

## 📋 Prerequisites Check

```bash
# Check Node.js (need 16+)
node --version

# Check npm
npm --version

# Optional: Check gh CLI (for git push feature)
gh --version
```

## 🚀 Setup from Scratch

### Step 1: Create Project Structure
```bash
# Create main directory
mkdir treemk
cd treemk

# Create lib directory
mkdir lib

# Create files (you'll paste the code into these)
touch index.js
touch lib/structure-generator.js
touch lib/templates.js
touch lib/boilerplate.js
touch lib/config.js
touch package.json
touch README.md
touch LICENSE
```

### Step 2: Make index.js Executable
```bash
chmod +x index.js
```

### Step 3: Install Dependencies
```bash
npm install chalk
```

### Step 4: Link for Local Testing
```bash
# This makes 'treemk' command available globally on your system
npm link
```

## ✅ Test Suite - Run All Commands

### Test 1: Help Command
```bash
treemk --help
```
**Expected:** Shows full help documentation with colors

---

### Test 2: Inline Text Input (No File!)
```bash
treemk --text "src/index.js
src/app.js
tests/test.js
README.md" -o ./test-inline
```
**Expected:** Creates 4 files in `./test-inline/` folder

**Verify:**
```bash
ls -R test-inline/
rm -rf test-inline/
```

---

### Test 3: Inline JSON Input (No File!)
```bash
treemk --json-input '{"src":["index.js","app.js"],"tests":["test.js"]}' -o ./test-json
```
**Expected:** Creates structure from JSON

**Verify:**
```bash
tree test-json/
rm -rf test-json/
```

---

### Test 4: Built-in Template
```bash
treemk --template node -o ./test-node
```
**Expected:** Creates Node.js project structure

**Verify:**
```bash
ls -la test-node/
rm -rf test-node/
```

---

### Test 5: Boilerplate Generation
```bash
treemk --template node -o ./test-boilerplate --boilerplate
```
**Expected:** Creates files WITH actual code content

**Verify:**
```bash
cat test-boilerplate/src/index.js
cat test-boilerplate/package.json
cat test-boilerplate/.gitignore
rm -rf test-boilerplate/
```

---

### Test 6: Preview Mode (No Creation)
```bash
treemk --template react --preview
```
**Expected:** Shows ASCII tree without creating files

---

### Test 7: From File (Current Directory)
```bash
# Create test file first
cat > structure.txt << 'EOF'
myapp/
├── src/
│   ├── server.js
│   └── routes/
│       └── api.js
├── tests/
│   └── test.js
└── package.json
EOF

treemk -i structure.txt -o ./test-from-file
```
**Expected:** Creates structure from file

**Verify:**
```bash
ls -R test-from-file/
rm -rf test-from-file/
rm structure.txt
```

---

### Test 8: Template Save & Use
```bash
# Save template
treemk --text "src/server.js
src/models/User.js
src/routes/users.js
tests/api.test.js
.env
package.json" --template-save my-api

# List templates
treemk --template-list

# Use saved template
treemk --template-use my-api -o ./test-template --boilerplate

# Verify
ls -R test-template/
cat test-template/src/server.js

# Cleanup
rm -rf test-template/
```

---

### Test 9: Git Integration
```bash
treemk --template node -o ./test-git --git-init

# Verify git initialized
cd test-git/
git status
cd ..
rm -rf test-git/
```

---

### Test 10: Git Init + Commit
```bash
treemk --template node -o ./test-git-commit --git-init --git-commit

# Verify commit exists
cd test-git-commit/
git log
cd ..
rm -rf test-git-commit/
```

---

### Test 11: Dependency Installation
```bash
treemk --template node -o ./test-install --boilerplate --install

# Expected: npm install runs automatically
# Verify node_modules exists
ls test-install/
rm -rf test-install/
```

---

### Test 12: Dry Run
```bash
treemk --template node -o ./test-dry --dry-run
```
**Expected:** Shows what would be created but doesn't create anything

**Verify:**
```bash
ls test-dry/  # Should not exist
```

---

### Test 13: Piped Input (stdin)
```bash
echo "src/index.js
src/app.js
README.md" | treemk -o ./test-pipe

# Verify
ls test-pipe/
rm -rf test-pipe/
```

---

### Test 14: Config File
```bash
# Create config file
cat > treemk.config.json << 'EOF'
{
  "output": "./configured-app",
  "boilerplate": true,
  "gitInit": true
}
EOF

# Run without specifying options (uses config)
treemk --template node

# Verify
ls configured-app/
cat configured-app/src/index.js
cd configured-app && git status && cd ..

# Cleanup
rm -rf configured-app/
rm treemk.config.json
```

---

### Test 15: File from Different Location
```bash
# Create file in Downloads
echo "src/index.js
README.md" > ~/Downloads/test-structure.txt

# Access it without full path
treemk -i test-structure.txt -o ./test-downloads

# Verify
ls test-downloads/

# Cleanup
rm ~/Downloads/test-structure.txt
rm -rf test-downloads/
```

---

### Test 16: All Features Combined
```bash
treemk --template node \
  -o ./full-test \
  --boilerplate \
  --install \
  --git-init \
  --git-commit

# Verify everything
ls -la full-test/
cat full-test/src/index.js
cd full-test && git log && npm list && cd ..

# Cleanup
rm -rf full-test/
```

---

### Test 17: Template Remove
```bash
# Remove previously saved template
treemk --template-remove my-api

# Verify it's gone
treemk --template-list
```

---

### Test 18: URL Fetch (Optional - needs internet)
```bash
# Create a test structure file online first, or use example
treemk --from-url https://raw.githubusercontent.com/username/repo/main/structure.txt -o ./test-url

# Cleanup
rm -rf test-url/
```

---

### Test 19: Error Handling
```bash
# Test with no input (should show helpful error)
treemk

# Test with invalid file
treemk -i nonexistent.txt

# Test with invalid template
treemk --template invalid
```

---

### Test 20: Context-Aware Boilerplate
```bash
treemk --text "src/server.js
src/models/User.js
src/routes/api.js
tests/test.js
Dockerfile
.env
.gitignore" -o ./test-context --boilerplate

# Verify smart content generation
cat test-context/src/server.js  # Should have Express code
cat test-context/src/models/User.js  # Should have Mongoose code
cat test-context/src/routes/api.js  # Should have router code
cat test-context/tests/test.js  # Should have Jest code
cat test-context/Dockerfile  # Should have Docker config
cat test-context/.env  # Should have env vars
cat test-context/.gitignore  # Should have ignore patterns

# Cleanup
rm -rf test-context/
```

---

## 🎯 Quick Verification Script

Run this to test multiple scenarios quickly:

```bash
#!/bin/bash
echo "🧪 Running treemk test suite..."

echo "\n✅ Test 1: Inline text"
treemk --text "src/index.js" -o ./t1 && rm -rf t1 && echo "PASS" || echo "FAIL"

echo "\n✅ Test 2: Template"
treemk --template node -o ./t2 && rm -rf t2 && echo "PASS" || echo "FAIL"

echo "\n✅ Test 3: Boilerplate"
treemk --template node -o ./t3 -b && rm -rf t3 && echo "PASS" || echo "FAIL"

echo "\n✅ Test 4: Preview"
treemk --template react --preview && echo "PASS" || echo "FAIL"

echo "\n✅ Test 5: Template save/use"
treemk --text "test.js" --template-save test-tmp && \
treemk --template-use test-tmp -o ./t5 && \
treemk --template-remove test-tmp && \
rm -rf t5 && echo "PASS" || echo "FAIL"

echo "\n✅ Test 6: Git init"
treemk --template node -o ./t6 -g && rm -rf t6 && echo "PASS" || echo "FAIL"

echo "\n🎉 All tests completed!"
```

Save as `test-suite.sh`, make executable, and run:
```bash
chmod +x test-suite.sh
./test-suite.sh
```

## 🐛 Common Issues

### Issue: "command not found: treemk"
**Solution:**
```bash
cd /path/to/treemk
npm link
```

### Issue: "Cannot find module"
**Solution:**
```bash
npm install chalk
```

### Issue: "Permission denied"
**Solution:**
```bash
chmod +x index.js
```

### Issue: Files not created
**Check:**
```bash
treemk --verbose --text "test.js" -o ./debug
```

## ✅ Success Criteria

All tests should:
- ✅ Run without errors
- ✅ Create correct file structure
- ✅ Generate appropriate boilerplate when requested
- ✅ Show colored output in terminal
- ✅ Handle errors gracefully with helpful messages

## 🎓 Next Steps

After all tests pass:
1. Publish to npm: `npm publish`
2. Share with team
3. Add to your workflow!

## 📝 Testing Checklist

```
[ ] Help command works
[ ] Inline text input works
[ ] Inline JSON input works
[ ] Built-in templates work (react, node, python)
[ ] Boilerplate generation works
[ ] Preview mode works
[ ] File input from any location works
[ ] Template save/use/list/remove works
[ ] Git init works
[ ] Git commit works
[ ] Dependency installation works
[ ] Dry run works
[ ] Piped input works
[ ] Config file works
[ ] Error handling is helpful
[ ] All paths resolve correctly
```

---

**Happy Testing! 🚀**