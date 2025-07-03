/*
  Warnings:

  - You are about to drop the `_BookmarkTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BookmarkTags" DROP CONSTRAINT "_BookmarkTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookmarkTags" DROP CONSTRAINT "_BookmarkTags_B_fkey";

-- DropTable
DROP TABLE "_BookmarkTags";

-- DropTable
DROP TABLE "tags";
