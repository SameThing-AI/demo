import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { DataProvider } from '@/contexts/DataContext'

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
          <DataProvider>
            <div className="min-h-screen bg-gray-900">
              {children}
            </div>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
