import fs from 'fs';
import path from 'path';

const fullDir = path.join('public', 'wallpapers', 'full') + path.sep;
const thumbDir = path.join('wallpapers', 'thumbs');

if (!fs.existsSync(fullDir)) {
    console.error(`Directory ${fullDir} does not exist.`);
    process.exit(1);
}

function generateJSON(filename) {
    const name = path.relative(fullDir, filename).replace(/[//\/]/g, '_').replace(/\.(\w+)$/, '');
    const nameWithSpaces = name.replace(/[-]/g, ' ');
    const words = nameWithSpaces.split(/[_]/);
    const title = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    const tags = [...new Set(words.map((w) => w.toLowerCase()))];
    return { title, tags };
}

let wallpapersRaw = [];

function readDirRecursive(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            readDirRecursive(fullPath + path.sep);
        }
        else {
            wallpapersRaw.push(dir + file);
        }
    });
}

readDirRecursive(fullDir);

let wallpapers = wallpapersRaw
    .map((file) => {
        const { title, tags } = generateJSON(file);
        return {
            title,
            tags,
            image: path.relative("public", file),
            thumbnail: path.join(
                thumbDir,
                path.relative(fullDir, file).replace(/[\\\/]/g, '_').replace(/\.(\w+)$/, '-thumb.webp'),
            ),
        };
    });

fs.writeFileSync(
    path.join('src', 'data', 'wallpapers.json'),
    JSON.stringify(wallpapers, null, 4),
);
