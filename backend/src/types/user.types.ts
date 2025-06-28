import { Email } from '@prisma/client';

export type UserPromise = {
  success: boolean;
  message: string;
  user: UserType;
};

export type UserType = {
  id: string;
  emails: Email[];
  firstName?: string | null;
  lastName?: string | null;
  createdAt: Date;
  updatedAt: Date;
} | null;
