const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');

const EXTENSIONS_TO_CONVERT = ['.jpg', '.jpeg', '.png'];

async function convertToWebP(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!EXTENSIONS_TO_CONVERT.includes(ext)) return;

  const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  try {
    await sharp(filePath)
      .webp({ quality: 85 })
      .toFile(webpPath);

    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = (((originalSize - webpSize) / originalSize) * 100).toFixed(1);

    console.log(`✓ ${path.basename(filePath)} → ${path.basename(webpPath)} (${(originalSize/1024).toFixed(0)}KB → ${(webpSize/1024).toFixed(0)}KB, -${savings}%)`);

    // Delete original after successful conversion
    fs.unlinkSync(filePath);
    console.log(`  ✗ Deleted original: ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`✗ Failed to convert ${filePath}: ${err.message}`);
  }
}

async function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS_TO_CONVERT.includes(ext)) {
        await convertToWebP(fullPath);
      }
    }
  }
}

console.log('🔄 Converting all images to WebP...\n');
walkDir(PUBLIC_IMAGES_DIR).then(() => {
  console.log('\n✅ Done! All images converted to WebP.');
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
