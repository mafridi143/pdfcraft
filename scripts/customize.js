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
const srcDir = path.join(__dirname, '../src');

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            replaceInFiles(filePath);
        } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
            let content = fs.readFileSync(filePath, 'utf-8');
            if (content.includes(oldName)) {
                content = content.replace(new RegExp(oldName, 'g'), newName);
                fs.writeFileSync(filePath, content, 'utf-8');
                console.log(`  ✓ Updated: ${path.relative(process.cwd(), filePath)}`);
            }
        }
    });
}

replaceInFiles(srcDir);

console.log('\n🎨 Updating background color in globals.css');
const globalsPath = path.join(__dirname, '../src/app/globals.css');
let globalsContent = fs.readFileSync(globalsPath, 'utf-8');
globalsContent = globalsContent.replace(
    /--color-background:\s*\d+\s+\d+%\s+\d+%;/g,
    `--color-background: ${background};`
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
