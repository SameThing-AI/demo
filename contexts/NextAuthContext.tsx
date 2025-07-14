'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useSession, signIn, signOut, SessionProvider } from 'next-auth/react'

interface AuthContextType {
  user: any
  login: () => void
  loginWithCredentials: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
  updateUserRole: (role: 'recruiter' | 'candidate', company?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession()

  const updateUserRole = async (role: 'recruiter' | 'candidate', company?: string) => {
    try {
      console.log('updateUserRole called with:', { role, company })
      
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, company }),
      })

      console.log('API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API error:', errorData)
        throw new Error(errorData.error || 'Failed to update user role')
      }

      const updatedUser = await response.json()
      console.log('User updated successfully:', updatedUser)

      // Update the session with new user data
      await update({
        ...session,
        user: {
          ...session?.user,
          role: updatedUser.role,
          company: updatedUser.company,
        }
      })
      
      console.log('Session updated')
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  }

  const login = () => {
    signIn('google')
  }

  const loginWithCredentials = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    
    if (result?.error) {
      throw new Error('Invalid credentials')
    }
  }

  const logout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <AuthContext.Provider value={{
      user: session?.user || null,
      login,
      loginWithCredentials,
      logout,
      isAuthenticated: !!session?.user,
      isLoading: status === 'loading',
      updateUserRole,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
