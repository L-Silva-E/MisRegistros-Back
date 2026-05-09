import { BaseEntity } from "../../../shared/interfaces/base.entity";
import { Role } from "@prisma/client";

export { Role };

export interface UserModel extends BaseEntity {
  email: string;
  username: string;
  passwordHash: string;
  role: Role;
  isActive: boolean;
  lastLoginAt?: Date | null;
}

//~ Safe to expose (no passwordHash)
export interface UserPublicModel {
  id: number;
  email: string;
  username: string;
  role: Role;
  isActive: boolean;
  lastLoginAt?: Date | null;
  createdAt?: Date;
}

export interface UserLoginResponse {
  token: string;
  user: UserPublicModel;
}
