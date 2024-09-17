-- AlterTable
ALTER TABLE `order` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE `product` ADD COLUMN `subcategoryId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `Subcategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
