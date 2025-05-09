"use client"

import { useCallback, useEffect, useRef } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const sponsors = [
  {
    name: "Fulton Academy",
    image: "/images/rotating/facfb.png",
  },
  {
    name: "Innovation Academy",
    image: "/images/rotating/IAF.png",
  },
  {
    name: "Cambridge High School",
    image: "/images/rotating/CamF.png",
  },
  {
    name: "Alpharetta High School",
    image: "/images/rotating/alphaF.png",
  },
  {
    name: "Chattahoochee High School",
    image: "/images/rotating/hoochF.png",
  },
  {
    name: "Open Hand Atlanta",
    image: "/images/rotating/OpenHand.png",
  },
  {
    name: "Atlanta Mission",
    image: "/images/rotating/Atlanta Mission.png",
  },
  {
    name: "Aiwyn",
    image: "/images/rotating/aiwyn-logo-2.jpg",
  }
]

const AUTOPLAY_INTERVAL = 3000 // 3 seconds

export default function SponsorCarousel() {
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

  // Autoplay functionality
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

    // Pause autoplay when user interacts with the carousel
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

  return (
    <div className="relative w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.name}
              className="flex-[0_0_300px] min-w-0 relative h-40 mx-8"
            >
              <div className="relative w-full h-full">
                <Image
                  src={sponsor.image}
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