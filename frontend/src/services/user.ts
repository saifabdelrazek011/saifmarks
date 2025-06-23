import axios from "axios";
import { type UserType } from "../types";
import { checkAuthToken } from "./token";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const getUserData = async (): Promise<UserType> => {
  try {
    if (!checkAuthToken()) {
      return {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        isAdmin: false,
      };
    }

    const response = await axios.get<UserType>(`${API_URL}/users/me`, {
      withCredentials: true,
    });
    const userData = response.data;
    console.log("User info fetched successfully:", response.data);

    return userData;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error("Failed to fetch user info");
  }
};
