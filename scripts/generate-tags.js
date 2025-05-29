import fs from 'fs';
import path from 'path';

const fullDir = 'public/wallpapers/full';

function generateTags(filename) {
    const name = path.basename(filename, path.extname(filename));
    const nameWithSpaces = name.replace(/[-]/g, ' ');
    const words = nameWithSpaces.split(/[_]/);
    const tag = [...new Set(words.map((w) => w.toLowerCase()))];
    return { tag };
}

const tags = fs
    .readdirSync(fullDir)
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map((file) => {
        const { tag } = generateTags(file);
        return tag;
    })
    .reduce((acc, tag) => {
        tag.forEach((t) => acc.add(t));
        return acc;
    }, new Set());

fs.writeFileSync(
    'src/data/tags.json',
    JSON.stringify(Array.from(tags), null, 4),
);
