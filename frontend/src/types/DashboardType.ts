import type { UserDataType, UserType } from "./UserTypes";
import type { BookmarkType } from "./BookmarkTypes";

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

  // Themes related properties
  toggleTheme: () => void;

  globalErorr?: string;
};
