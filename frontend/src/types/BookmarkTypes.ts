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

export type BookmarksContentProps = {
  bookmarks: BookmarkType[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export type BookmarkProps = {
  bookmark: BookmarkType;
  editFunction: (bookmark: BookmarkType) => void;
  setOnEdit: (state: boolean) => void;
};
