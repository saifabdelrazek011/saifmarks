export type BookmarkType = {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
};

export type BookmarkDataType = {
  success: boolean;
  message: string;
  bookmarks: BookmarkType[];
};

export type BookmarksContentProps = {
  bookmarks: BookmarkType[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export type BookmarkProps = {
  bookmark: BookmarkType;
  onEdit?: (bookmark: BookmarkType) => void;
  onDelete?: (bookmark: BookmarkType) => void;
};
