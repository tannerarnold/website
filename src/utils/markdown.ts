import { marked } from 'marked';

const marker = marked.use();

function markdownToHtml(content: string): string {
  return marker.parse(content) as string;
}

export { markdownToHtml };
