CREATE TABLE `generated_materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`type` enum('presentation','ebook') NOT NULL,
	`title` text NOT NULL,
	`theme` text NOT NULL,
	`tone` varchar(50) NOT NULL,
	`audience` text,
	`slide_count` int,
	`chapter_count` int,
	`content` text NOT NULL,
	`slides_version_id` text,
	`pdf_url` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `generated_materials_id` PRIMARY KEY(`id`)
);
