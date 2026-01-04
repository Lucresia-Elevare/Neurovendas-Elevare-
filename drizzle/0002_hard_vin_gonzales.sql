ALTER TABLE `creations` ADD `templateId` varchar(64);--> statement-breakpoint
ALTER TABLE `creations` ADD `version` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `creations` ADD `parentId` int;