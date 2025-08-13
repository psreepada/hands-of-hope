"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Sponsor } from "@/types/database"

const AUTOPLAY_INTERVAL = 3000 

export default function SponsorCarousel() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  })

  const autoplayRef = useRef<NodeJS.Timeout>()

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Fetch sponsors from database
  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const { data, error } = await supabase
          .from('sponsors')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) {
          console.error('Error fetching sponsors:', error)
          return
        }

        setSponsors(data || [])
      } catch (error) {
        console.error('Error fetching sponsors:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSponsors()
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        emblaApi.scrollNext()
      }, AUTOPLAY_INTERVAL)
    }

    const stopAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }

    startAutoplay()

    
    const onUserInteraction = () => {
      stopAutoplay()
    }

    emblaApi.on('pointerDown', onUserInteraction)
    emblaApi.on('pointerUp', () => startAutoplay())

    return () => {
      stopAutoplay()
      emblaApi.off('pointerDown', onUserInteraction)
      emblaApi.off('pointerUp', () => startAutoplay())
    }
  }, [emblaApi])

  if (loading) {
    return (
      <div className="relative w-full h-40 flex items-center justify-center">
        <div className="text-gray-500">Loading sponsors...</div>
      </div>
    )
  }

  if (sponsors.length === 0) {
    return (
      <div className="relative w-full h-40 flex items-center justify-center">
        <div className="text-gray-500">No sponsors found</div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex-[0_0_300px] min-w-0 relative h-40 mx-8"
            >
              <div className="relative w-full h-full">
                <Image
                  src={sponsor.logo_url}
                  alt={sponsor.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-10"
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
} 