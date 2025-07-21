import type { UserDataType, UserType } from "./UserTypes";
import type { BookmarkType } from "./BookmarkTypes";
import type { ChangePasswordType } from "./AuthTypes";

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
  handleDeleteBookmark: (bookmarkId: string) => void;

  // Themes related properties
  toggleTheme: () => void;

  globalError?: string;
};
