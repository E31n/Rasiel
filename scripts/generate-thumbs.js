import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.join('public', 'wallpapers', 'full');
const outputDir = path.join('public', 'wallpapers', 'thumbs');
const dataDir = path.join('src', 'data');

// Create output directory if it doesn't exist
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

if (!fs.existsSync(inputDir)) {
    console.error(`Input directory "${inputDir}" does not exist.`);
    process.exit(1);
}

// Recursively get all file paths
function getAllFiles(dir, fileList = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            getAllFiles(fullPath, fileList);
        } else {
            fileList.push(fullPath);
        }
    }

    return fileList;
}

// Process images
const files = getAllFiles(inputDir);
files.forEach((file) => {
    const relativePath = path.relative(inputDir, file);
    const outputName = relativePath
    	.replace(/[\r\n\t]+/g, '')
        .replace(/[\/\\]/g, '_')
        .replace(/\.(\w+)$/, '-thumb.webp');
    const outputPath = path.join(outputDir, outputName);

    sharp(file)
        .resize(400)
        .toFormat('webp')
        .toFile(outputPath)
        .catch((err) => console.error(`Error processing ${file}:`, err));
});
