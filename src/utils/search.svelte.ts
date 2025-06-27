import type { PostIndex, PostWithContent } from '#/schema/post';
import FlexSearch, { Index } from 'flexsearch';
import { fetchPostsSearchIndex } from './api';

let allPosts = $state<PostWithContent[]>([]);
let index = $state<Index | undefined>(undefined);
let indexReady = $state<boolean>(false);

const createPostIndex = (items: PostWithContent[]): Index => {
  let index = new FlexSearch.Index({
    tokenize: 'forward',
  });
  items.forEach((post, i) =>
    index.add(i, `${post.title.toLowerCase()} ${post.content.toLowerCase()}`)
  );
  return index;
};

const searchIndex = (
  term: string
): Array<Pick<PostIndex, 'title' | 'slug'> & { matchedText: string }> => {
  if (!index) return [];
  const results = index.search(term);
  return results.map((value) => {
    const matchedValue = allPosts[value as number];
    const { title, content, slug } = matchedValue;
    const formattedText = content.replace(/\n+/g, ' ').trim();
    const textIndex = formattedText.toLowerCase().indexOf(term.toLowerCase());
    const titleIndex = title.toLowerCase().indexOf(term.toLowerCase());
    const textRegex = new RegExp(
      formattedText.slice(textIndex, textIndex + term.length)
    );
    const titleRegex = new RegExp(
      title.slice(titleIndex, titleIndex + term.length)
    );
    let splicedAndHighlightedTitleMatch =
      titleIndex > -1
        ? title
            .slice(
              Math.max(0, titleIndex - 15),
              Math.min(title.length, titleIndex + term.length + 15)
            )
            .replace(
              titleRegex,
              (match) => `<span class='highlight'>${match}</span>`
            )
        : title;
    let splicedAndHighlightedTextMatch =
      textIndex > -1
        ? content
            .slice(
              Math.max(0, textIndex - 30),
              Math.min(formattedText.length, textIndex + term.length + 30)
            )
            .replace(
              textRegex,
              (match) => `<span class='highlight'>${match}</span>`
            )
        : content.substring(0, 60);
    if (titleIndex - 15 > 0)
      splicedAndHighlightedTitleMatch =
        '&hellip;' + splicedAndHighlightedTitleMatch;
    if (titleIndex + term.length + 15 < title.length)
      splicedAndHighlightedTitleMatch =
        splicedAndHighlightedTitleMatch + '&hellip;';
    if (textIndex - 30 > 0)
      splicedAndHighlightedTextMatch =
        '&hellip;' + splicedAndHighlightedTextMatch;
    if (textIndex + term.length + 30 < formattedText.length)
      splicedAndHighlightedTextMatch =
        splicedAndHighlightedTextMatch + '&hellip;';
    return {
      title: splicedAndHighlightedTitleMatch,
      slug,
      matchedText: splicedAndHighlightedTextMatch,
    };
  });
};

fetchPostsSearchIndex().then((list) => {
  allPosts = list;
  index = createPostIndex(list);
  indexReady = true;
});

const isIndexReady = () => indexReady;
const postIndex = () => allPosts;

export { createPostIndex, searchIndex, isIndexReady, postIndex };
