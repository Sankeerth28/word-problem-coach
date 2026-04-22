import type { Metadata } from "next"
import { Inter, Nunito } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toast"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  title: "Math Story Decoder for Kids",
  description: "A story-first math app with big tap targets, voice reading, simple hints, and deterministic answer checking.",
  keywords: ["math", "word problems", "education", "K-12", "math stories", "kids"],
  authors: [{ name: "Math Story Decoder" }],
  openGraph: {
    title: "Math Story Decoder for Kids",
    description: "Decode the important numbers, pick the action, and confirm the equation.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${nunito.variable} font-sans antialiased`}>
        {/* Background Gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-sky-50 to-emerald-50 -z-10" />

        {/* Decorative Elements */}
        <div className="fixed top-20 left-10 w-32 h-32 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-float -z-10" />
        <div className="fixed bottom-20 right-10 w-40 h-40 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-float animation-delay-2000 -z-10" />
        <div className="fixed top-1/2 left-1/2 w-48 h-48 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-4000 -z-10" />

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Toast Container */}
        <Toaster />

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-muted-foreground">
          <p>
            Made for kids who need clarity before confidence.
          </p>
        </footer>
      </body>
    </html>
  )
}
