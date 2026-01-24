/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Remeslo',
  description: 'Remeslo',
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
            {children}
          </Providers>
          <script src="https://kit.fontawesome.com/d8e569da66.js" crossOrigin="anonymous" />
        </body>
    </html>
  )
}
