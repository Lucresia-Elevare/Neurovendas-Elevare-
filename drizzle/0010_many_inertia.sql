CREATE TABLE `instagram_connections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`instagramUserId` varchar(128) NOT NULL,
	`instagramUsername` varchar(128),
	`accessToken` text NOT NULL,
	`tokenExpiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `instagram_connections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `instagram_publications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`creationId` int NOT NULL,
	`instagramPostId` varchar(128),
	`status` enum('pending','published','failed') NOT NULL DEFAULT 'pending',
	`scheduledFor` timestamp,
	`publishedAt` timestamp,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `instagram_publications_id` PRIMARY KEY(`id`)
);
