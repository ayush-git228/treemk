#!/bin/bash

# treemk Setup Script
# Run this to set up treemk from scratch

set -e  # Exit on error

echo "🚀 treemk Setup Script"
echo "====================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Install from: https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"
echo ""

# Check npm
echo -e "${BLUE}Checking npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✓ npm $NPM_VERSION${NC}"
echo ""

# Get current directory
CURRENT_DIR=$(pwd)
echo -e "${BLUE}Working directory: ${YELLOW}$CURRENT_DIR${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}⚠️  No package.json found${NC}"
    echo "Make sure you're in the treemk directory"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create directory structure if needed
echo -e "${BLUE}Creating directory structure...${NC}"
mkdir -p lib
echo -e "${GREEN}✓ Directories created${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install chalk
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Make index.js executable
if [ -f "index.js" ]; then
    echo -e "${BLUE}Making index.js executable...${NC}"
    chmod +x index.js
    echo -e "${GREEN}✓ index.js is now executable${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  index.js not found (create it first)${NC}"
    echo ""
fi

# Link globally
echo -e "${BLUE}Linking treemk globally...${NC}"
npm link
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ treemk linked successfully${NC}"
    echo ""
else
    echo -e "${RED}❌ Failed to link treemk${NC}"
    echo "Try running: sudo npm link"
    exit 1
fi

# Test the installation
echo -e "${BLUE}Testing installation...${NC}"
if command -v treemk &> /dev/null; then
    echo -e "${GREEN}✓ treemk command is available${NC}"
    echo ""
else
    echo -e "${RED}❌ treemk command not found${NC}"
    exit 1
fi

# Create test structure
echo -e "${BLUE}Running quick test...${NC}"
treemk --text "test/index.js" -o ./setup-test --quiet 2>/dev/null || true
if [ -d "setup-test" ]; then
    echo -e "${GREEN}✓ Test passed!${NC}"
    rm -rf setup-test
else
    echo -e "${YELLOW}⚠️  Test warning (might be expected)${NC}"
fi
echo ""

# Success message
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Quick Start:${NC}"
echo ""
echo -e "  1. Show help:"
echo -e "     ${YELLOW}treemk --help${NC}"
echo ""
echo -e "  2. Create your first project:"
echo -e "     ${YELLOW}treemk --template node -o ./myapp -b${NC}"
echo ""
echo -e "  3. Use inline input (no file!):"
echo -e "     ${YELLOW}treemk --text \"src/index.js\\nREADME.md\" -o ./app${NC}"
echo ""
echo -e "${BLUE}What to do next:${NC}"
echo ""
echo "  📖 Read QUICKSTART.md - Get started in 2 minutes"
echo "  🧪 Check TESTING.md - Run complete test suite"
echo "  📚 See README.md - Full documentation"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo ""
echo "  treemk --help              Show all options"
echo "  treemk --template-list     List saved templates"
echo "  treemk --preview --template node    Preview structure"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""