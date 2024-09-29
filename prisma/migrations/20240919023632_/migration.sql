-- AlterTable
ALTER TABLE `order` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT now();

-- AlterTable
ALTER TABLE `status` ADD COLUMN `feedbackId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Feedback` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Status` ADD CONSTRAINT `Status_feedbackId_fkey` FOREIGN KEY (`feedbackId`) REFERENCES `Feedback`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
