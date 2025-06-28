/*
  Warnings:

  - A unique constraint covering the columns `[verificationToken]` on the table `emails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[changePasswordToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "emails" ADD COLUMN     "verificationExpires" TIMESTAMP(3),
ADD COLUMN     "verificationToken" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "changePasswordExpires" TIMESTAMP(3),
ADD COLUMN     "changePasswordToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "emails_verificationToken_key" ON "emails"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_changePasswordToken_key" ON "users"("changePasswordToken");
