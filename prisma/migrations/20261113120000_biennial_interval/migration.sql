-- AlterTable: two-year packs.
ALTER TABLE `plans` MODIFY `interval` ENUM('MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'YEARLY', 'BIENNIAL', 'ONE_TIME') NOT NULL;
