CREATE TABLE `recurring_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`creationId` int NOT NULL,
	`frequency` enum('daily','weekly','monthly') NOT NULL,
	`dayOfWeek` int,
	`dayOfMonth` int,
	`time` varchar(5) NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`title` varchar(255) NOT NULL,
	`lastExecutedAt` timestamp,
	`nextExecutionAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recurring_posts_id` PRIMARY KEY(`id`)
);
