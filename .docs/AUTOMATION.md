# ZemPDF Automation Guide

## Overview

This project includes complete automation for maintaining your ZemPDF fork of PDFCraftTool/pdfcraft with automatic branding, sitemap generation, and deployment.

## Quick Start

### Single Command Sync
```bash
npm run sync
```
This command will:
1. Fetch latest changes from upstream
2. Merge into your main branch
3. Apply ZemPDF customizations
4. Regenerate package-lock.json
5. Generate sitemap

### Generate Sitemap Only
```bash
npm run sitemap
```

### Apply Customizations Only
```bash
npm run customize
```

### Test Build Locally
```bash
npm run deploy:local
```

## Automation Features

### 🔄 Automated Upstream Sync
- **Schedule**: Every Sunday at 2 AM UTC
- **Manual Trigger**: Available in GitHub Actions
- **What it does**:
  - Fetches latest upstream changes
  - Merges into main branch
  - Applies ZemPDF branding
  - Updates dependencies
  - Generates sitemap
  - Commits and pushes changes

### 🗺️ Sitemap Generation
- **Automatic**: Generated before every build
- **Manual**: Run `npm run sitemap`
- **Includes**:
  - All static pages (home, tools, workflow, about, faq, contact)
  - All tool pages
  - All 8 supported locales
  - Proper SEO metadata

### 🎨 Customization System
- **Centralized Config**: `scripts/config.json`
- **What it customizes**:
  - Replaces "PDFCraft" with "ZemPDF"
  - Updates background color
  - Ensures correct logos
  - Updates URLs and links

### 🚀 Automated Deployment
- **Trigger**: Every push to main branch
- **Process**:
  1. Generate sitemap
  2. Build Next.js app
  3. Deploy to GitHub Pages
  4. Site live at https://zempdf.com

## File Structure

```
scripts/
├── config.json              # Centralized configuration
├── generate-sitemap.js      # Sitemap generator
├── customize.ps1            # Customization script (Windows)
├── customize.sh             # Customization script (Linux/Mac)
├── sync-upstream.ps1        # Full sync script (Windows)
└── sync-upstream.sh         # Full sync script (Linux/Mac)

.github/workflows/
├── sync-upstream.yml        # Automated sync workflow
└── deploy.yml               # Deployment workflow

public/
├── robots.txt               # SEO robots file
└── sitemap.xml              # Generated sitemap (auto-created)
```

## Configuration

Edit `scripts/config.json` to customize:

```json
{
  "branding": {
    "oldName": "PDFCraft",
    "newName": "ZemPDF",
    "oldUrl": "pdfcraft.com",
    "newUrl": "zempdf.com"
  },
  "colors": {
    "background": "210 40% 94%"
  },
  "sitemap": {
    "siteUrl": "https://zempdf.com",
    "locales": ["en", "zh", "es", "fr", "de", "ja", "ko", "pt"]
  }
}
```

## Manual Sync Process

If you prefer to sync manually:

1. **Fetch upstream**:
   ```bash
   git fetch upstream
   ```

2. **Merge changes**:
   ```bash
   git merge upstream/main
   ```

3. **Apply customizations**:
   ```bash
   npm run customize
   ```

4. **Fix dependencies**:
   ```bash
   rm package-lock.json
   npm install
   ```

5. **Generate sitemap**:
   ```bash
   npm run sitemap
   ```

6. **Commit and push**:
   ```bash
   git add .
   git commit -m "Sync with upstream and apply customizations"
   git push origin main
   ```

## GitHub Actions Workflows

### Sync with Upstream
- **File**: `.github/workflows/sync-upstream.yml`
- **Trigger**: Weekly (Sundays 2 AM) or manual
- **Manual Trigger**: Go to Actions → Sync with Upstream → Run workflow

### Deploy to GitHub Pages
- **File**: `.github/workflows/deploy.yml`
- **Trigger**: Push to main branch or manual
- **Output**: https://zempdf.com

## Troubleshooting

### Merge Conflicts

When syncing with upstream results in conflicts:

#### Quick Resolution (Accept Your Local Changes)
```bash
# Check which files have conflicts
git diff --name-only --diff-filter=U

# Accept your local version for a specific file
git checkout --ours <filename>
git add <filename>

# Example: Keep your deploy.yml
git checkout --ours .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
```

#### Quick Resolution (Accept Upstream Changes)
```bash
# Accept the upstream version for a specific file
git checkout --theirs <filename>
git add <filename>

# Example: Use upstream's deploy.yml
git checkout --theirs .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
```

#### Manual Resolution (Edit the File)
1. Open the conflicted file in your editor
2. Look for conflict markers:
   ```
   <<<<<<< HEAD
   Your local changes
   =======
   Upstream changes
   >>>>>>> upstream/main
   ```
3. Edit the file to keep the code you want
4. Remove the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
5. Save and stage the file:
   ```bash
   git add <filename>
   ```

#### Complete the Merge
```bash
# After resolving all conflicts
git commit -m "Merge upstream/main and resolve conflicts"
git push origin main
```

#### Abort the Merge (Start Over)
```bash
git merge --abort
```

#### Common Conflict: deploy.yml
If `.github/workflows/deploy.yml` conflicts, typically keep your local version since it includes:
- Your sitemap generation step
- CNAME for zempdf.com
- peaceiris/actions-gh-pages for deployment

```bash
git checkout --ours .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "Merge upstream, keep local deploy workflow"
```

### Sitemap Not Updating
```bash
# Regenerate sitemap
npm run sitemap

# Verify it exists
ls public/sitemap.xml

# Check content
cat public/sitemap.xml
```

### Customizations Not Applied
```bash
# Reapply customizations
npm run customize

# Check for remaining PDFCraft references
grep -r "PDFCraft" src/
```

### Build Failures
```bash
# Clean and rebuild
rm -rf node_modules package-lock.json .next out
npm install
npm run build
```

## SEO Optimization

### Sitemap Submission
1. Visit [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://zempdf.com`
3. Submit sitemap: `https://zempdf.com/sitemap.xml`

### Robots.txt
Located at `public/robots.txt` - automatically deployed with your site.

## Best Practices

1. **Review Changes**: Always review automated sync commits
2. **Test Locally**: Run `npm run deploy:local` before pushing
3. **Monitor Workflows**: Check GitHub Actions for failures
4. **Update Config**: Keep `scripts/config.json` up to date
5. **Backup**: Keep important customizations documented

## Support

For issues or questions:
1. Check `.docs/` folder for detailed guides
2. Review GitHub Actions logs
3. Test locally with `npm run sync`
4. Check implementation plan in `.docs/implementation_plan.md`
