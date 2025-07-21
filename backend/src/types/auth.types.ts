import { User } from '@prisma/client';

type OmitUserPassword = Omit<User, 'hashedPassword'>;

export type SignInReturnType = {
  success: boolean;
  message: string;
  user: OmitUserPassword | null;
};

export type SignUpReturnType = {
  success: boolean;
  message: string;
  user: OmitUserPassword | null;
};

export type SignOutReturnType = {
  success: boolean;
  message: string;
};
