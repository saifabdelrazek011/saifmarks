/*
  Warnings:

  - A unique constraint covering the columns `[userId,isPrimary]` on the table `emails` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "emails_userId_email_key";

-- AlterTable
ALTER TABLE "emails" ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "emails_userId_isPrimary_key" ON "emails"("userId", "isPrimary");
