import type { UserDataType, UserType } from "./UserTypes";
import type { BookmarkType } from "./BookmarkTypes";
import type { ChangePasswordType } from "./AuthTypes";
import type { ShortUrlType } from "./ShortUrlTypes";

export type AddBookmarksReturn =
  | {
      success: boolean;
      message: string;
      bookmark: BookmarkType | null;
    }
  | undefined;

export type DashboardContextType = {
  // App loading state
  isAppLoading: boolean;

  // User related properties
  user: UserType;
  userData: UserDataType;
  isAuthenticated: boolean;
  isVerified?: boolean; // Indicates if the primary email is verified
  isUserLoading?: boolean;

  // User related functions
  handleEditUserData: (formData: {
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  handleUpdateUserData: () => Promise<void>;
  handleChangePassword: (passwordData: ChangePasswordType) => Promise<void>;
  handleDeleteUser: ({ password }: { password: string }) => Promise<void>;

  // Verify User Email
  handleSendVerificationCode: (email: string) => Promise<void>;
  handleVerifyUserEmail: (email: string, providedCode: string) => Promise<void>;
  handleSendResetPassword: (email: string) => Promise<void>;
  handleResetPassword: (
    email: string,
    token: string,
    newPassword: string
  ) => Promise<void>;

  // Bookmarks related properties
  bookmarks: BookmarkType[];
  isBookmarksLoading?: boolean;

  // Bookmarks related functions
  handleAddBookmark: (newBookmarkData: Omit<BookmarkType, "id">) => void;
  handleEditBookmark: (updateBookmarkData: BookmarkType) => void;
  handleDeleteBookmark: (bookmarkId: string, deleteShortUrl: boolean) => void;

  // ShortUrls
  shortUrls: ShortUrlType[];
  isShortUrlsLoading?: boolean;
  handleAddShortUrl: (fullUrl: string, shortUrl?: string) => Promise<void>;
  handleEditShortUrl: (
    id: string,
    fullUrl: string,
    shortUrl: string
  ) => Promise<void>;
  handleDeleteShortUrl: (id: string) => Promise<void>;

  // Shorten Bookmark URL
  handleShortenBookmarkUrl: (
    bookmarkId: string,
    shortUrl?: string
  ) => Promise<void>;

  // Settings
  // Themes toggle
  theme: "light" | "dark" | "system";
  toggleTheme: () => void;

  // Hide Welcome
  hideWelcome: boolean;
  setHideWelcome: (hide: boolean) => void;

  // Short Domain
  shortDomain: string;
  setShortDomain: (domain: string) => void;

  // Global Error
  globalError?: string;
};
