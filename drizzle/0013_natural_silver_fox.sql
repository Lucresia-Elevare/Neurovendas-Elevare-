CREATE TABLE `auto_repost_rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`minEngagement` int NOT NULL,
	`intervalDays` int NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`lastExecutedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `auto_repost_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`duration` int NOT NULL,
	`startDate` timestamp NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`creationIds` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `post_campaigns_id` PRIMARY KEY(`id`)
);
