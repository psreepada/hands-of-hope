"use client"

import type React from "react"
import "./globals.css"
import { Montserrat } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { DonationModalProvider } from "@/components/DonationModalProvider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

const montserrat = Montserrat({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (cache time)
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <DonationModalProvider>
              <div className={montserrat.className}>
                {children}
              </div>
            </DonationModalProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}