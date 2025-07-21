export type UserType = {
  id: string;
  firstName: string;
  lastName?: string;
  emails: UserEmailType[] | [];
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserDataType = {
  success: boolean;
  message: string;
  user: UserType;
};

export type UserEmailType = {
  id: string;
  email: string;
  isVerified: boolean;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
};
