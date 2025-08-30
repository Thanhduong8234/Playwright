#!/bin/bash

# 🧹 Playwright Repository Cleanup Script
# This script removes test result directories from Git tracking

echo "🧹 Starting repository cleanup..."

# Check if we're in a Git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a Git repository"
    exit 1
fi

# Directories to remove from Git tracking
DIRECTORIES=(
    "test-results"
    "playwright-report"
    "traces"
    "debug-screenshots"
    "screenshots"
    "downloads"
    "test-files"
)

echo "📁 Removing directories from Git tracking..."

# Remove each directory from Git tracking
for dir in "${DIRECTORIES[@]}"; do
    if [ -d "$dir" ]; then
        echo "  🗑️  Removing $dir/ from Git tracking..."
        git rm -r --cached "$dir/" 2>/dev/null || echo "    ⚠️  $dir/ was not tracked by Git"
    else
        echo "  ℹ️   $dir/ directory does not exist"
    fi
done

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Review changes: git status"
echo "2. Commit cleanup: git commit -m 'Remove test result directories from tracking'"
echo "3. Push changes: git push origin main"
echo ""
echo "🧪 Test the setup by running: npm run test:basic"
echo "   Then check: git status (should not show test result files)"
echo ""
echo "📚 For more details, see: CLEANUP.md"
