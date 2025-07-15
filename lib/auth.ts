import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import bcryptjs from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import { User } from '@/models'

// Only create MongoDB client if we have a valid connection string
const MONGODB_URI = process.env.MONGODB_URI
const hasValidMongoConfig = MONGODB_URI && 
  !MONGODB_URI.includes('your-mongodb-connection-string-here') &&
  !MONGODB_URI.includes('mongodb://localhost:27017') // Also skip default local MongoDB

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

if (hasValidMongoConfig && MONGODB_URI) {
  try {
    client = new MongoClient(MONGODB_URI)
    clientPromise = client.connect()
  } catch (error) {
    console.warn('Failed to create MongoDB client for NextAuth:', error)
    client = null
    clientPromise = null
  }
}

export const authOptions: NextAuthOptions = {
  // Only use MongoDB adapter if we have a valid configuration
  ...(hasValidMongoConfig && client && clientPromise ? { adapter: MongoDBAdapter(clientPromise) } : {}),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Return null if MongoDB is not configured
        if (!hasValidMongoConfig) {
          console.warn('Credentials login attempted but MongoDB is not configured')
          return null
        }

        try {
          await dbConnect()
          
          const user = await User.findOne({ email: credentials.email }).select('+password')
          if (!user || !user.password) {
            return null
          }

          const isValidPassword = await bcryptjs.compare(credentials.password, user.password)
          if (!isValidPassword) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            company: user.company,
            image: user.image,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Only try to access database if MongoDB is configured
        if (hasValidMongoConfig) {
          try {
            await dbConnect()
            
            // Check if user exists in our custom User model
            let existingUser = await User.findOne({ email: user.email })
            
            if (!existingUser) {
              // For new users, we'll need to determine their role
              // This could be done through a separate onboarding flow
              // For now, we'll create a basic user record
              existingUser = await User.create({
                name: user.name,
                email: user.email,
                image: user.image,
                role: 'candidate', // Default role, can be changed later
                emailVerified: new Date(),
              })
            }
            
            return true
          } catch (error) {
            console.error('Error during sign in:', error)
            return false
          }
        }
      }
      return true
    },
    async session({ session, token, user }) {
      // Add custom user data to session
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'recruiter' | 'candidate'
        session.user.company = token.company as string
        
        // If session doesn't have role but token has email, fetch from database
        if (!session.user.role && token.email && hasValidMongoConfig) {
          try {
            await dbConnect()
            const dbUser = await User.findOne({ email: token.email })
            if (dbUser) {
              session.user.role = dbUser.role
              session.user.company = dbUser.company
            }
          } catch (error) {
            console.error('Error fetching user data in session callback:', error)
          }
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.company = user.company
      }
      
      // If token doesn't have role but has email, fetch from database
      if (!token.role && token.email && hasValidMongoConfig) {
        try {
          await dbConnect()
          const dbUser = await User.findOne({ email: token.email })
          if (dbUser) {
            token.role = dbUser.role
            token.company = dbUser.company
          }
        } catch (error) {
          console.error('Error fetching user role in JWT callback:', error)
        }
      }
      
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
}
