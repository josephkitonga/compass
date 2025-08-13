import React from "react"
import type { Metadata } from "next"
import { Lato } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ClientAuthProvider } from "@/components/ClientAuthProvider"

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Compass Press . Roodito Revision Portal",
  description: "Curated quizzes to help students prepare and revise confidently across all grades and subjects.",
  keywords: "education, revision, quizzes, Kenya, students, learning, Compass Press, Roodito",
  authors: [{ name: "Compass Press • Roodito" }],
  openGraph: {
    title: "Compass Press . Roodito Revision Portal",
    description: "For every learner, every classroom - comprehensive revision materials",
    url: "https://compass.roodito.com",
    siteName: "Compass Press • Roodito Revision Portal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compass Press • Roodito Revision Portal",
    description: "For every learner, every classroom - comprehensive revision materials",
  },
  
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lato.className}>
      <body>
        <ClientAuthProvider>
          {children}
          <Toaster />
        </ClientAuthProvider>
      </body>
    </html>
  )
}
