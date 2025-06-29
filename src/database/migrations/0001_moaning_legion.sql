CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`status` text DEFAULT 'subscribed',
	`unsubscribe_reason` text
);
