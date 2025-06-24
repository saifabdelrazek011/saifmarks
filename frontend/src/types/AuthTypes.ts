import { type UserType } from "./UserTypes";

export type SignUpType = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignInType = {
  email: string;
  password: string;
};

export type SignUpReturn = {
  success: boolean;
  message: string;
  user: UserType | null;
};

export type SignInReturn = {
  success: boolean;
  message: string;
  user: UserType | null;
};
