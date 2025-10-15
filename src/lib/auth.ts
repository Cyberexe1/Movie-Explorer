import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

// Demo users for testing (in production, use a proper database)
const demoUsers: User[] = [
  {
    id: 'demo-user-1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qK', // password: demo123
    createdAt: new Date().toISOString(),
  }
]

// In-memory user store for demo purposes (gets reset on each deployment)
let users: User[] = [...demoUsers]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' }, // For registration
        action: { label: 'Action', type: 'text' }, // 'login' or 'register'
      },
      async authorize(credentials) {
        console.log('NextAuth authorize called with:', {
          email: credentials?.email,
          action: credentials?.action,
          usersCount: users.length
        })

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const { email, password, name, action } = credentials

        try {
          if (action === 'register') {
            // Check if user already exists
            const existingUser = users.find((user) => user.email === email.toLowerCase())
            if (existingUser) {
              throw new Error('User with this email already exists')
            }

            if (!name || name.trim().length < 2) {
              throw new Error('Name must be at least 2 characters long')
            }

            if (password.length < 6) {
              throw new Error('Password must be at least 6 characters long')
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12)

            // Create new user
            const newUser: User = {
              id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
              name: name.trim(),
              email: email.toLowerCase(),
              password: hashedPassword,
              createdAt: new Date().toISOString(),
            }

            users.push(newUser)

            return {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
            }
          } else {
            // Login
            const user = users.find((user) => user.email === email.toLowerCase())

            if (!user) {
              throw new Error('No account found with this email')
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid) {
              throw new Error('Invalid password')
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
            }
          }
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed')
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  events: {
    async signIn({ user }) {
      console.log(`User ${user.email} signed in`)
    },
    async signOut() {
      console.log(`User signed out`)
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === 'production',
}