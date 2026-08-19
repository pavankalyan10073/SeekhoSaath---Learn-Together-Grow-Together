const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join('public', 'blog-images');
const tempDir = path.join('public', 'blog-images-temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));

async function compress() {
  let done = 0;
  for (const file of files) {
    const inputPath = path.join(dir, file);
    const tempPath = path.join(tempDir, file);
    try {
      const meta = await sharp(inputPath).metadata();
      const aspect = meta.width / meta.height;
      let width = 800;
      let height = Math.round(width / aspect);
      if (height < 400) {
        height = 400;
        width = Math.round(height * aspect);
      }
      await sharp(inputPath)
        .resize(width, height, { fit: 'cover' })
        .jpeg({ quality: 80, progressive: true, mozjpeg: true })
        .toFile(tempPath);
      const stats = fs.statSync(tempPath);
      if (stats.size > 1000) {
        fs.rmSync(inputPath, { force: true });
        fs.renameSync(tempPath, inputPath);
        done++;
        console.log('compressed ' + file + ' (' + stats.size + ' bytes)');
      } else {
        console.log('skipped ' + file + ' (too small)');
      }
    } catch (e) {
      console.error('failed ' + file + ': ' + e.message);
    }
  }
  console.log('done ' + done + '/' + files.length);
}

compress();
