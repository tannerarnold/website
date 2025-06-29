import type { PostIndex, PostWithContent } from '#/schema/post';

const baseUrl = process.env.SERVER_URL;

const fetchPosts = async (options?: {
  count?: boolean;
  order?: 'title:asc' | 'title:desc' | 'date:asc' | 'date:desc';
  page?: number;
  size?: number;
}): Promise<PostIndex[]> => {
  let params: Record<string, string> = {};
  if (options) {
    for (const key of Object.keys(options) as (keyof typeof options)[]) {
      if (options[key]) params[key as string] = options[key].toString();
    }
  }
  const urlParams = new URLSearchParams(params);
  const response = await fetch(
    `${baseUrl}/posts${urlParams.size > 0 ? `?${urlParams.toString()}` : ''}`
  );
  if (!response.ok) {
    console.error('Failed to fetch posts!', response.status);
    return [];
  }
  return (await response.json()) as PostIndex[];
};

const fetchPostsSearchIndex = async (): Promise<PostWithContent[]> => {
  const response = await fetch(`${baseUrl}/posts/index.json`);
  if (!response.ok) {
    console.error('Failed to fetch posts index!', response.status);
    return [];
  }
  return (await response.json()) as PostWithContent[];
};

const fetchPostBySlug = async (
  slug: string
): Promise<PostWithContent | undefined> => {
  const response = await fetch(`${baseUrl}/posts/${slug}`);
  if (!response.ok) {
    console.error('Failed to fetch post!', response.status);
    return undefined;
  }
  return (await response.json()) as PostWithContent;
};

const subscribe = async (email: string): Promise<void> => {
  await fetch(`${baseUrl}/notifications/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
};

const unsubscribe = async (email: string, reason: string): Promise<boolean> => {
  const response = await fetch(`${baseUrl}/notifications/unsubscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, unsubscribe_reason: reason }),
  });
  return response.ok;
};

export {
  fetchPostBySlug,
  fetchPosts,
  fetchPostsSearchIndex,
  subscribe,
  unsubscribe,
};
