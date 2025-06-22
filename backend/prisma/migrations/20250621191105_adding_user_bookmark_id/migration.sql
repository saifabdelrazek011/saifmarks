/*
  Warnings:

  - A unique constraint covering the columns `[userId,userBookmarkId]` on the table `bookmarks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userBookmarkId` to the `bookmarks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookmarks" ADD COLUMN     "userBookmarkId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userId_userBookmarkId_key" ON "bookmarks"("userId", "userBookmarkId");
