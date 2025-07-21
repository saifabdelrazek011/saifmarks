import axios from "axios";
import { type UserDataType } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export const getUserData = async (): Promise<UserDataType> => {
  try {
    const response = await axios.get<UserDataType>(`${API_URL}/users/me`, {
      withCredentials: true,
    });
    const userData = response.data;

    return userData;
  } catch (error) {
    throw new Error("Failed to fetch user info: " + error);
  }
};

export const deleteUser = async ({
  password,
}: {
  password: string;
}): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/users/me`, {
      withCredentials: true,
      data: { password },
    });
  } catch (error) {
    throw new Error("Failed to delete user: " + error);
  }
};
