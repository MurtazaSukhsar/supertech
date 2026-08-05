const fs = require('fs');
const path = require('path');

const dirs = ['app', 'components', 'lib', 'context', 'types'];
const exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.html'];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const fullPath = path.join(dir, e.name);
    if (e.isDirectory()) {
      processDir(fullPath);
    } else if (exts.includes(path.extname(e.name))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // Replace .jpeg, .jpg, .png when followed by quote, backtick, or whitespace
      const updated = content.replace(/\.(jpeg|jpg|png)(?=['"`\s])/g, '.webp');
      if (updated !== content) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log('Updated:', path.relative(process.cwd(), fullPath));
      }
    }
  }
}

dirs.forEach(processDir);
console.log('Done!');
