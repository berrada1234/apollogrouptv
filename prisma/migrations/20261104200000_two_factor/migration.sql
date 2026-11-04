-- AlterTable
ALTER TABLE `users` ADD COLUMN `twoFactorEnabled` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `two_factors` (
    `id` VARCHAR(191) NOT NULL,
    `secret` TEXT NOT NULL,
    `backupCodes` TEXT NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `verified` BOOLEAN NOT NULL DEFAULT true,
    `failedVerificationCount` INTEGER NOT NULL DEFAULT 0,
    `lockedUntil` DATETIME(3) NULL,

    INDEX `two_factors_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `two_factors` ADD CONSTRAINT `two_factors_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

