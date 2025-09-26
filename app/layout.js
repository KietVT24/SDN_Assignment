import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ToasterProvider } from '@/components/ui/Toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Clothing Store - Modern E-commerce',
  description: 'A modern clothing store built with Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ToasterProvider>
      </body>
    </html>
  )
}
