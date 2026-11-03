-- AlterTable
ALTER TABLE `orders` ADD COLUMN `customerReference` VARCHAR(255) NULL,
    ADD COLUMN `expiresAt` DATETIME(3) NULL,
    ADD COLUMN `methodId` VARCHAR(191) NULL,
    ADD COLUMN `note` TEXT NULL,
    ADD COLUMN `number` VARCHAR(20) NULL,
    ADD COLUMN `paidAt` DATETIME(3) NULL,
    ADD COLUMN `subscriptionId` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDING', 'PENDING_CONFIRMATION', 'PAID', 'UNDERPAID', 'EXPIRED', 'FAILED', 'CANCELED') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `payment_methods` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(80) NOT NULL,
    `subtitle` VARCHAR(80) NOT NULL,
    `country` VARCHAR(80) NULL,
    `description` VARCHAR(240) NULL,
    `kind` ENUM('BITCOIN', 'MANUAL') NOT NULL,
    `logoUrl` VARCHAR(512) NULL,
    `glyph` VARCHAR(4) NULL,
    `accent` VARCHAR(7) NULL,
    `account` VARCHAR(255) NULL,
    `instructions` TEXT NULL,
    `paymentUrl` VARCHAR(512) NULL,
    `network` VARCHAR(80) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `payment_methods_isActive_sortOrder_idx`(`isActive`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_requests` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `methodId` VARCHAR(191) NULL,
    `kind` ENUM('BITCOIN', 'MANUAL') NOT NULL,
    `status` ENUM('AWAITING', 'DETECTED', 'CONFIRMED', 'UNDERPAID', 'REPORTED', 'EXPIRED', 'SUPERSEDED') NOT NULL DEFAULT 'AWAITING',
    `usdCents` INTEGER NOT NULL,
    `rateUsd` DECIMAL(14, 2) NULL,
    `priceSource` VARCHAR(20) NULL,
    `amountSats` INTEGER NULL,
    `address` VARCHAR(120) NULL,
    `network` VARCHAR(20) NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `txid` VARCHAR(80) NULL,
    `receivedSats` INTEGER NULL,
    `confirmations` INTEGER NOT NULL DEFAULT 0,
    `lastCheckedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `payment_requests_txid_key`(`txid`),
    INDEX `payment_requests_orderId_idx`(`orderId`),
    INDEX `payment_requests_address_status_idx`(`address`, `status`),
    INDEX `payment_requests_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sandbox_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(120) NOT NULL,
    `txid` VARCHAR(80) NOT NULL,
    `valueSats` INTEGER NOT NULL,
    `confirmations` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `sandbox_transactions_txid_key`(`txid`),
    INDEX `sandbox_transactions_address_idx`(`address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `orders_number_key` ON `orders`(`number`);

-- CreateIndex
CREATE UNIQUE INDEX `orders_subscriptionId_key` ON `orders`(`subscriptionId`);

-- CreateIndex
CREATE INDEX `orders_userId_status_idx` ON `orders`(`userId`, `status`);

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_methodId_fkey` FOREIGN KEY (`methodId`) REFERENCES `payment_methods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_requests` ADD CONSTRAINT `payment_requests_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_requests` ADD CONSTRAINT `payment_requests_methodId_fkey` FOREIGN KEY (`methodId`) REFERENCES `payment_methods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Default payment methods. Manual ones have no account yet, so they stay hidden from customers until an admin adds payment details.
INSERT INTO `payment_methods` (`id`, `name`, `subtitle`, `country`, `description`, `kind`, `glyph`, `accent`, `network`, `instructions`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES
  ('pm_bitcoin', 'Bitcoin Wallet', 'Any wallet', NULL, 'Send BTC from any wallet or exchange. Confirmed automatically on the blockchain.', 'BITCOIN', '₿', '#F7931A', 'Bitcoin Network', 'Send the exact BTC amount shown to the wallet address, in one transaction, before the quote expires. Network fees are paid by the sender.', true, 1, NOW(3), NOW(3)),
  ('pm_cashapp', 'Cash App', 'USA', 'USA', 'Pay from your Cash App balance.', 'MANUAL', '$', '#00D632', NULL, NULL, true, 2, NOW(3), NOW(3)),
  ('pm_venmo', 'Venmo', 'USA', 'USA', 'Pay from your Venmo account.', 'MANUAL', 'V', '#3D95CE', NULL, NULL, true, 3, NOW(3), NOW(3)),
  ('pm_shakepay', 'Shakepay', 'Canada', 'Canada', 'Buy and send Bitcoin from Shakepay in Canada.', 'BITCOIN', 'S', '#009FFF', 'Bitcoin Network', 'In Shakepay, buy Bitcoin, choose Send, and paste the wallet address and exact BTC amount shown here.', true, 4, NOW(3), NOW(3)),
  ('pm_zelle', 'Zelle', 'USA', 'USA', 'Pay from your US bank with Zelle.', 'MANUAL', 'Z', '#6D1ED4', NULL, NULL, true, 5, NOW(3), NOW(3)),
  ('pm_moonpay', 'MoonPay', 'Credit Card', NULL, 'Buy Bitcoin with a debit or credit card and send it straight to our wallet.', 'BITCOIN', 'M', '#7D00FF', 'Bitcoin Network', 'Open MoonPay, buy the exact BTC amount shown and paste our wallet address as the destination.', true, 6, NOW(3), NOW(3));
