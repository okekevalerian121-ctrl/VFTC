import { DefaultSession, DefaultUser } from 'next-auth'
import { UserRole, Tier } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      tier: Tier
      walletBalance: number
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role: UserRole
    membershipTier: Tier
    walletBalance: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    tier: Tier
    walletBalance: number
  }
}