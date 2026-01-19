import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Syncing with upstream PDFCraftTool/pdfcraft...\n');

try {
    // Check current branch
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    if (currentBranch !== 'main') {
        console.log('⚠️  Switching to main branch...');
        execSync('git checkout main', { stdio: 'inherit' });
    }

    // Check for uncommitted changes
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (status.trim()) {
        console.error('❌ You have uncommitted changes. Please commit or stash them first.');
        process.exit(1);
    }

    // Fetch upstream
    console.log('📥 Fetching upstream changes...');
    execSync('git fetch upstream', { stdio: 'inherit' });

    // Merge upstream/main
    console.log('\n🔀 Merging upstream/main...');
    try {
        execSync('git merge upstream/main --no-edit', { stdio: 'inherit' });
    } catch (error) {
        console.error('\n❌ Merge conflicts detected. Please resolve them manually.');
        process.exit(1);
    }

    // Apply customizations
    console.log('\n🎨 Applying ZemPDF customizations...');
    execSync('node scripts/customize.js', { stdio: 'inherit' });

    // Regenerate package-lock.json
    console.log('\n📦 Regenerating package-lock.json...');
    if (fs.existsSync('package-lock.json')) {
        fs.unlinkSync('package-lock.json');
    }
    execSync('npm install', { stdio: 'inherit' });

    // Generate sitemap
    console.log('\n🗺️  Generating sitemap...');
    execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });

    // Show status
    console.log('\n📊 Changes made:');
    execSync('git status --short', { stdio: 'inherit' });

    console.log('\n✅ Sync complete! Review changes and commit:');
    console.log('   git add .');
    console.log('   git commit -m "Sync with upstream and apply customizations"');
    console.log('   git push origin main');

} catch (error) {
    console.error('\n❌ Error during sync:', error.message);
    process.exit(1);
}
