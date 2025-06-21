export type SignTokenPromise = {
  success: boolean;
  message: string;
  access_token: string;
};

export type JWTPayloadType = {
  sub: string;
  email: string;
};

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
