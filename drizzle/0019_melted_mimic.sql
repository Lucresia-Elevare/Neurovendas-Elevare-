CREATE TABLE `canva_designs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`canva_design_id` text NOT NULL,
	`type` enum('carousel','video') NOT NULL,
	`title` text NOT NULL,
	`theme` text NOT NULL,
	`tone` varchar(50) NOT NULL,
	`slide_count` int,
	`duration` int,
	`thumbnail_url` text,
	`edit_url` text,
	`export_url` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `canva_designs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `canva_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`access_token` text NOT NULL,
	`refresh_token` text,
	`expires_at` timestamp NOT NULL,
	`scope` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `canva_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `canva_tokens_user_id_unique` UNIQUE(`user_id`)
);
