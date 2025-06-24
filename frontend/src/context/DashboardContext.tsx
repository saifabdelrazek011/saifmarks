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
} from "../types";
import { getUserBookmarks, getUserData } from "../services";

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);
const globalErorr = import.meta.env.VITE_GLOBAL_ERROR;

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
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

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
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch user data"
      );
    } finally {
      setIsUserLoading(false);
    }
  };

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    setIsBookmarksLoading(true);
    try {
      const response = await getUserBookmarks();
      if (response && response.bookmarks) {
        setBookmarks(response.bookmarks);
      }
    } catch (error) {
    } finally {
      setIsBookmarksLoading(false);
    }
  };

  // Get the current user data
  useEffect(() => {
    if (!userData.success || !userData.user.id) handleUpdateUserData();
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

    // Themes related properties
    toggleTheme,

    globalErorr,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
