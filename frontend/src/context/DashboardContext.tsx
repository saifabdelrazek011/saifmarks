/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useContext,
  createContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import {
  type DashboardContextType,
  type UserType,
  type UserDataType,
  type BookmarkType,
  type ChangePasswordType,
  type ShortUrlType,
} from "../types";
import {
  getUserBookmarks,
  getUserData,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  changePassword,
  sendVerificationCode,
  sendResetPasswordEmail,
  verifyUser,
  editUserData,
  deleteUser,
  resetPassword,
  getUserShortUrls,
  createShortUrl,
  updateShortUrl,
  deleteShortUrl,
  shortenBookmarkUrl,
} from "../services";

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);
const globalError = import.meta.env.VITE_GLOBAL_ERROR;

export const useDashboardContext = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  if (!children) {
    throw new Error("DashboardProvider requires children");
  }
  const [isAppLoading, setIsAppLoading] = useState(true);

  const [userData, setUserData] = useState<UserDataType>({
    success: false,
    message: "",
    user: {
      id: "",
      firstName: "",
      lastName: "",
      emails: [],
      isAdmin: false,
    },
  });
  const [user, setUser] = useState<UserType>({
    id: "",
    firstName: "",
    lastName: "",
    emails: [],
    isAdmin: false,
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [isBookmarksLoading, setIsBookmarksLoading] = useState<boolean>(false);

  // Shorturls
  const [shortUrls, setShortUrls] = useState<ShortUrlType[]>([]);
  const [isShortUrlsLoading, setIsShortUrlsLoading] = useState(false);

  // shortDomain
  const availableShortDomains = import.meta.env.VITE_AVAILABLE_SHORT_DOMAINS
    ? import.meta.env.VITE_AVAILABLE_SHORT_DOMAINS.split(",")
    : ["https://go.died.pw"];

  const [shortDomain, setShortDomain] = useState<string>(
    localStorage.getItem("shortDomain") ||
      availableShortDomains[0] ||
      "go.died.pw"
  );

  // Themes Functions
  useEffect(() => {
    localStorage.setItem("shortDomain", shortDomain);
  }, [shortDomain]);

  // Hide Welcome in Dashboard
  const [hideWelcome, setHideWelcome] = useState<boolean>(
    localStorage.getItem("hideWelcome") === "true" || false
  );

  useEffect(() => {
    localStorage.setItem("hideWelcome", String(hideWelcome));
  }, [hideWelcome]);

  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    (localStorage.getItem("theme") as "light" | "dark" | "system") || "system"
  );

  const getSystemTheme = () => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches)
      return "dark";
    return "light";
  };

  useEffect(() => {
    let appliedTheme = theme;
    if (theme === "system") {
      appliedTheme = getSystemTheme();
    }
    document.documentElement.classList.remove("light", "dark", "system");
    document.documentElement.classList.add(appliedTheme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(e.matches ? "dark" : "light");
    };
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "system" : "light"
    );
  };

  const handleSendResetPassword = async (email: string) => {
    try {
      await sendResetPasswordEmail(email);
    } catch (error) {
      throw new Error(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to send reset password email"
      );
    }
  };

  const handleResetPassword = async (
    email: string,
    token: string,
    newPassword: string
  ) => {
    try {
      await resetPassword(email, token, newPassword);
    } catch (error) {
      throw new Error(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to reset password"
      );
    }
  };

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    setIsBookmarksLoading(true);
    try {
      const bookmarks = await getUserBookmarks();
      if (bookmarks.length === 0) {
        const baseUrl = window.location.href.split("/#/")[0];
        const exampleBookmark = {
          id: "test",
          title: "This is an example for a bookmark until you create one",
          url: `${baseUrl}/#/bookmarks`,
        };
        setBookmarks([exampleBookmark]);
      }
      if (bookmarks) {
        setBookmarks(bookmarks);
      }
    } catch (error) {
      return {
        success: true,
        message:
          typeof error === "object" && error !== null && "message" in error
            ? String((error as { message?: string }).message)
            : "Failed to Fetch bookmarks",
        bookmarks: null,
      };
    } finally {
      setIsBookmarksLoading(false);
    }
  };

  // Handle add bookmarks
  const handleAddBookmark = async (
    newBookmarkData: Omit<BookmarkType, "id">
  ): Promise<void> => {
    setIsBookmarksLoading(true);
    try {
      const bookmark = await createBookmark(newBookmarkData);
      if (!bookmark) {
        throw new Error("Failed to Add new Bookmark");
      }
      await fetchBookmarks();
    } catch (error) {
      throw new Error(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to Add new Bookmark"
      );
    } finally {
      setIsBookmarksLoading(false);
    }
  };

  const handleEditBookmark = async (
    updatedBookmarkData: BookmarkType
  ): Promise<void> => {
    setIsBookmarksLoading(true);
    try {
      const bookmark = await updateBookmark(updatedBookmarkData);
      if (!bookmark) {
        throw new Error("Failed to update the Bookmark");
      }
      await fetchBookmarks();
      await fetchShortUrls();
    } catch (error) {
      throw new Error(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to update the Bookmark"
      );
    } finally {
      setIsBookmarksLoading(false);
    }
  };

  const handleDeleteBookmark = async (
    bookmarkId: string,
    deleteShortUrl: boolean
  ): Promise<void> => {
    setIsBookmarksLoading(true);
    try {
      const bookmark = await deleteBookmark(bookmarkId, deleteShortUrl);
      if (!bookmark) {
        throw new Error("Failed to update the Bookmark");
      }
      await fetchBookmarks();
      await fetchShortUrls();
    } catch (error) {
      throw new Error(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to update the Bookmark"
      );
    } finally {
      setIsBookmarksLoading(false);
    }
  };

  // Updating the user Info
  const handleUpdateUserData = async () => {
    setIsUserLoading(true);
    try {
      const userData = await getUserData();
      const { user } = userData;
      if (!userData || !userData.user) {
        setIsAuthenticated(false);
        return;
      }
      setUserData(userData);
      setUser(user);

      if (user.id && user.emails.length > 0) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsUserLoading(false);
    }
  };

  const handleEditUserData = async (formData: {
    firstName: string;
    lastName: string;
  }): Promise<void> => {
    try {
      const userData = await editUserData(formData);
      if (!userData || !userData.user) {
        throw new Error("Failed to fetch user data");
      }
      setUserData(userData);
      setUser(userData.user);
    } catch (error) {
      throw new Error(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to update user data"
      );
    }
  };

  const handleChangePassword = async (passwordData: ChangePasswordType) => {
    try {
      await changePassword(passwordData);
    } catch (error) {
      throw new Error(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to change password"
      );
    }
  };

  const handleSendVerificationCode = async (email: string): Promise<void> => {
    setIsUserLoading(true);
    try {
      if (!userData.user.id || userData.user.emails.length === 0) {
        throw new Error("User ID or email is missing");
      }

      await sendVerificationCode(email);
    } catch (error) {
      throw new Error(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to send verification code"
      );
    } finally {
      setIsUserLoading(false);
    }
  };

  const handleVerifyUserEmail = async (
    email: string,
    providedCode: string
  ): Promise<void> => {
    setIsUserLoading(true);
    try {
      if (!email || !providedCode) {
        throw new Error("Email or verification code is missing");
      }

      // Call the verification API
      await verifyUser(email, providedCode);
      // Update user data after verification
      await handleUpdateUserData();
    } catch (error) {
      throw new Error(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to verify user"
      );
    } finally {
      setIsUserLoading(false);
    }
  };

  const handleDeleteUser = async ({ password }: { password: string }) => {
    try {
      await deleteUser({ password });
      await handleUpdateUserData();
    } catch (error) {
      throw new Error(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to delete user"
      );
    }
  };

  const fetchShortUrls = async () => {
    setIsShortUrlsLoading(true);
    try {
      const urls = await getUserShortUrls();
      if (urls.length === 0) {
        const baseUrl = window.location.href.split("/#/")[0];
        const exampleShortUrl = {
          id: "test",
          fullUrl: `${baseUrl}/#/shorturls`,
          shortUrl: "example",
          clicks: 0,
          createdById: userData.user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setShortUrls([exampleShortUrl]);
      }
      if (urls) {
        setShortUrls(urls);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to fetch short URLs"
      );
    } finally {
      setIsShortUrlsLoading(false);
    }
  };

  const handleAddShortUrl = async (fullUrl: string, shortUrl?: string) => {
    setIsShortUrlsLoading(true);
    try {
      await createShortUrl(fullUrl, shortUrl);
      await fetchShortUrls();
    } finally {
      setIsShortUrlsLoading(false);
    }
  };

  const handleEditShortUrl = async (
    id: string,
    fullUrl: string,
    shortUrl: string
  ) => {
    setIsShortUrlsLoading(true);
    try {
      await updateShortUrl(id, fullUrl, shortUrl);
      await fetchShortUrls();
    } finally {
      setIsShortUrlsLoading(false);
    }
  };

  const handleDeleteShortUrl = async (id: string) => {
    setIsShortUrlsLoading(true);
    try {
      await deleteShortUrl(id);
      await fetchShortUrls();
    } finally {
      setIsShortUrlsLoading(false);
    }
  };

  const handleShortenBookmarkUrl = async (
    bookmarkId: string,
    shortUrl?: string
  ) => {
    setIsShortUrlsLoading(true);
    setIsBookmarksLoading(true);
    try {
      await shortenBookmarkUrl(bookmarkId, shortUrl);
      await fetchShortUrls();
      await fetchBookmarks();
    } catch (error) {
      throw new Error(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "Failed to shorten bookmark URL"
      );
    } finally {
      setIsShortUrlsLoading(false);
      setIsBookmarksLoading(false);
    }
  };

  // Fetch bookmarks and setVerification state when user data is updated
  useEffect(() => {
    if (userData.success && userData.user.id) {
      fetchBookmarks();
    }
    setIsVerified(
      userData.user.emails.find((email) => email.isPrimary)?.isVerified || false
    );
  }, [userData]);

  useEffect(() => {
    const loadAll = async () => {
      setIsAppLoading(true);
      await handleUpdateUserData();
      await fetchBookmarks();
      await fetchShortUrls();
      setIsAppLoading(false);
    };
    loadAll();
  }, []);

  const value: DashboardContextType = {
    // App loading state
    isAppLoading,

    // User related properties
    user,
    userData,
    isAuthenticated,
    isVerified,
    isUserLoading,

    // User related functions
    handleEditUserData,
    handleUpdateUserData,
    handleChangePassword,
    handleDeleteUser,
    handleSendResetPassword,
    handleResetPassword,

    // Verify User Email
    handleSendVerificationCode,
    handleVerifyUserEmail,

    // Bookmarks related properties
    bookmarks,
    isBookmarksLoading,

    // Bookmarks related functions
    handleAddBookmark,
    handleEditBookmark,
    handleDeleteBookmark,

    // Short URLs related properties
    shortUrls,
    isShortUrlsLoading,

    // Short URLs related functions
    handleAddShortUrl,
    handleEditShortUrl,
    handleDeleteShortUrl,

    handleShortenBookmarkUrl,

    // Settings
    // Themes toggle
    theme,
    toggleTheme,

    // Hide Welcome
    hideWelcome,
    setHideWelcome,

    // Short Domain
    shortDomain,
    setShortDomain,

    // Global Error
    globalError,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
