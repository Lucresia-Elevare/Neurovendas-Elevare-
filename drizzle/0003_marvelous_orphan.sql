CREATE TABLE `scheduled_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`creationId` int NOT NULL,
	`scheduledFor` timestamp NOT NULL,
	`status` enum('pending','published','failed','cancelled') NOT NULL DEFAULT 'pending',
	`caption` text,
	`hashtags` text,
	`publishedAt` timestamp,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scheduled_posts_id` PRIMARY KEY(`id`)
);
