import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Nav } from '@/components/nav/Nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Remeslo Next App',
  description: 'Remeslo Next App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body suppressHydrationWarning={true} className={inter.className}>
          <Providers>
            <Nav />
            {children}
          </Providers>
        </body>
    </html>
  )
}
