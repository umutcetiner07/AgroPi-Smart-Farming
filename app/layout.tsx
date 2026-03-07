import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AgroPi Marketplace - AI Destekli Topraksız Tarım',
  description: 'AI destekli topraksız tarım ve lojistik yönetimi platformu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <script src="https://sdk.minepi.com/pi-sdk.js" />
        {children}
      </body>
    </html>
  )
}
