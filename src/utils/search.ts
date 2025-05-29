// thanks @joyofcodedev for this :)
import FlexSearch from 'flexsearch';

export type SearchContent = {
    title: string;
    tags: string[];
    image: string;
    thumbnail: string;
};

import type { Index } from 'flexsearch';

let contentIndex: Index;
let content: SearchContent[] = [];

export function createContentIndex(data: SearchContent[]) {
    contentIndex = new FlexSearch.Index({
        tokenize: 'forward',
    });

    data.forEach((item, i) => {
        contentIndex.add(
            i,
            `${item.title} ${item.tags.map((tag) => tag).join(' ')}`,
        );
    });

    content = data;
}

export function searchContentIndex(query: string) {
    const match = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const results = contentIndex.search(match);

    return results.map((idx: any) => content[idx as number]);
}
