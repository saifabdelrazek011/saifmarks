export type SignInReturnType = {
  success: boolean;
  message: string;
  token: string;
};

export type SignUpReturnType = {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt: Date;
    updatedAt: Date;
  };
};
