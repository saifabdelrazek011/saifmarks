import api from "./api";
import type { ShortUrlType } from "../types/ShortUrlTypes";
import axios from "axios";

export const getUserShortUrls = async (): Promise<ShortUrlType[]> => {
  try {
    const response = await api.get(`/shorturl/me`, {
      withCredentials: true,
    });
    if (!response.data.shortUrls) {
      throw new Error("Error while getting the user short URLs from data");
    }
    return response.data.shortUrls;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 404 &&
      typeof error.response.data?.message === "string" &&
      error.response.data.message.includes("No short URLs found for you")
    ) {
      return [];
    }
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error(
      "Failed to fetch short URLs: " +
        (error instanceof Error ? error.message : "")
    );
  }
};

export const createShortUrl = async (
  fullUrl: string,
  shortUrl?: string
): Promise<ShortUrlType> => {
  try {
    const response = await api.post(
      `/shorturl`,
      { fullUrl, shortUrl },
      { withCredentials: true }
    );
    return response.data.shortUrl || response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("An unknown error occurred");
  }
};

export const updateShortUrl = async (
  id: string,
  fullUrl: string,
  shortUrl: string
): Promise<ShortUrlType> => {
  try {
    const response = await api.patch(
      `/shorturl/${id}`,
      { fullUrl, shortUrl },
      { withCredentials: true }
    );
    return response.data.shortUrl || response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to update short URL: " + error);
  }
};

export const deleteShortUrl = async (id: string) => {
  try {
    const response = await api.delete(`/shorturl/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to delete short URL: " + error);
  }
};

export const shortenBookmarkUrl = async (
  bookmarkId: string,
  shortUrl?: string
): Promise<ShortUrlType> => {
  try {
    const response = await api.post(
      `/bookmarks/shorten/${bookmarkId}`,
      { shortUrl },
      { withCredentials: true }
    );
    return response.data.shortUrl || response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to shorten bookmark URL: " + error);
  }
};
