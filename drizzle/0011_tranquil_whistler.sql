CREATE TABLE `user_favorite_palettes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`paletteId` varchar(100) NOT NULL,
	`paletteName` varchar(255) NOT NULL,
	`colors` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_favorite_palettes_id` PRIMARY KEY(`id`)
);
