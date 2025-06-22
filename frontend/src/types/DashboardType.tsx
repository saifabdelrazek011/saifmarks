import type { UserType } from "./UserTypes";
import type { BookmarkType } from "./BookmarkTypes";

export type DashboardContextType = {
  // User related properties
  userData: UserType;
  setUserData: (data: UserType) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (status: boolean) => void;
  isUserLoading?: boolean;
  setIsUserLoading?: (status: boolean) => void;

  // Bookmarks related properties
  bookmarks: BookmarkType[];
  setBookmarks: (bookmarks: BookmarkType[]) => void;
  isBookmarksLoading?: boolean;
  setIsBookmarksLoading?: (status: boolean) => void;
};
