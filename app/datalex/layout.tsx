import type React from "react"

export default function DataLexLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">{children}</div>
}
