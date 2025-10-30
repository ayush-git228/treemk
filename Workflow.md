# 🔄 treemk Workflow & Architecture

## 📊 How It Works (Visual Flow)

```
┌─────────────────────────────────────────────────────────────┐
│                    INPUT METHODS (Choose One)                │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │  --text  │  │  --json  │  │   File   │
         │  Inline  │  │  Inline  │  │ Anywhere │
         └──────────┘  └──────────┘  └──────────┘
                │             │             │
                │             │             │
                ▼             ▼             ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │Template  │  │   Pipe   │  │   URL    │
         │ Built-in │  │  stdin   │  │  Fetch   │
         └──────────┘  └──────────┘  └──────────┘
                │             │             │
                └─────────────┼─────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  PARSE & VALIDATE │
                    │   (index.js)      │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  STRUCTURE GEN   │
                    │  (lib/structure) │
                    └──────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │  Create  │  │ Preview  │  │ Dry Run  │
         │  Files   │  │   Only   │  │   Only   │
         └──────────┘  └──────────┘  └──────────┘
                │
                ▼
         ┌──────────────┐
         │ Boilerplate? │
         └──────────────┘
                │
         ┌──────┴──────┐
         │             │
         ▼             ▼
      ┌────┐        ┌────┐
      │YES │        │ NO │
      └────┘        └────┘
         │             │
         ▼             │
    ┌─────────┐       │
    │ Smart   │       │
    │ Content │       │
    └─────────┘       │
         │             │
         └──────┬──────┘
                │
                ▼
         ┌──────────────┐
         │   Install?   │
         └──────────────┘
                │
         ┌──────┴──────┐
         │             │
         ▼             ▼
    ┌────────┐    ┌────────┐
    │npm/pip │    │  Skip  │
    └────────┘    └────────┘
         │             │
         └──────┬──────┘
                │
                ▼
         ┌──────────────┐
         │ Git Init?    │
         └──────────────┘
                │
         ┌──────┴──────┐
         │             │
         ▼             ▼
    ┌────────┐    ┌────────┐
    │git init│    │  Skip  │
    │commit  │    │        │
    │push    │    │        │
    └────────┘    └────────┘
         │             │
         └──────┬──────┘
                │
                ▼
         ┌──────────────┐
         │   SUCCESS!   │
         │   ✅ Done    │
         └──────────────┘
```

## 🏗️ Architecture (Module Breakdown)

```
┌─────────────────────────────────────────────────────────┐
│                      index.js (430+ lines)               │
│  ┌────────────────────────────────────────────────────┐ │
│  │ • Argument parsing                                  │ │
│  │ • Input source detection                           │ │
│  │ • Path resolution (any location)                   │ │
│  │ • Error handling & user messages                   │ │
│  │ • Config file loading                              │ │
│  │ • Template operations routing                      │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  templates.js│     │ structure-   │     │boilerplate.js│
│  (150 lines) │     │generator.js  │     │  (220 lines) │
│              │     │  (280 lines) │     │              │
│ • Save       │     │              │     │ • server.js  │
│ • Load       │     │ • Parse tree │     │ • model.js   │
│ • List       │     │ • Parse JSON │     │ • route.js   │
│ • Remove     │     │ • Create dirs│     │ • test.js    │
│ • Built-in   │     │ • Create files│    │ • Dockerfile │
│              │     │ • Preview    │     │ • .env       │
│              │     │ • Git ops    │     │ • .gitignore │
│              │     │ • npm/pip    │     │ • etc.       │
└──────────────┘     └──────────────┘     └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                     ┌──────────────┐
                     │  config.js   │
                     │  (25 lines)  │
                     │              │
                     │ • Load JSON  │
                     │ • Merge opts │
                     └──────────────┘
```

## 💡 Input Method Decision Tree

```
Need to create project?
    │
    ├─ Have structure file?
    │   ├─ YES ──► treemk -i file.txt -o ./app
    │   └─ NO
    │       │
    │       ├─ Simple structure?
    │       │   └─ YES ──► treemk --text "src/index.js\nREADME.md" -o ./app
    │       │
    │       ├─ Complex JSON structure?
    │       │   └─ YES ──► treemk --json-input '{"src":["index.js"]}' -o ./app
    │       │
    │       ├─ Standard project type?
    │       │   └─ YES ──► treemk --template node -o ./app
    │       │
    │       └─ Have saved template?
    │           └─ YES ──► treemk --template-use mytemplate -o ./app
    │
    └─ Want to preview first?
        └─ YES ──► treemk --preview --template node
```

## 🎯 Feature Decision Matrix

```
┌────────────────────┬──────────────────────────────────────┐
│   What You Want    │          Command Flag                 │
├────────────────────┼──────────────────────────────────────┤
│ Add real code      │ --boilerplate (-b)                   │
│ Install deps auto  │ --install                            │
│ Init git repo      │ --git-init (-g)                      │
│ First commit       │ --git-commit                         │
│ Push to GitHub     │ --git-push                           │
│ Preview only       │ --preview                            │
│ Test run           │ --dry-run (-d)                       │
│ Save for later     │ --template-save <n>                  │
│ Use saved          │ --template-use <n>                   │
│ List all templates │ --template-list                      │
│ Set defaults       │ Create treemk.config.json            │
└────────────────────┴──────────────────────────────────────┘
```

## 🔍 Path Resolution Flow

```
File input: treemk -i structure.txt
                │
                ▼
    ┌───────────────────────┐
    │ Try as absolute path  │
    │ /path/to/structure.txt│
    └───────────────────────┘
                │
            ✗ Not found
                │
                ▼
    ┌───────────────────────┐
    │ Try current directory │
    │ ./structure.txt       │
    └───────────────────────┘
                │
            ✗ Not found
                │
                ▼
    ┌───────────────────────┐
    │ Try script directory  │
    │ __dirname/structure   │
    └───────────────────────┘
                │
            ✗ Not found
                │
                ▼
    ┌───────────────────────┐
    │ Try Downloads         │
    │ ~/Downloads/structure │
    └───────────────────────┘
                │
            ✗ Not found
                │
                ▼
    ┌───────────────────────┐
    │ Try Documents         │
    │ ~/Documents/structure │
    └───────────────────────┘
                │
            ✗ Not found
                │
                ▼
    ┌───────────────────────┐
    │ Try Desktop           │
    │ ~/Desktop/structure   │
    └───────────────────────┘
                │
            ✗ Not found
                │
                ▼
         ┌──────────┐
         │  ERROR   │
         │  "Cannot │
         │   find"  │
         └──────────┘
```

## 🎨 Boilerplate Logic Flow

```
Create file: src/server.js
        │
        ▼
┌─────────────────┐
│ Boilerplate ON? │
└─────────────────┘
        │
    ┌───┴───┐
    │       │
   YES     NO
    │       │
    │       └──► Create empty file
    │
    ▼
┌──────────────────────┐
│ Check filename       │
│ "server.js"          │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Context-aware match? │
└──────────────────────┘
        │
    ┌───┴───┐
    │       │
   YES     NO
    │       │
    │       └──► Check extension (.js)
    │                    │
    │                    └──► Use extension template
    │
    ▼
┌──────────────────────┐
│ Get Express template │
│ (full working code)  │
└──────────────────────┘
        │
        ▼
┌──────────────────────┐
│ Write to file        │
└──────────────────────┘
```

## 📋 Template Storage Structure

```
~/.treemk/
    └── templates/
        ├── my-api.txt          # Your saved template
        ├── microservice.txt    # Another template
        └── react-app.txt       # Another template

Each .txt contains:
    src/
    ├── server.js
    ├── routes/
    │   └── api.js
    └── models/
        └── User.js
```

## 🔄 Complete Workflow Example

```
Developer wants to create API
            │
            ▼
    Run: treemk --template-save api
            │
    (Saves structure to ~/.treemk/templates/)
            │
            ▼
    Later: treemk --template-use api -o ./users-api -b --install -g
            │
            ├──► Parse arguments
            ├──► Load template from ~/.treemk/templates/api.txt
            ├──► Parse structure
            ├──► Create directories
            ├──► Create files with boilerplate
            ├──► Run npm install
            ├──► Run git init
            │
            ▼
    Complete API ready in <2 seconds!
            │
            ▼
    cd users-api && npm start
            │
            ▼
        🎉 Running!
```

## 🚀 Performance Flow

```
Time breakdown for: treemk --template node -o ./app -b --install -g

0.0s ─► Parse args & load config
0.1s ─► Load template
0.1s ─► Parse structure
0.2s ─► Create directories (10-20 dirs)
0.3s ─► Create files (20-30 files)
0.5s ─► Generate boilerplate content
1.0s ─► Run npm install (varies)
1.5s ─► Run git init
1.5s ─► Done! ✅

Total: ~1.5 seconds (without npm install)
Total: ~30 seconds (with npm install)
```

## 📊 Error Handling Chain

```
treemk -i structure.txt
        │
        ▼
    Parse args ──► OK
        │
        ▼
    Find file ───► ❌ Not found
        │
        ▼
    Try paths ───► ❌ All failed
        │
        ▼
    ┌─────────────────────────────┐
    │ Show helpful error:         │
    │ "Cannot find: structure.txt"│
    │                             │
    │ Try these paths:            │
    │ • Absolute path             │
    │ • Relative path             │
    │ • Downloads folder          │
    │                             │
    │ Or use --text instead!      │
    └─────────────────────────────┘
        │
        ▼
    Exit with code 1
```

## 🎯 Quick Decision Guide

```
┌─────────────────────────────────────────────────┐
│           When to Use What?                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  --text         ─► Quick, simple structures     │
│  --json-input   ─► Complex, nested structures   │
│  -i file        ─► Large, reusable structures   │
│  --template     ─► Standard project types       │
│  --template-use ─► Your saved templates         │
│  --preview      ─► Check before creating        │
│  --boilerplate  ─► Need working code            │
│  --install      ─► Ready-to-run project         │
│  --git-init     ─► Version control from start   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

**Visual guide to understanding treemk internals! 🎨**