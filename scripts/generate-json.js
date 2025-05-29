import fs from 'fs';
import path from 'path';

const fullDir = 'public/wallpapers/full';
const thumbDir = 'wallpapers/thumbs'; // Inside public

function generateTitleAndTags(filename) {
    const name = path.basename(filename, path.extname(filename));
    const nameWithSpaces = name.replace(/[-]/g, ' ');
    const words = nameWithSpaces.split(/[_]/);
    const title = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    const tags = [...new Set(words.map((w) => w.toLowerCase()))];
    return { title, tags };
}

const wallpapers = fs
    .readdirSync(fullDir)
    .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .map((file) => {
        const { title, tags } = generateTitleAndTags(file);
        return {
            title,
            tags,
            image: path.join(fullDir.slice(7), file),
            thumbnail: path.join(
                thumbDir,
                file.replace(/\.(\w+)$/, '-thumb.$1'),
            ),
        };
    });

fs.writeFileSync(
    'src/data/wallpapers.json',
    JSON.stringify(wallpapers, null, 2),
);
