import { Geist } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import InstallPWA from './components/InstallPWA'
import { Providers } from './providers'

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#72717f',
}

export const metadata = {
  title: 'Daksh - Student Portal',
  description: 'A platform for students, mentors, and admins',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Daksh',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="apple-touch-icon" href="/icons/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="google-site-verification"
          content="1dmarru9P3gaivQMYG8pD5nVERSVBb7rr6ewslRmEiE"
        />
        {/* add manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geist.className} min-h-screen bg-background antialiased`}
      >
        <Providers>
          {children}
          <Toaster position="top-center" />
          <InstallPWA />
        </Providers>
      </body>
    </html>
  )
}
