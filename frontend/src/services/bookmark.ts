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

    console.log(response.data);
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

    return response?.data?.bookmark;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
    ) {
      throw new Error((error.response.data as { message: string }).message);
    }
    throw new Error("An unknown error occurred");
  }
};

export const updateBookmark = async (bookmarkData: BookmarkType) => {
  try {
    const response = await api.patch(
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
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data
    ) {
      throw new Error((error.response.data as { message: string }).message);
    }
    throw new Error("Failed to delete bookmark");
  }
};
