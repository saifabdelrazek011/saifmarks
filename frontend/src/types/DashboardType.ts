import type { UserType } from "./UserTypes";
import type { BookmarkType } from "./BookmarkTypes";

export type DashboardContextType = {
  // User related properties
  userData: UserType;
  isAuthenticated: boolean;
  isUserLoading?: boolean;
  handleUpdateUserData: () => Promise<void>;

  // Bookmarks related properties
  bookmarks: BookmarkType[];
  isBookmarksLoading?: boolean;
};
