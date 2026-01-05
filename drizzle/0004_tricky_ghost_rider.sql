CREATE TABLE `graphic_elements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('sticker','icon','frame','product','seal','decorative') NOT NULL,
	`subcategory` varchar(100),
	`imageUrl` text NOT NULL,
	`thumbnailUrl` text,
	`tags` text,
	`isPremium` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `graphic_elements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `post_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`creationId` int NOT NULL,
	`likes` int DEFAULT 0,
	`comments` int DEFAULT 0,
	`shares` int DEFAULT 0,
	`saves` int DEFAULT 0,
	`reach` int DEFAULT 0,
	`impressions` int DEFAULT 0,
	`publishedAt` timestamp NOT NULL,
	`dayOfWeek` int NOT NULL,
	`hourOfDay` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `post_analytics_id` PRIMARY KEY(`id`)
);
