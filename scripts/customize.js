import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎨 Applying ZemPDF customizations...\n');

// Load configuration
const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const { oldName, newName } = config.branding;
const { background } = config.colors;

console.log(`📝 Replacing branding: ${oldName} → ${newName}`);

// Find and replace in source files
const directoriesToProcess = [
    path.join(__dirname, '../src'),
    path.join(__dirname, '../messages'),
];

function replaceInFiles(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            replaceInFiles(filePath);
        } else if (/\.(ts|tsx|js|jsx|json)$/.test(file)) {
            let content = fs.readFileSync(filePath, 'utf-8');
            let updated = false;

            // Replace standard name (PDFCraft -> ZemPDF)
            if (content.includes(config.branding.oldName)) {
                content = content.replace(new RegExp(config.branding.oldName, 'g'), config.branding.newName);
                updated = true;
            }

            // Replace lowercase name (pdfcraft -> zempdf)
            const oldNameLower = config.branding.oldName.toLowerCase();
            const newNameLower = config.branding.newName.toLowerCase();
            if (content.includes(oldNameLower)) {
                content = content.replace(new RegExp(oldNameLower, 'g'), newNameLower);
                updated = true;
            }

            // Replace github org (PDFCraftTool -> mafridi143)
            if (config.branding.oldGithub && content.includes(config.branding.oldGithub)) {
                content = content.replace(new RegExp(config.branding.oldGithub, 'g'), config.branding.newGithub);
                updated = true;
            }

            // Replace URL (pdfcraft.com -> zempdf.com)
            if (config.branding.oldUrl && content.includes(config.branding.oldUrl)) {
                content = content.replace(new RegExp(config.branding.oldUrl, 'g'), config.branding.newUrl);
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(filePath, content, 'utf-8');
                console.log(`  ✓ Updated: ${path.relative(process.cwd(), filePath)}`);
            }
        }
    });
}

directoriesToProcess.forEach(dir => replaceInFiles(dir));

console.log('\n🎨 Updating background color in globals.css');
const globalsPath = path.join(__dirname, '../src/app/globals.css');
let globalsContent = fs.readFileSync(globalsPath, 'utf-8');
globalsContent = globalsContent.replace(
    /(:root\s*\{[^}]*?--color-background:\s*)\d+\s+\d+%\s+\d+%;/,
    `$1${background};`
);
fs.writeFileSync(globalsPath, globalsContent, 'utf-8');

console.log('🖼️  Ensuring correct logos are in place');
try {
    fs.copyFileSync(
        path.join(__dirname, '../public/images/zempdf-logo.svg'),
        path.join(__dirname, '../public/favicon.svg')
    );
    fs.copyFileSync(
        path.join(__dirname, '../public/images/zempdf.png'),
        path.join(__dirname, '../public/images/logo.png')
    );
} catch (err) {
    console.log('  ⚠️  Logo files already in place or not found');
}

console.log('\n✅ Customizations applied successfully!');
