import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
<<<<<<< HEAD
import './global.css'
=======
import './globals.css'
>>>>>>> e250cd2 (Add app directory)

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EduRank - Course & Professor Reviews',
  description: 'Rate and review courses and professors at ADA University',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

