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
  type BookmarkType,
} from "../types";
import { getUserData } from "../services";

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

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

  const [userData, setUserData] = useState<UserType>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    isAdmin: false,
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [isBookmarksLoading, setIsBookmarksLoading] = useState<boolean>(false);

  const handleUpdateUserData = async () => {
    setIsUserLoading(true);
    try {
      const user = await getUserData();
      setUserData(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsAuthenticated(false);
    } finally {
      setIsUserLoading(false);
    }
  };

  // Get the current user data
  useEffect(() => {
    handleUpdateUserData();
  }, []);

  const value: DashboardContextType = {
    userData,
    isAuthenticated,
    isUserLoading,
    handleUpdateUserData,
    bookmarks,
    isBookmarksLoading,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default useDashboardContext;
