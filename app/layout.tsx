import type React from "react"
import type { Metadata } from "next"
import { Lato } from "next/font/google"
import "./globals.css"

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "NMG . Roodito Revision Portal",
  description: "Curated quizzes to help students prepare and revise confidently across all grades and subjects.",
  keywords: "education, revision, quizzes, Kenya, students, learning, Nation Media Group, Roodito",
  authors: [{ name: "Nation Media Group • Roodito" }],
  openGraph: {
    title: "NMG . Roodito Revision Portal",
    description: "For every learner, every classroom - comprehensive revision materials",
    url: "https://nmg.roodito.com",
    siteName: "NMG • Roodito Revision Portal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NMG • Roodito Revision Portal",
    description: "For every learner, every classroom - comprehensive revision materials",
  },
  
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lato.className}>
      <body>{children}</body>
    </html>
  )
}
