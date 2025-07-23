import { DashboardContext } from "./DashboardContext";
import { useContext } from "react";
import type { DashboardContextType } from "../types/DashboardType";

export const useDashboardContext = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};
