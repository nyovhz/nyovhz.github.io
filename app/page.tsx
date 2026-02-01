'use client'

import Image from "next/image"
import { useState, useEffect, useCallback, memo } from "react"
import ShaderBackground from "./utils/shader/BGshader"
import MediaCarousel from "./utils/mediaCarousel"
import { data } from "./utils/data"

const {
  xBiomediaItems,
  xPDWorldmediaItems,
  xAImediaItems,
  x3DmediaItems,
  xCCmediaItems,
  optimizeCloudinaryUrl
} = data

const GalleryItem = memo(({ item, title, index, onClick }: any) => {
  const isVideo = item.type === "video"
  const src = optimizeCloudinaryUrl(item.src, 1200, item.type)

  return (
    <div
      onClick={() => onClick(item)}
      className="
        group relative
        h-64 md:h-72 lg:h-80
        rounded-3xl
        overflow-hidden
        bg-neutral-900
        cursor-pointer
        transform-gpu
      "
    >
      {isVideo ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="
            absolute inset-0 w-full h-full object-cover
            group-hover:scale-105 transition duration-500
          "
        />
      ) : (
        <Image
          src={src}
          alt={`${title} ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="
            object-cover
            group-hover:scale-105 transition duration-500
          "
        />
      )}

      <div
        className="
          absolute inset-0
          bg-black/40
          opacity-0 group-hover:opacity-100
          transition
          flex items-end
          p-5
          pointer-events-none
        "
      >
        <p className="text-xs tracking-wide text-gray-200">
          Experimental Visual System #{index + 1}
        </p>
      </div>
    </div>
  )
})

GalleryItem.displayName = "GalleryItem"

export default function Home() {
  const [activeMedia, setActiveMedia] = useState<any>(null)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setActiveMedia(null)
  }, [])

  useEffect(() => {
    if (activeMedia) {
      window.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
    } else {
      window.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "unset"
    }
    return () => {
      window.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "unset"
    }
  }, [activeMedia, handleEsc])

  const sections = [
    { title: "3D Modeling", items: x3DmediaItems },
    { title: "AI", items: xAImediaItems },
    { title: "Creative Coding", items: xCCmediaItems },
  ]

  return (
    <main className="relative z-0 min-h-screen bg-black text-white selection:bg-white select-none">
      <ShaderBackground />

      <section
        className="
          relative z-10 max-w-7xl mx-auto px-6
          py-24 md:py-28 lg:py-32
          grid md:grid-cols-2
          gap-12 lg:gap-16
          items-center
        "
      >
        <div className="animate-in fade-in slide-in-from-left-4 duration-1000">
          <h1
            className="
              text-5xl md:text-6xl lg:text-7xl
              font-bold
              leading-[0.95]
              tracking-tight
            "
          >
            Creative <br /> Technologist
          </h1>

          <p className="mt-6 text-lg text-gray-400 max-w-xl leading-relaxed">
            I develop real-time graphics, generative systems, and interactive tools.
            I focus on high-performance visuals and experimental interfaces.
          </p>

          <div className="mt-10 flex items-center gap-10">
            <button
              onClick={() => scrollToSection('work')}
              className="
                text-xs tracking-[0.2em]
                text-white/80 hover:text-white
                transition
              "
            >
              [ VIEW WORK ]
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="
                text-xs tracking-[0.2em]
                text-white/40 hover:text-white
                transition
              "
            >
              CONTACT
            </button>
          </div>
        </div>

        <MediaCarousel
          items={xBiomediaItems}
          type="pingpong"
          grayscaleOnHover={false}
          transparentBlur={true}
        />
      </section>

      <section
        id="work"
        className="
          relative z-10 max-w-7xl mx-auto px-6
          py-28 md:py-32
          grid md:grid-cols-2
          gap-14 lg:gap-20
          items-center
          backdrop-blur-sm bg-black/5
          rounded-[4rem]
        "
      >
        <MediaCarousel items={xPDWorldmediaItems} grayscaleOnHover={false} />

        <div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Work & Logic.
          </h2>

          <p className="mt-6 text-lg text-gray-400 max-w-xl leading-relaxed">
            A record of my technical explorations in digital form.
            These projects focus on the behavior of light, shape, and code-driven interaction.
          </p>

          <ul className="mt-12 space-y-5">
            {["Generative visuals", "Real-time Interaction", "Data mapping"].map(text => (
              <li
                key={text}
                className="
                  flex items-center gap-4
                  text-xs font-mono uppercase
                  tracking-[0.18em]
                  text-gray-300
                "
              >
                <span className="text-[6px] text-white">●</span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {sections.map(({ title, items }) => (
        <section
          key={title}
          className="relative z-10 max-w-7xl mx-auto px-6 py-24"
        >
          <h2 className="text-2xl font-semibold mb-10 tracking-tight">
            {title}
          </h2>

          <div
            className="
              grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              gap-8 lg:gap-10
            "
          >
            {items.map((item: any, i: number) => (
              <GalleryItem
                key={`${title}-${i}`}
                item={item}
                index={i}
                title={title}
                onClick={setActiveMedia}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div
          className="
            relative p-14 md:p-16
            border border-white/10
            rounded-[3rem]
            bg-neutral-900/40
            backdrop-blur-xl
          "
        >
          <div className="space-y-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-8 tracking-tight">
                About
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">
                I’m a creative technologist focused on building expressive digital systems.
                My work blends real-time graphics, generative design, and modern web.
              </p>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-8 tracking-tight">
                Skills
              </h2>
              <div className="flex flex-wrap gap-4">
                {[
                  "Creative Coding",
                  "WebGL",
                  "Three.js",
                  "TouchDesigner",
                  "GLSL",
                  "Unity",
                  "Unreal Engine",
                  "Interactive Systems"
                ].map(skill => (
                  <span
                    key={skill}
                    className="
                      px-4 py-2
                      rounded-full
                      bg-white/5
                      border border-white/10
                      text-sm text-gray-300
                      hover:bg-white/10
                      transition
                    "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="contact"
        className="
          relative z-10 max-w-7xl mx-auto px-6 py-12
          border-t border-white/10
          flex flex-col md:flex-row
          justify-between items-center gap-6
        "
      >
        <p className="text-gray-500 text-xs italic">
          © {new Date().getFullYear()} neo3xt
        </p>

        <div className="flex gap-8 text-xs text-gray-400">
          <a className="hover:text-white transition" href="/">Instagram</a>
          <a className="hover:text-white transition" href="#">GitHub</a>
          <a className="hover:text-white transition" href="#">LinkedIn</a>
        </div>
      </footer>

      {activeMedia && (
        <div
          onClick={() => setActiveMedia(null)}
          className="
            fixed inset-0 z-[100]
            bg-black/90 backdrop-blur-lg
            flex items-center justify-center
            p-4 md:p-12
            animate-in fade-in duration-300
          "
        >
          <div
            onClick={e => e.stopPropagation()}
            className="
              relative w-full max-w-6xl
              aspect-video
              rounded-2xl
              overflow-hidden
              shadow-2xl
            "
          >
            {activeMedia.type === "image" ? (
              <Image
                src={optimizeCloudinaryUrl(activeMedia.src, 2400, "image")}
                alt="Expanded view"
                fill
                priority
                className="object-contain"
              />
            ) : (
              <video
                src={optimizeCloudinaryUrl(activeMedia.src, 2400, "video")}
                autoPlay
                loop
                controls
                className="w-full h-full object-contain"
              />
            )}

            <button
              onClick={() => setActiveMedia(null)}
              className="
                absolute -top-12 right-0 md:-right-12
                text-white hover:text-gray-400
                text-2xl p-2 transition
              "
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
