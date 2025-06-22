import { useContext, createContext, useState, type ReactNode } from "react";
import {
  type DashboardContextType,
  type UserType,
  type BookmarkType,
} from "../types";

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

const useDashboardContext = (): DashboardContextType => {
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
    name: "",
    email: "",
    isAdmin: false,
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);
  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [isBookmarksLoading, setIsBookmarksLoading] = useState<boolean>(false);

  const value: DashboardContextType = {
    userData,
    setUserData,
    isAuthenticated,
    setIsAuthenticated,
    isUserLoading,
    setIsUserLoading,
    bookmarks,
    setBookmarks,
    isBookmarksLoading,
    setIsBookmarksLoading,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default useDashboardContext;
