#!/bin/bash
# Win12 Theme-Mac: Clear all caches and rebuild
# Usage: ./clear-and-build.sh

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "=========================================="
echo "🔄 Win12 Full Cache Clear & Rebuild"
echo "=========================================="

# Clear Node caches
echo "📦 Clearing Node caches..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf .next 2>/dev/null || true
rm -rf dist 2>/dev/null || true
npm cache clean --force

# Clear Laravel Herd caches (if using Herd)
echo "🎯 Clearing Herd caches..."
rm -rf storage/framework/cache/* 2>/dev/null || true
rm -rf public/storage 2>/dev/null || true

# Remove public build artifacts
echo "🗑️  Removing old public/ builds..."
rm -rf public/* 2>/dev/null || true
mkdir -p public

# Full rebuild
echo "🏗️  Running full build..."
npm run build

echo ""
echo "=========================================="
echo "✅ Build complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Open DevTools (F12)"
echo "2. Application → Service Workers → Unregister all"
echo "3. Storage → Clear all site data"
echo "4. Hard refresh: Ctrl+Shift+R"
echo ""
echo "Then navigate to: https://win12.test"
