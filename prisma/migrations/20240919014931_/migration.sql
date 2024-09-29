-- AlterTable
ALTER TABLE `alert` ADD COLUMN `read` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `order` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT now();
