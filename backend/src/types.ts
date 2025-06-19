export type SignTokenPromise = {
  success: boolean;
  message: string;
  access_token: string;
};

export type JWTPayloadType = {
  sub: string;
  email: string;
};
