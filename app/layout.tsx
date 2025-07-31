import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/NextAuthContext'
import { DatabaseDataProvider } from '@/contexts/DatabaseDataContext'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Hiring Assessments | SameThing.AI',
  description: 'AI-powered hiring assessment platform for creating custom technical evaluations',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} overflow-x-hidden`}>
        <ErrorBoundary>
          <AuthProvider>
            <DatabaseDataProvider>
              <div className="min-h-screen bg-gray-900 w-full">
                {children}
              </div>
            </DatabaseDataProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
