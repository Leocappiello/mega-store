-- AlterTable
ALTER TABLE `order` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE `users` ADD COLUMN `codeVerification` VARCHAR(191) NULL;
