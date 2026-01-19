# Sync with Upstream and Apply Customizations
Write-Host "🔄 Syncing with upstream PDFCraftTool/pdfcraft..." -ForegroundColor Cyan

# Ensure we're on main branch
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "main") {
    Write-Host "⚠️  Switching to main branch..." -ForegroundColor Yellow
    git checkout main
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  You have uncommitted changes. Please commit or stash them first." -ForegroundColor Red
    exit 1
}

# Fetch upstream
Write-Host "📥 Fetching upstream changes..." -ForegroundColor Yellow
git fetch upstream

# Merge upstream/main
Write-Host "🔀 Merging upstream/main..." -ForegroundColor Yellow
git merge upstream/main --no-edit

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Merge conflicts detected. Please resolve them manually." -ForegroundColor Red
    exit 1
}

# Apply customizations
Write-Host "`n🎨 Applying ZemPDF customizations..." -ForegroundColor Cyan
& "$PSScriptRoot\customize.ps1"

# Regenerate package-lock.json
Write-Host "`n📦 Regenerating package-lock.json..." -ForegroundColor Yellow
Remove-Item "package-lock.json" -ErrorAction SilentlyContinue
npm install

# Generate sitemap
Write-Host "`n🗺️  Generating sitemap..." -ForegroundColor Yellow
node scripts/generate-sitemap.js

# Show status
Write-Host "`n📊 Changes made:" -ForegroundColor Cyan
git status --short

Write-Host "`n✅ Sync complete! Review changes and commit:" -ForegroundColor Green
Write-Host "   git add ." -ForegroundColor White
Write-Host "   git commit -m 'Sync with upstream and apply customizations'" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor White
