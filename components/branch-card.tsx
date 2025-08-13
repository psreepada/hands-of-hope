"use client"

import React from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { MapPin, Mail } from "lucide-react"
import type { BranchCardProps } from "@/types"

export default function BranchCard({ branch }: BranchCardProps): JSX.Element {

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-teal-100 hover:border-teal-300">
      <div className="relative h-64 w-full">
        <Image src={branch.image || "/placeholder.svg"} alt={branch.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-1">{branch.name}</h3>
            <div className="flex items-center text-white/90">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{branch.address.split(",")[1]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-teal-600 mt-0.5" />
            <span className="text-gray-700">{branch.address}</span>
          </div>
          {branch.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-teal-600" />
              <span className="text-gray-700 text-sm">{branch.email}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
