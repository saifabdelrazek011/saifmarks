/*
  Warnings:

  - A unique constraint covering the columns `[shortUrlId]` on the table `bookmarks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bookmarkId]` on the table `shorturls` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdById,fullUrl]` on the table `shorturls` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "bookmarks_id_key";

-- DropIndex
DROP INDEX "emails_id_key";

-- DropIndex
DROP INDEX "shorturls_fullUrl_key";

-- AlterTable
ALTER TABLE "bookmarks" ADD COLUMN     "shortUrlId" TEXT;

-- AlterTable
ALTER TABLE "shorturls" ADD COLUMN     "bookmarkId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_shortUrlId_key" ON "bookmarks"("shortUrlId");

-- CreateIndex
CREATE UNIQUE INDEX "shorturls_bookmarkId_key" ON "shorturls"("bookmarkId");

-- CreateIndex
CREATE UNIQUE INDEX "shorturls_createdById_fullUrl_key" ON "shorturls"("createdById", "fullUrl");

-- AddForeignKey
ALTER TABLE "shorturls" ADD CONSTRAINT "shorturls_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "bookmarks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
