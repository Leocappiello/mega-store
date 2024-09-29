/*
  Warnings:

  - Added the required column `quantity` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `alert` ADD COLUMN `quantity` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT now();
