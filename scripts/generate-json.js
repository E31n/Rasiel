import fs from 'fs';
import path from 'path';

const fullDir = path.join('public', 'wallpapers', 'full') + path.sep;
const thumbDir = path.join('wallpapers', 'thumbs');

if (!fs.existsSync(fullDir)) {
    console.error(`Directory ${fullDir} does not exist.`);
    process.exit(1);
}

function generateJSON(filename) {
    let stats = fs.statSync(filename);
    stats = stats.size;
    let identifier = 0;
    while (stats >= 1024 && identifier <= 3) {
        stats /= 1024;
        identifier++;
    }
    const size = stats.toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB'][identifier];
    const name = path
        .relative(fullDir, filename)
        .replace(/[//\/]/g, '_')
        .replace(/\.(\w+)$/, '');
    const nameWithSpaces = name.replace(/[-]/g, ' ');
    const words = nameWithSpaces.split(/[_]/);
    const tags = [...new Set(words.map((w) => w.toLowerCase()))];
    return { tags, size };
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

let wallpapers = wallpapersRaw.map((file) => {
    const { tags, size } = generateJSON(file);
    const thumbnail = path.join(
        thumbDir,
        path
            .relative(fullDir, file)
            .replace(/[\\\/]/g, '_')
            .replace(/\.(\w+)$/, '-thumb.webp'),
    );
    const title =
        thumbnail.slice(thumbnail.lastIndexOf('/') + 1).slice(0, -11) +
        file.slice(file.lastIndexOf('.'));
    return {
        title,
        tags,
        size,
        image: path.relative('public', file),
        thumbnail: thumbnail,
    };
});

fs.writeFileSync(
    path.join('src', 'data', 'wallpapers.json'),
    JSON.stringify(wallpapers, null, 4),
);
