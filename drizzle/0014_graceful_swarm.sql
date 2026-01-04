CREATE TABLE `competitors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`username` text NOT NULL,
	`display_name` text,
	`followers` int,
	`avg_engagement` real,
	`posts_per_week` real,
	`last_updated` timestamp DEFAULT (now()),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `competitors_id` PRIMARY KEY(`id`)
);
