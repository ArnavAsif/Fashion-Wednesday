const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\ifas0\\Downloads\\products';
const dstDir = path.join(__dirname, '..', 'public', 'images', 'products');
const backupDir = path.join(__dirname, 'products_backup_before_update');

console.log('1. Creating backup in', backupDir);
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Copy existing dstDir to backup
const currentDstFolders = fs.readdirSync(dstDir).filter(f => fs.statSync(path.join(dstDir, f)).isDirectory());
for (const f of currentDstFolders) {
  const srcP = path.join(dstDir, f);
  const dstP = path.join(backupDir, f);
  if (!fs.existsSync(dstP)) fs.mkdirSync(dstP, { recursive: true });
  const files = fs.readdirSync(srcP);
  for (const file of files) {
    fs.copyFileSync(path.join(srcP, file), path.join(dstP, file));
  }
}
console.log('Backup complete. Backed up', currentDstFolders.length, 'folders.');

// 2. Remove product-21 completely from dstDir
const p21Path = path.join(dstDir, 'product-21');
if (fs.existsSync(p21Path)) {
  fs.rmSync(p21Path, { recursive: true, force: true });
  console.log('Removed product-21 folder from public/images/products');
}

// 3. Process all folders in srcDir
const srcFolders = fs.readdirSync(srcDir).filter(f => fs.statSync(path.join(srcDir, f)).isDirectory());
srcFolders.sort((a, b) => parseInt(a.replace('product-', '')) - parseInt(b.replace('product-', '')));

console.log('Found', srcFolders.length, 'folders in downloads.');

let totalImagesCopied = 0;

for (const f of srcFolders) {
  const srcFolderPath = path.join(srcDir, f);
  const dstFolderPath = path.join(dstDir, f);

  // Clear or create destination folder
  if (fs.existsSync(dstFolderPath)) {
    fs.rmSync(dstFolderPath, { recursive: true, force: true });
  }
  fs.mkdirSync(dstFolderPath, { recursive: true });

  let files = fs.readdirSync(srcFolderPath).filter(x => x.match(/\.(jpg|jpeg|png|webp)$/i));

  // Handle product-1 duplicates (pexels-*)
  if (f === 'product-1') {
    files = files.filter(x => !x.startsWith('pexels-'));
  }

  // Handle product-15 duplicate image_03
  if (f === 'product-15') {
    files = files.filter(x => x !== 'image_03.jpg_2K_20261018131225.jpg');
  }

  // Sort by integer prefix
  files.sort((a, b) => {
    const na = parseInt((a.match(/\d+/) || [0])[0]);
    const nb = parseInt((b.match(/\d+/) || [0])[0]);
    if (na !== nb) return na - nb;
    return a.localeCompare(b);
  });

  // Copy as image_01.jpg, image_02.jpg...
  files.forEach((file, idx) => {
    const newName = `image_${String(idx + 1).padStart(2, '0')}.jpg`;
    fs.copyFileSync(path.join(srcFolderPath, file), path.join(dstFolderPath, newName));
    totalImagesCopied++;
  });

  console.log(`Copied ${files.length} images for ${f}`);
}

console.log(`Finished copying images! Total: ${totalImagesCopied} images across ${srcFolders.length} folders.`);
