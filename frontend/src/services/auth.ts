import {
  type SignUpReturn,
  type UserType,
  type SignInReturn,
  type SignUpType,
} from "../types";
import api from "./axios";

export const signup = async (userData: SignUpType): Promise<UserType> => {
  try {
    const response = await api.post<SignUpReturn>(`/auth/signup`, userData, {
      withCredentials: true,
    });
    console.log("Signup response:", response.data);
    if (!response.data.success || !response.data.user) {
      throw new Error(response.data.message || "Signup failed");
    }
    return response.data.user;
  } catch (error: Error | any) {
    if (error.response) {
      // Handle specific error response from the server
      console.error("Signup error response:", error.response.data);
      throw new Error(error.response.data.message || "Signup failed");
    } else {
      console.error("Error during signup:", error);
      throw new Error("Signup failed");
    }
  }
};

export const signin = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const response = await api.post<SignInReturn>(
      `/auth/signin`,
      { email, password },
      { withCredentials: true }
    );
    console.log("Signin response:", response.data);

    if (!response.data.success || !response.data.token) {
      throw new Error(response.data.message || "Signin failed");
    }
    return response.data.token;
  } catch (error: Error | any) {
    if (error.response) {
      // Handle specific error response from the server
      console.error("Signin error response:", error.response.data);
      throw new Error(error.response.data.message || "Signin failed");
    } else {
      console.error("Error during signin:", error);
      throw new Error("Signin failed");
    }
  }
};
