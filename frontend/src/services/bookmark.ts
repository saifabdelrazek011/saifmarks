import api from "./api";

export const getUserBookmarks = async () => {
  try {
    const response = await api.get(`/bookmarks`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch bookmarks " + error);
  }
};

export const createBookmark = async (bookmarkData: {
  title: string;
  url: string;
}) => {
  try {
    const response = await api.post(`/bookmarks`, bookmarkData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to create bookmark");
  }
};

export const updateBookmark = async (
  bookmarkId: string,
  bookmarkData: { title: string; url: string }
) => {
  try {
    const response = await api.put(`/bookmarks/${bookmarkId}`, bookmarkData, {
      withCredentials: true,
    });
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
  } catch (error) {
    throw new Error("Failed to delete bookmark");
  }
};
