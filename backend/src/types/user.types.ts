import { Email } from '@prisma/client';

export type GetUserPromise = {
  success: boolean;
  message: string;
  user: {
    id: string;
    emails: Email[];
    firstName?: string;
    lastName?: string;
    createdAt: Date;
    updatedAt: Date;
  };
};
