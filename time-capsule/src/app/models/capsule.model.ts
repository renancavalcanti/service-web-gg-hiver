import { User } from "./user.model";

export interface Capsule {
  _id: string;
  content: string;
  imageUrl: string;
  author: User;
  recipient: User;
  isOpened: boolean;
  isLocked: boolean;
  canOpen: boolean;
  openAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCapsuleRequest{
  content: string;
  recipientEmail: string;
  openAt: string;
  imageUrl: string;
}
