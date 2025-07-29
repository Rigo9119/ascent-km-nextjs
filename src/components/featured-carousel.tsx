'use client'

import { useRef } from 'react'
import Link from "next/link"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

interface CarouselItemData {
  id: string
  name: string
  image_url: string
  href: string
}

interface FeaturedCarouselProps {
  title: string
  items: CarouselItemData[]
  autoplayDelay?: number
  className?: string
}

export function FeaturedCarousel({ 
  title, 
  items, 
  autoplayDelay = 4000,
  className 
}: FeaturedCarouselProps) {
  const plugin = useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false })
  )

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id}>
              <Link 
                href={item.href}
                className="relative block w-full h-48 rounded-xl overflow-hidden group"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={item.image_url || '/placeholder-event.svg'}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-white font-bold text-lg drop-shadow-lg line-clamp-2 group-hover:text-emerald-200 transition-colors">
                      {item.name}
                    </h4>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  )
}