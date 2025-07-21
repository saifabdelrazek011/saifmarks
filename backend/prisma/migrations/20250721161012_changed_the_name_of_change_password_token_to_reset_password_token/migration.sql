/*
  Warnings:

  - You are about to drop the column `changePasswordExpires` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `changePasswordToken` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resetPasswordToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_changePasswordToken_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "changePasswordExpires",
DROP COLUMN "changePasswordToken",
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_resetPasswordToken_key" ON "users"("resetPasswordToken");
