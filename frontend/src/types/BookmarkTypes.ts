export type BookmarkType = {
  id: string;
  title: string;
  url: string;
  description?: string;
};

export type BookmarkDataType = {
  success: boolean;
  message: string;
  bookmarks: BookmarkType[];
};
