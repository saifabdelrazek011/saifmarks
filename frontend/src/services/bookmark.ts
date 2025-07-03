import api from "./api";
import type { BookmarkType } from "../types";

export const getUserBookmarks = async (): Promise<BookmarkType[]> => {
  try {
    const response = await api.get(`/bookmarks`, {
      withCredentials: true,
    });
    if (!response.data.bookmarks) {
      throw new Error("Error while getting the user bookmarks from data");
    }

    return response.data.bookmarks;
  } catch (error) {
    throw new Error("Failed to fetch bookmarks " + error);
  }
};

export const createBookmark = async (
  bookmarkData: Omit<BookmarkType, "id">
) => {
  try {
    const response = await api.post(`/bookmarks`, bookmarkData, {
      withCredentials: true,
    });
    console.log(response.data.bookmark);
    return response?.data?.bookmark;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const updateBookmark = async (bookmarkData: BookmarkType) => {
  try {
    const response = await api.put(
      `/bookmarks/${bookmarkData.id}`,
      bookmarkData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update bookmark: " + error);
  }
};

export const deleteBookmark = async (bookmarkId: string) => {
  try {
    const response = await api.delete(`/bookmarks/${bookmarkId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete bookmark"
    );
  }
};
