import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = 'https://zempdf.com';
const LOCALES = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt'];
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Import tools configuration
const toolsPath = path.join(__dirname, '../src/config/tools.ts');
const toolsContent = fs.readFileSync(toolsPath, 'utf-8');

// Extract tool slugs from tools.ts
function extractToolSlugs() {
    const slugMatches = toolsContent.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
    const slugs = Array.from(slugMatches, m => m[1]);
    return [...new Set(slugs)]; // Remove duplicates
}

// Generate sitemap XML
function generateSitemap() {
    const toolSlugs = extractToolSlugs();
    const currentDate = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static pages for each locale
    const staticPages = ['', '/tools', '/workflow', '/about', '/faq', '/contact'];

    LOCALES.forEach(locale => {
        // Add static pages
        staticPages.forEach(page => {
            const url = `${SITE_URL}/${locale}${page}`;
            const priority = page === '' ? '1.0' : page === '/tools' ? '0.9' : '0.7';
            xml += `  <url>\n`;
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <lastmod>${currentDate}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>${priority}</priority>\n`;
            xml += `  </url>\n`;
        });

        // Add tool pages
        toolSlugs.forEach(slug => {
            const url = `${SITE_URL}/${locale}/tools/${slug}`;
            xml += `  <url>\n`;
            xml += `    <loc>${url}</loc>\n`;
            xml += `    <lastmod>${currentDate}</lastmod>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.8</priority>\n`;
            xml += `  </url>\n`;
        });
    });

    xml += '</urlset>';

    return xml;
}

// Main execution
try {
    console.log('🗺️  Generating sitemap...');
    const sitemap = generateSitemap();
    fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf-8');
    console.log(`✅ Sitemap generated successfully at ${OUTPUT_PATH}`);
    console.log(`📊 Total URLs: ${(sitemap.match(/<url>/g) || []).length}`);
} catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
}
