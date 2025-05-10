import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="flex items-center space-x-4">
          <a href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            Dashboard
          </a>
          <a href="/cms" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            CMS
          </a>
          <a
            href="/legal-documents"
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Legal Documents
          </a>
          <a href="/datalex" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
            DataLex
          </a>
          <a
            href="/header-config"
            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Headers
          </a>
          <a
            href="#"
            className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            Login
          </a>
        </nav>
        {children}
      </body>
    </html>
  )
}
