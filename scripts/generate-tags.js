import fs from 'fs';
import path from 'path';

const fullDir = path.join('public', 'wallpapers', 'full') + path.sep;

if (!fs.existsSync(fullDir)) {
    console.error(`Directory ${fullDir} does not exist.`);
    process.exit(1);
}

function generateTags(filename) {
    const name = path
        .relative(fullDir, filename)
        .replace(/[//\/]/g, '_')
        .replace(/\.(\w+)$/, '');
    const nameWithSpaces = name.replace(/[-]/g, ' ');
    const words = nameWithSpaces.split(/[_]/);
    const tags = [...new Set(words.map((w) => w.toLowerCase()))];
    return tags;
}

let wallpapersRaw = [];

function readDirRecursive(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            readDirRecursive(fullPath + path.sep);
        } else {
            wallpapersRaw.push(dir + file);
        }
    });
}

readDirRecursive(fullDir);

let tags = wallpapersRaw
    .map((file) => {
        const tag = generateTags(file);
        return tag;
    })
    .reduce((acc, tag) => {
        tag.forEach((t) => acc.add(t));
        return acc;
    }, new Set());

fs.writeFileSync(
    path.join('src', 'data', 'tags.json'),
    JSON.stringify(Array.from(tags), null, 4),
);
