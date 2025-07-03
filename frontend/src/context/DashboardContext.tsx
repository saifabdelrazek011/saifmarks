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
  type AddBookmarksReturn,
} from "../types";
import {
  getUserBookmarks,
  getUserData,
  createBookmark,
  updateBookmark,
  deleteBookmark,
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

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [isBookmarksLoading, setIsBookmarksLoading] = useState<boolean>(false);

  // Themes
  const [theme, setTheme] = useState<string>("dark");

  // Themes Functions
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

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

  const handleDeleteBookmark = async (bookmarkId: string): Promise<void> => {
    setIsBookmarksLoading(true);
    try {
      const bookmark = await deleteBookmark(bookmarkId);
      if (!bookmark) {
        throw new Error("Failed to update the Bookmark");
      }
      await fetchBookmarks();
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
        [];
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setIsUserLoading(false);
    }
  };

  // Get the current user data
  useEffect(() => {
    if ((!userData.success || !userData.user.id) && !globalError) {
      handleUpdateUserData();
    }
  }, []);

  // Fetch bookmarks when user data is updated
  useEffect(() => {
    if (userData.success && userData.user.id) {
      fetchBookmarks();
    }
  }, [userData]);

  const value: DashboardContextType = {
    // User related properties
    user,
    userData,
    isAuthenticated,
    isUserLoading,

    handleUpdateUserData,

    // Bookmarks related properties
    bookmarks,
    isBookmarksLoading,
    handleAddBookmark,
    handleEditBookmark,
    handleDeleteBookmark,

    // Themes related properties
    toggleTheme,

    globalError,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
