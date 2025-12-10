import { Session as BetterAuthSession, User as BetterAuthUser } from "better-auth"

declare module "better-auth" {
  interface Session extends BetterAuthSession {
    user: {
      id: string
      email: string
      name: string
      role: string
      credits: number
      isActive: boolean
      lastLoginAt: Date | null
    }
  }

  interface User extends BetterAuthUser {
    role: string
    credits: number
    isActive: boolean
    lastLoginAt: Date | null
  }
}
