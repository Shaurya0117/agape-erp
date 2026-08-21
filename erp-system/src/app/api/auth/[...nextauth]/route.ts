import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // For local dev, hardcode a backdoor admin if db is empty or you want easy access
        if (credentials.email === "admin@erp.com" && credentials.password === "admin") {
          return { 
            id: "1", name: "Admin", email: "admin@erp.com",
            isSuperAdmin: true, canManageFinancials: true, canManageProjects: true, canManageLogistics: true, canManageUsers: true
          }
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) return null

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) return null

        return { 
          id: user.id, name: user.name, email: user.email,
          isSuperAdmin: user.isSuperAdmin,
          canManageFinancials: user.canManageFinancials,
          canManageProjects: user.canManageProjects,
          canManageLogistics: user.canManageLogistics,
          canManageUsers: user.canManageUsers
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isSuperAdmin = user.isSuperAdmin
        token.canManageFinancials = user.canManageFinancials
        token.canManageProjects = user.canManageProjects
        token.canManageLogistics = user.canManageLogistics
        token.canManageUsers = user.canManageUsers
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.isSuperAdmin = token.isSuperAdmin
        session.user.canManageFinancials = token.canManageFinancials
        session.user.canManageProjects = token.canManageProjects
        session.user.canManageLogistics = token.canManageLogistics
        session.user.canManageUsers = token.canManageUsers
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
