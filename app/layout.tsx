import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NIF Store',
  description: 'Top Up Game Murah & Cepat',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind via CDN */}
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        {/* 🔹 Navbar */}
        <nav className="bg-white border-b shadow px-6 py-4 flex gap-6">
          <a href="/" className="font-bold text-blue-600">Home</a>
          <a href="/history" className="text-gray-600 hover:text-blue-600">Histori</a>
        </nav>

        {/* konten halaman */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  )
}
