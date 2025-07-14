import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/NextAuthContext'
import { DatabaseDataProvider } from '@/contexts/DatabaseDataContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Hiring Assessments | SameThing.AI',
  description: 'AI-powered hiring assessment platform for creating custom technical evaluations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DatabaseDataProvider>
            <div className="min-h-screen bg-gray-900">
              {children}
            </div>
          </DatabaseDataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
