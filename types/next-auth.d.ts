import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: 'recruiter' | 'candidate'
      company?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    role: 'recruiter' | 'candidate'
    company?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'recruiter' | 'candidate'
    company?: string
  }
}
