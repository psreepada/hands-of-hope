import type React from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import AIChatbot from "@/components/ai-chatbot"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <AIChatbot />
    </>
  )
}
