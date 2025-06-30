import '@/sentry';
import express from 'express';
import chokidar from 'chokidar';
import matter from 'gray-matter';
import * as fs from 'fs';
import { db } from '#/database';
import 'dotenv/config';
import { posts } from '#/schema/post';
import { and, desc, eq, sql } from 'drizzle-orm';
import { SqliteError } from 'better-sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import removeMd from 'remove-markdown';
import nodemailer from 'nodemailer';
import type { Request } from 'express';
import { subscriptions } from '#/schema/subscription';
import * as Sentry from '@sentry/node';

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

interface UnsubscribeRequestBody {
  email: string;
  unsubscribe_reason?: string;
}

const mail = nodemailer.createTransport({
  pool: true,
  host: process.env.MAIL_SERVER,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});
mail.verify((err) => {
  if (err) console.log(err);
  else console.log('Successfully authed to email server.');
});

const newSubscriptionText = (email: string): string => {
  return `Thanks for subscribing!\n\nYour email (${email}) has subscribed to receive updates when posts on tanner.arnoldtech.dev are posted.\n\nIf you did not intend to subscribe, or this was done without your permission, no worries, you can unsubscribe anytime by going here: ${process
    .env.FRONTEND_URL!}/#/notifications/unsubscribe`;
};

const newSubscriptionHtml = (email: string): string => {
  return `<h1>Thanks for subscribing!</h1>
    <p>Your email (${email}) has subscribed to receive updates when posts on tanner.arnoldtech.dev are posted.</p>
    <p>If you did not intend to subscribe, or this was done without your permission, no worries, you can unsubscribe anytime by going here: ${process
      .env.FRONTEND_URL!}/#/notifications/unsubscribe`;
};

const newPostText = (title: string, slug: string): string => {
  return `Tanner has made a new post titled '${title}'!\n\nYou can view it at the following link: ${process
    .env
    .FRONTEND_URL!}/#/posts/${slug}.\n\nWhy am I receiving this email?\n\nYou are receiving this email because you subscribed to receive notifications when Tanner Arnold makes a post on his blog.\n\nTo unsubscribe, visit the following url: ${process
    .env.FRONTEND_URL!}/#/notifications/unsubscribe`;
};

const newPostHtml = (title: string, slug: string): string => {
  return `<h1>Tanner has made a new post titled '${title}'!</h1>
    <p>You can view it at the following link: <a href="${process.env
      .FRONTEND_URL!}/#/posts/${slug}">${process.env
    .FRONTEND_URL!}/#/posts/${slug}</a></p>
    <h3>Why am I receiving this email?</h3>
    <p>You are receiving this email because you subscribed to receive notifications when Tanner Arnold makes a post on his blog.</p>
    <p>To unsubscribe, visit the following url: <a href="${process.env
      .FRONTEND_URL!}/#/notifications/unsubscribe">${process.env
    .FRONTEND_URL!}/#/notifications/unsubscribe</a></p>`;
};

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
    let alreadyFound = false;
    try {
      await db
        .insert(posts)
        .values({
          slug,
          title,
          content_path: path,
        })
        .execute();
      console.log(`File at ${path} added successfully.`);
    } catch (err: unknown) {
      if (err instanceof SqliteError) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          alreadyFound = true;
          console.log('File already present. No need to add.');
        }
      }
    }
    if (!alreadyFound) {
      console.log('This is a new post. Sending email...');
      const recipients = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.status, 'subscribed'))
        .execute();
      if (recipients.length > 0)
        await mail.sendMail({
          from: process.env.MAIL_USER,
          bcc: recipients.map((recipient) => recipient.email),
          subject: `New Blog Post from Tanner - ${title}`,
          headers: {
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            'List-Unsubscribe': `<${process.env
              .FRONTEND_URL!}/#/notifications/unsubscribe> (Unsubscribe)`,
          },
          text: newPostText(title, slug),
          html: newPostHtml(title, slug),
        });
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

Sentry.setupExpressErrorHandler(app);
app.use(corsMiddleware);
app.use(bodyParser.json());

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
app.post(
  '/notifications/subscribe',
  async (req: Request<unknown, unknown, { email: string }, unknown>, res) => {
    const { email } = req.body;
    console.log(email);
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.email, email))
      .execute();
    if (!subscription)
      await db.insert(subscriptions).values({ email }).execute();
    else
      await db
        .update(subscriptions)
        .set({ status: 'subscribed', unsubscribe_reason: undefined })
        .where(eq(subscriptions.email, email))
        .execute();
    await mail.sendMail({
      from: process.env.MAIL_USER!,
      to: email,
      subject: 'Thanks for subscribing to tanner.arnoldtech.dev!',
      headers: {
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'List-Unsubscribe': `<${process.env
          .SERVER_URL!}/#/notifications/unsubscribe> (Unsubscribe)`,
      },
      text: newSubscriptionText(email),
      html: newSubscriptionHtml(email),
    });
    res.status(200).send();
  }
);
app.post(
  '/notifications/unsubscribe',
  async (
    req: Request<unknown, unknown, UnsubscribeRequestBody, unknown>,
    res
  ) => {
    const { email, unsubscribe_reason } = req.body;
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.email, email))
      .execute();
    if (!subscription) {
      res.status(404).send();
      return;
    }
    await db
      .update(subscriptions)
      .set({ status: 'unsubscribed', unsubscribe_reason })
      .where(eq(subscriptions.email, email))
      .execute();
    res.status(200).send();
  }
);

app.listen(8080, () => {
  console.log('Listening on Port 8080...');
});
