import express from 'express';
import chokidar from 'chokidar';
import matter from 'gray-matter';
import * as fs from 'fs';
import { db } from '#/database';
import 'dotenv/config';
import { posts, type PostIndex } from '#/schema/post';
import { and, countDistinct, desc, eq, sql } from 'drizzle-orm';
import { SqliteError } from 'better-sqlite3';
import cors from 'cors';
import removeMd from 'remove-markdown';
import type { Request } from 'express';

type Metadata = {
  title: string;
  slug: string;
  available: boolean;
};

type Sortable = 'date';
type SortOrder = 'asc' | 'desc';
type Sort = `${Sortable}:${SortOrder}`;

type PostCache = Record<string, [string, string]>;

const postCache: PostCache = {};

interface PostRequestQuery {
  count?: boolean;
  order?: Sort;
  page?: number;
  size?: number;
}

const watch = chokidar.watch(process.env.WATCH_DIR!);
watch.on('ready', () => {
  console.log('Ready to watch!');
});
watch.on('add', (path) => {
  fs.readFile(path, 'utf-8', async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Found file at ${path}, trying to add to database...`);
    const { content, data: meta } = matter(data);
    const { slug, title } = meta as Metadata;
    try {
      await db.insert(posts).values({
        slug,
        title,
        content_path: path,
      });
      console.log(`File at ${path} added successfully.`);
    } catch (err: unknown) {
      if (err instanceof SqliteError) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          console.log('File already present. No need to add.');
        }
      }
    }
    if (!postCache[path]) {
      postCache[path] = [content, removeMd(content)];
    }
  });
});
watch.on('change', (path) => {
  fs.readFile(path, 'utf-8', async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Detected change at ${path}, checking if anything changed...`);
    const post = db
      .select()
      .from(posts)
      .where(eq(posts.content_path, path))
      .get();

    const { content, data: meta } = matter(data);
    const { slug, title, available } = meta as Metadata;
    const [priorContent] = postCache[path];

    if (!post) {
      if (slug && title) {
        console.log('Found valid metadata on post, adding to database...');
        db.insert(posts)
          .values({
            slug,
            title,
            content_path: path,
          })
          .execute();
        console.log(`Post at ${path} added successfully.`);
        postCache[path] = [content, removeMd(content)];
      } else {
        console.log('Post does not contain valid metadata, skipping.');
      }
    } else {
      if (
        post.slug !== slug ||
        post.title !== title ||
        post.posted !== available
      ) {
        console.log('Metadata on post has changed, updating in database...');
        db.update(posts)
          .set({ slug, title, posted: available })
          .where(eq(posts.id, post.id))
          .execute();
        console.log(`Post at ${path} updated successfully.`);
      } else if (priorContent !== content) {
        console.log('Content in post has changed, updating post cache...');
        postCache[path] = [content, removeMd(content)];
        console.log(`Post cache updated successfully.`);
      } else {
        console.log(
          'Nothing in metadata or content changed. No need to update.'
        );
      }
    }
  });
});
watch.on('unlink', (path) => {
  console.log(
    `Post at ${path} has been deleted. Taking down post from the site...`
  );
  db.update(posts)
    .set({ posted: false })
    .where(eq(posts.content_path, path))
    .execute();
  console.log(`Post at ${path} taken down successfully.`);
});

const corsMiddleware = cors({
  origin: [
    'http://localhost:8050',
    'http://localhost:5173',
    process.env.FRONTEND_URL!,
  ],
});

const app = express();
app.use(corsMiddleware);
app.get('/', (_, res) => {
  res.send('Healthy!');
});
app.get(
  '/posts',
  async (req: Request<unknown, unknown, unknown, PostRequestQuery>, res) => {
    let field: Sortable | undefined;
    let sortOrder: SortOrder | undefined;
    const { count, order, page, size } = req.query;
    if (order) {
      const s = order.split(':');
      field = s[0] as Sortable;
      sortOrder = s[1] as SortOrder;
    }
    if (count) {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(posts)
        .where(eq(posts.posted, true))
        .execute();
      res.json(count);
      return;
    }
    let query = db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        posted_date: posts.posted_date,
      })
      .from(posts)
      .where(eq(posts.posted, true))
      .$dynamic();
    if (field && sortOrder) {
      query = query.orderBy(
        sortOrder === 'desc' ? desc(posts.posted_date) : posts.posted_date
      );
    }
    if (page && size) {
      query = query.offset(size * (page - 1)).limit(size);
    }
    const list = await query.execute();
    res.json(
      list.map((post) => {
        const { id, title, slug, posted_date } = post;
        return {
          id,
          title,
          slug,
          posted_date,
        };
      })
    );
  }
);
app.get('/posts/index.json', async (_, res) => {
  const list = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      posted_date: posts.posted_date,
      content_path: posts.content_path,
    })
    .from(posts)
    .where(eq(posts.posted, true))
    .execute();
  res.contentType('json').json(
    list.map((post) => {
      const { id, title, slug, posted_date, content_path } = post;
      return {
        id,
        title,
        slug,
        posted_date,
        content: postCache[content_path][1].trim(),
      };
    })
  );
});
app.get('/posts/:slug', async (req, res) => {
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.posted, true), eq(posts.slug, req.params.slug)))
    .execute();
  if (!post) {
    res.status(404);
  } else {
    const { id, title, slug, posted_date, content_path } = post;
    res.json({
      id,
      title,
      slug,
      posted_date,
      content: postCache[content_path][0].trim(),
    });
  }
});

app.listen(8080, () => {
  console.log('Listening on Port 8080...');
});
