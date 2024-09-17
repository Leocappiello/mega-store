-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_ownerId_fkey`;

-- AlterTable
ALTER TABLE `order` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE `product` MODIFY `ownerId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
