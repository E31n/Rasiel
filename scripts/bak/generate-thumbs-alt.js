import fg from "fast-glob";
import sharp from "sharp";
import fs from "fs";

const inputDir = "public/wallpapers/full";
const outputDir = "public/wallpapers/thumbs";

fs.mkdirSync(outputDir, { recursive: true });

if (!fs.existsSync(inputDir)) {
    console.error(`Input directory "${inputDir}" does not exist.`);
    process.exit(1);
}

const files = await fg(`${inputDir}/**/*.*`);
files.forEach((file) => {
    sharp(file)
        .resize(300)
        .toFile(`${outputDir}/${file.slice(inputDir.length + 1).replace(/[\/\\]/g, '_').replace(/\.(\w+)$/, '-thumb.$1')}`);
});
