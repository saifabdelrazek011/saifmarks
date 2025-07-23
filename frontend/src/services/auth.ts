/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type SignUpReturn,
  type UserType,
  type SignInReturn,
  type SignUpType,
  type ChangePasswordType,
  type UserDataType,
} from "../types";
import api from "./api";
import { AxiosError } from "axios";

export const signup = async (signedUserData: SignUpType): Promise<UserType> => {
  try {
    const response = await api.post<SignUpReturn>(
      `/auth/signup`,
      signedUserData,
      {
        withCredentials: true,
      }
    );
    if (!response.data.success || !response.data.user) {
      throw new Error(response.data.message || "Signup failed");
    }
    return response.data.user;
  } catch (error: Error | any) {
    if (error.response) {
      // Handle specific error response from the server
      throw new Error(error.response.data.message || "Signup failed");
    } else {
      throw new Error("Signup failed");
    }
  }
};

export const signin = async (
  email: string,
  password: string
): Promise<UserType> => {
  try {
    const response = await api.post<SignInReturn>(
      `/auth/signin`,
      { email, password },
      { withCredentials: true }
    );

    if (!response.data.success || !response.data.user) {
      throw new Error(response.data.message || "Signin failed");
    }
    return response.data.user;
  } catch (error: Error | any) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message || error.message || "Request failed";
      throw new Error(message);
    }
    throw new Error("Unknown error");
  }
};

export const signout = async (): Promise<void> => {
  try {
    await api.post("/auth/signout", {}, { withCredentials: true });
  } catch (error: Error | any) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message || error.message || "Request failed";
      throw new Error(message);
    }
    throw new Error("Unknown error");
  }
};

export const editUserData = async (formData: {
  firstName: string;
  lastName?: string;
}): Promise<UserDataType> => {
  try {
    const response = await api.patch<UserDataType>(`/users/me`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message || error.message || "Request failed";
      throw new Error(message);
    }
    throw new Error("Unknown error");
  }
};

export const changePassword = async (
  passwordData: ChangePasswordType
): Promise<void> => {
  try {
    const response = await api.patch(`/users/password`, passwordData, {
      withCredentials: true,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to change password");
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message || error.message || "Request failed";
      throw new Error(message);
    }
    throw new Error("Unknown error");
  }
};

export const sendVerificationCode = async (email: string): Promise<void> => {
  try {
    await api.post(`/auth/verify-email`, { email }, { withCredentials: true });
  } catch (error: any) {
    throw new Error(
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Failed to send verification code"
    );
  }
};

export const verifyUser = async (
  email: string,
  providedCode: string
): Promise<void> => {
  try {
    await api.patch(
      `/auth/verification`,
      { email, token: providedCode },
      { withCredentials: true }
    );
  } catch (error: any) {
    throw new Error(
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Failed to verify user"
    );
  }
};

export const sendResetPasswordEmail = async (email: string): Promise<void> => {
  try {
    await api.patch(
      `/auth/password/reset/send`,
      { email },
      { withCredentials: true }
    );
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message || error.message || "Request failed";
      throw new Error(message);
    }
    throw new Error("Unknown error");
  }
};

export const resetPassword = async (
  email: string,
  newPassword: string,
  token: string
): Promise<void> => {
  try {
    await api.patch(
      `/auth/password/reset`,
      { email, newPassword, token },
      { withCredentials: true }
    );
  } catch (error: any) {
    if (error instanceof AxiosError) {
      const message =
        error.response?.data?.message || error.message || "Request failed";
      throw new Error(message);
    }
    throw new Error("Unknown error");
  }
};
