import { User, UserRole, Tier } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  username: string
  fullName?: string
  role: UserRole
  membershipTier: Tier
  walletBalance: number
  avatarUrl?: string
}

export interface AuthSession {
  user: AuthUser
  expires: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  confirmPassword: string
  fullName: string
}

export interface PasswordResetData {
  email: string
}

export interface NewPasswordData {
  token: string
  password: string
  confirmPassword: string
}