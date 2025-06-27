CREATE TABLE `posts` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`posted` integer DEFAULT true NOT NULL,
	`posted_date` integer NOT NULL,
	`content_path` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_content_path_unique` ON `posts` (`content_path`);--> statement-breakpoint
CREATE INDEX `posts_slug_posted_idx` ON `posts` (`slug`,`posted`);