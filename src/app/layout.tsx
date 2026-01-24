/* eslint-disable @next/next/no-sync-scripts */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import PWARegister from '../components/PWARegister';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Remeslo',
  description: 'Remeslo - Your personal budgeting and marketplace app',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Remeslo',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Remeslo',
    title: 'Remeslo',
    description: 'Your personal budgeting and marketplace app',
  },
  twitter: {
    card: 'summary',
    title: 'Remeslo',
    description: 'Your personal budgeting and marketplace app',
  },
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
          <PWARegister />
          <script src="https://kit.fontawesome.com/d8e569da66.js" crossOrigin="anonymous" />
        </body>
    </html>
  )
}
