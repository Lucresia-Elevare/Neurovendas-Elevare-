CREATE TABLE `cta_library` (
	`id` int AUTO_INCREMENT NOT NULL,
	`text` text NOT NULL,
	`category` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cta_library_id` PRIMARY KEY(`id`)
);
