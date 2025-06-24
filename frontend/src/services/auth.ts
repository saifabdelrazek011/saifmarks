import {
  type SignUpReturn,
  type UserType,
  type SignInReturn,
  type SignUpType,
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
