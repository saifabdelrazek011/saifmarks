-- AlterTable
CREATE SEQUENCE bookmarks_userbookmarkid_seq;
ALTER TABLE "bookmarks" ALTER COLUMN "userBookmarkId" SET DEFAULT nextval('bookmarks_userbookmarkid_seq');
ALTER SEQUENCE bookmarks_userbookmarkid_seq OWNED BY "bookmarks"."userBookmarkId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
