// scripts/generate-thumbnails.js
import fs from 'fs';
import sharp from 'sharp';
import path from 'path';

const inputDir = 'public/wallpapers/full';
const outputDir = 'public/wallpapers/thumbs';

fs.mkdirSync(outputDir, { recursive: true });

fs.readdirSync(inputDir).forEach((file) => {
    sharp(`${inputDir}/${file}`)
        .resize(300)
        .toFile(`${outputDir}/${file.replace(/\.(\w+)$/, '-thumb.$1')}`);
});
