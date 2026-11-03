-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `audience` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `reportedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `subscriptions` ADD COLUMN `accessEnc` TEXT NULL,
    ADD COLUMN `activatedAt` DATETIME(3) NULL,
    ADD COLUMN `connectionLimit` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `expiryNotifiedAt` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `notifications_userId_audience_readAt_idx` ON `notifications`(`userId`, `audience`, `readAt`);

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
