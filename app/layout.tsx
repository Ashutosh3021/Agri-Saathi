import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Agri Sathi - AI-Powered Crop Intelligence for Indian Farmers",
  description:
    "Detect crop diseases in seconds. Get soil health recommendations. Powered by IoT, ML, and drones with a WhatsApp-first interface.",
}

export const viewport: Viewport = {
  themeColor: "#2d6a4f",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
