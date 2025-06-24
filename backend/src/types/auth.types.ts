import { Email } from '@prisma/client';

export type SignInReturnType = {
  success: boolean;
  message: string;
  user: {
    id: string;
    emails: Email[];
    firstName?: string | null;
    lastName?: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
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
  } | null;
};
