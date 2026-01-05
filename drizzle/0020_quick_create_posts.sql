-- Create quickCreatePosts table for storing posts created via QuickCreate flow
CREATE TABLE `quick_create_posts` (
  `id` int AUTO_INCREMENT NOT NULL,
  `userId` int NOT NULL,
  `presetId` varchar(64) NOT NULL,
  `caption` text NOT NULL,
  `hashtags` text,
  `imageUrls` text NOT NULL COMMENT 'JSON array of image URLs',
  `imageKeys` text NOT NULL COMMENT 'JSON array of S3 keys',
  `engagementScore` int,
  `scoreBreakdown` text COMMENT 'JSON with breakdown by factors',
  `status` enum('draft', 'scheduled', 'published', 'failed') NOT NULL DEFAULT 'draft',
  `scheduledFor` timestamp NULL,
  `publishedAt` timestamp NULL,
  `instagramPostId` varchar(128),
  `sessionId` varchar(64),
  `creationTimeMs` int COMMENT 'Time taken to create in milliseconds',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_userId_status` (`userId`, `status`),
  KEY `idx_scheduledFor` (`scheduledFor`),
  KEY `idx_sessionId` (`sessionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
