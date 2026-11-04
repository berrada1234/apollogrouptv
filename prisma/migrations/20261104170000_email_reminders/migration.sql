-- AlterTable
ALTER TABLE `users` ADD COLUMN `remindersOptOut` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `email_reminders` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `kind` VARCHAR(40) NOT NULL,
    `sentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `email_reminders_sentAt_idx`(`sentAt`),
    UNIQUE INDEX `email_reminders_userId_kind_key`(`userId`, `kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `email_reminders` ADD CONSTRAINT `email_reminders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

