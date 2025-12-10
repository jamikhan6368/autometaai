import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
})

export const { signIn, signOut, signUp, useSession } = authClient

// Export the full client for advanced usage
export { authClient as default }
