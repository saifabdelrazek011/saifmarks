export type UserPromise = {
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
