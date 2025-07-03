import type { UserDataType, UserType } from "./UserTypes";
import type { BookmarkType } from "./BookmarkTypes";

export type AddBookmarksReturn =
  | {
      success: boolean;
      message: string;
      bookmark: BookmarkType | null;
    }
  | undefined;

export type DashboardContextType = {
  // User related properties
  user: UserType;
  userData: UserDataType;
  isAuthenticated: boolean;
  isUserLoading?: boolean;
  handleUpdateUserData: () => Promise<void>;

  // Bookmarks related properties
  bookmarks: BookmarkType[];
  isBookmarksLoading?: boolean;
  handleAddBookmark: (newBookmarkData: Omit<BookmarkType, "id">) => void;
  handleEditBookmark: (updateBookmarkData: BookmarkType) => void;
  handleDeleteBookmark: (bookmarkId: string) => void;

  // Themes related properties
  toggleTheme: () => void;

  globalError?: string;
};
