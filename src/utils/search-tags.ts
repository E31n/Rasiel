// thanks @joyofcodedev for this :)
import FlexSearch from 'flexsearch';

// export type SearchContent = {
//     title: string;
//     tags: string[];
//     image: string;
//     thumbnail: string;
// };

import type { Index } from 'flexsearch';

let contentIndex: Index;
let content: string[] = [];

export function createContentIndex(data: string[]) {
    contentIndex = new FlexSearch.Index({
        encode: (text: string) => text.toLowerCase().split(''),
        preset: 'match',
        resolution: 3,
        tokenize: 'forward',
    });

    data.forEach((item, i) => {
        contentIndex.add(
            i,
            item,
            // `${item.title} ${item.tags.map((tag) => tag).join(' ')}`,
        );
    });

    content = data;
}

export function searchContentIndex(query: string) {
    const match = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const results = contentIndex.search(match);

    return results.map((idx: any) => content[idx as number]);
}
