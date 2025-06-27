import { text, integer, sqliteTable, index } from 'drizzle-orm/sqlite-core';

const posts = sqliteTable(
  'posts',
  {
    id: integer().primaryKey(),
    slug: text().notNull(),
    title: text().notNull(),
    posted: integer({ mode: 'boolean' }).notNull().default(true),
    posted_date: integer({ mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    content_path: text().notNull().unique(),
  },
  (table) => [index('posts_slug_posted_idx').on(table.slug, table.posted)]
);

type Post = typeof posts.$inferSelect;
type PostIndex = Pick<Post, 'id' | 'slug' | 'title' | 'posted_date'>;
type PostWithContent = PostIndex & { content: string };

export { posts };
export type { PostIndex, PostWithContent };
