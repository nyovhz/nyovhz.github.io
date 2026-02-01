'use client'

import Image from "next/image"
import { useEffect, useRef, useState, memo, useMemo } from "react"

type MediaItem = {
  type: "image" | "video"
  src: string
  alt?: string
}

type CarouselType = "normal" | "pingpong"

interface MediaCarouselProps {
  items: MediaItem[]
  interval?: number
  type?: CarouselType
  grayscaleOnHover?: boolean
  // NUEVA FLAG:
  transparentBlur?: boolean 
}

const MediaCarousel = ({
  items,
  interval = 4000,
  type = "normal",
  grayscaleOnHover = true,
  transparentBlur = false, // Por defecto es falso
}: MediaCarouselProps) => {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const nextStep = useMemo(() => {
    return () => {
      setIndex((prev) => {
        if (type === "normal") return (prev + 1) % items.length
        const nextIdx = prev + direction
        if (nextIdx >= items.length) {
          setDirection(-1)
          return Math.max(0, items.length - 2)
        }
        if (nextIdx < 0) {
          setDirection(1)
          return Math.min(items.length - 1, 1)
        }
        return nextIdx
      })
    }
  }, [type, items.length, direction])

  useEffect(() => {
    if (!isVisible || items.length <= 1) return
    const id = setInterval(nextStep, interval)
    return () => clearInterval(id)
  }, [isVisible, interval, nextStep, items.length])

  // Lógica de estilos condicionales
  const containerClasses = [
    "group relative w-full h-[420px] rounded-2xl overflow-hidden transform-gpu transition-all duration-500",
    transparentBlur 
      ? "bg-white/5 backdrop-blur-md border border-white/10" // Modo transparente
      : "bg-neutral-900" // Modo sólido
  ].join(" ")

  const grayscaleClass = grayscaleOnHover
    ? "grayscale group-hover:grayscale-0 transition-[filter] duration-700 ease-in-out"
    : ""

  return (
    <div ref={containerRef} className={containerClasses}>
      {items.map((item, i) => {
        const isCurrent = i === index
        const isNear = Math.abs(i - index) <= 1
        if (!isNear && items.length > 3) return null

        return (
          <div
            key={item.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out will-change-opacity ${
              isCurrent ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {item.type === "image" ? (
              <Image
                src={item.src}
                alt={item.alt ?? ""}
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover ${grayscaleClass}`}
              />
            ) : (
              <video
                src={item.src}
                autoPlay={isCurrent && isVisible}
                loop
                muted
                playsInline
                preload="metadata"
                className={`w-full h-full object-cover ${grayscaleClass}`}
              />
            )}
          </div>
        )
      })}

      {/* Gradiente sutil para que los controles siempre sean visibles */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-20" />

      {/* DOTS */}
      <div className="absolute bottom-6 left-6 flex gap-2 z-30">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              i === index ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(MediaCarousel)