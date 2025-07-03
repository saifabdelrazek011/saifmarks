import {
  type SignUpReturn,
  type UserType,
  type SignInReturn,
  type SignUpType,
  type ChangePasswordType,
  type UserDataType,
} from "../types";
import api from "./api";

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
    if (error.response) {
      // Handle specific error response from the server
      throw new Error(error.response.data.message || "Signin failed");
    } else {
      throw new Error("Signin failed");
    }
  }
};

export const signout = async (): Promise<void> => {
  try {
    await api.post("/auth/signout", {}, { withCredentials: true });
  } catch (error: Error | any) {
    if (error.response) {
      throw new Error(error.response.data.message || "Signout failed");
    } else {
      throw new Error("Signout failed");
    }
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
    throw new Error(
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Failed to update user data"
    );
  }
};

export const changePassword = async (
  passwordData: ChangePasswordType
): Promise<void> => {
  try {
    await api.patch(`/auth/password`, passwordData, {
      withCredentials: true,
    });
  } catch (error: any) {
    throw new Error(
      typeof error === "object" && error !== null && "message" in error
        ? String((error as { message?: string }).message)
        : "Failed to change password"
    );
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
      `/auth/verify-email`,
      { email, code: providedCode },
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
