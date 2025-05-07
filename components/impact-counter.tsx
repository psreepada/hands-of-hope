"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface ImpactCounterProps {
  number: number
  label: string
  icon: ReactNode
}

export default function ImpactCounter({ number, label, icon }: ImpactCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000 // ms
    const interval = 20 // ms
    const steps = duration / interval
    const increment = number / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= number) {
        setCount(number)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, interval)

    return () => clearInterval(timer)
  }, [number])

  return (
    <Card className="p-6 text-center hover:shadow-lg transition-shadow border-2 border-teal-100 hover:border-teal-200">
      <div className="flex justify-center mb-4">{icon}</div>
      <div className="text-4xl font-bold text-teal-600 mb-2">{count.toLocaleString()}</div>
      <div className="text-gray-600 font-medium">{label}</div>
    </Card>
  )
}
