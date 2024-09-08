/*
  Warnings:

  - You are about to drop the `_userroles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_userroles` DROP FOREIGN KEY `_UserRoles_A_fkey`;

-- DropForeignKey
ALTER TABLE `_userroles` DROP FOREIGN KEY `_UserRoles_B_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('ADMIN', 'OWNER', 'CLIENT') NOT NULL DEFAULT 'CLIENT';

-- DropTable
DROP TABLE `_userroles`;

-- DropTable
DROP TABLE `role`;
