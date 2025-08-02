import type React from "react"
import { SonnerProvider } from "@/components/sonner-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mãos de Fada Cake",
  description: "Confeitaria artesanal com bolos e doces especiais",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
          {children}
          <SonnerProvider />
          <Analytics />
      </body>
    </html>
  )
}

