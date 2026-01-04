ALTER TABLE `creations` ADD `parentVersionId` int;--> statement-breakpoint
ALTER TABLE `creations` ADD `versionNumber` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `creations` DROP COLUMN `parentId`;