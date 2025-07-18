import type React from "react"
import "./globals.css"
import { Montserrat } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { DonationModalProvider } from "@/components/DonationModalProvider"

const montserrat = Montserrat({ subsets: ["latin"] })

export const metadata = {
  title: "Hands of Hope Outreach - Empowering the Homeless",
  description:
    "A student-led nonprofit organization dedicated to uplifting and empowering the homeless through community action.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <DonationModalProvider>
            <div className={montserrat.className}>
              {children}
            </div>
          </DonationModalProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}