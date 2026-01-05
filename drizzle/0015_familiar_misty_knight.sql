CREATE TABLE `hashtag_suggestions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`creation_id` int,
	`text` text NOT NULL,
	`hashtags` text NOT NULL,
	`category` enum('reach','niche','trending'),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `hashtag_suggestions_id` PRIMARY KEY(`id`)
);
