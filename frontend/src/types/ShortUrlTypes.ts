import type { BookmarkType } from "./BookmarkTypes";

export type ShortUrlType = {
  id: string;
  fullUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;

  bookmarkId?: string;
  bookmark?: BookmarkType;
  updatedAt: string;
  createdById: string;
};
