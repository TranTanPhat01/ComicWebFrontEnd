/**
 * Authentication DTOs matching the backend contract.
 */

export interface LoginRequestDto {
  usernameOrEmail: string;
  password: string;
}

export interface AuthUserDto {
  id: number;
  username: string;
  email: string;
  role: "Admin" | "User";
}

export interface LoginResponseDto {
  accessToken: string;
  expiresIn: number; // in seconds
  mustChangePassword: boolean;
  user: AuthUserDto;
}

export interface MeResponseDto {
  id: number;
  username: string;
  email: string;
  role: "Admin" | "User";
  mustChangePassword: boolean;
  permissions: string[];
}

export interface ChangePasswordRequestDto {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

/**
 * Frontend session data (safe to expose, does not contain tokens).
 */
export interface AuthSession {
  user: AuthUserDto;
  mustChangePassword: boolean;
  permissions?: string[];
}
