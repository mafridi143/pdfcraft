#!/bin/bash
set -e

echo "🎨 Applying ZemPDF customizations..."

# Load configuration
CONFIG_FILE="$(dirname "$0")/config.json"

# Read values from config
OLD_NAME=$(node -p "require('$CONFIG_FILE').branding.oldName")
NEW_NAME=$(node -p "require('$CONFIG_FILE').branding.newName")
BG_COLOR=$(node -p "require('$CONFIG_FILE').colors.background")

echo "📝 Replacing branding: $OLD_NAME → $NEW_NAME"

# Find and replace PDFCraft with ZemPDF in source files
# Exclude node_modules, .git, and build directories
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -exec sed -i "s/$OLD_NAME/$NEW_NAME/g" {} +

echo "🎨 Updating background color in globals.css"
# Update background color in globals.css
sed -i "s/--color-background: [0-9]* [0-9]*% [0-9]*%;/--color-background: $BG_COLOR;/" src/app/globals.css

echo "🖼️  Ensuring correct logos are in place"
# Copy ZemPDF logos to correct locations
cp public/images/zempdf-logo.svg public/favicon.svg 2>/dev/null || true
cp public/images/zempdf.png public/images/logo.png 2>/dev/null || true

echo "✅ Customizations applied successfully!"
