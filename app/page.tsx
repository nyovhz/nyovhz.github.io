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
        rounded-xl
        overflow-hidden
        bg-white/40
        backdrop-blur-2xl
        border border-black/5
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
        cursor-pointer
        transform-gpu
        transition
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
            group-hover:scale-[1.02] transition duration-500
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
            group-hover:scale-[1.02] transition duration-500
          "
        />
      )}

      <div
        className="
          absolute inset-0
          bg-white/20
          opacity-0 group-hover:opacity-100
          transition
          flex items-end
          p-5
          pointer-events-none
        "
      >
        <p className="text-xs tracking-wide text-gray-200">
          x{index + 1}
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
    <main className="relative min-h-screen bg-[#f7f7f4] text-neutral-900 selection:bg-black selection:text-white overflow-hidden">

      <div className="opacity-[0.25]">
        <ShaderBackground />
      </div>

      {/* HERO */}
      <section
        className="
          relative z-10 max-w-7xl mx-auto px-6
          py-32 md:py-40
          grid md:grid-cols-2
          gap-16
          items-center
        "
      >
        <div>
          <h1
            className="
              text-5xl md:text-7xl lg:text-[7rem]
              font-semibold
              tracking-[-0.06em]
              leading-[0.9]
            "
          >
            Creative <br /> Technologist
          </h1>

          <p className="mt-6 text-neutral-500 max-w-xl leading-relaxed">
            I develop real-time graphics, generative systems, and interactive tools.
            I focus on high-performance visuals and experimental interfaces.
          </p>

          <div className="mt-10 flex gap-10">
            <button
              onClick={() => scrollToSection('work')}
              className="text-xs tracking-[0.2em] text-neutral-500 hover:text-black transition"
            >
              [ VIEW WORK ]
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="text-xs tracking-[0.2em] text-neutral-400 hover:text-black transition"
            >
              CONTACT
            </button>
          </div>
        </div>

        <div className="opacity-90">
          <MediaCarousel
            items={xBiomediaItems}
            type="pingpong"
            grayscaleOnHover={true}
            transparentBlur={true}
          />
        </div>
      </section>

      {/* WORK */}
      <section
        id="work"
        className="
          relative z-10 max-w-7xl mx-auto px-6
          py-32
          grid md:grid-cols-2
          gap-16
        "
      >
        <div className="rounded-xl overflow-hidden">
          <MediaCarousel items={xPDWorldmediaItems} grayscaleOnHover={false} />
        </div>

        <div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Work & Logic.
          </h2>

          <p className="mt-6 text-neutral-500 leading-relaxed">
            A record of my technical explorations in digital form.
            These projects focus on the behavior of light, shape, and code-driven interaction.
          </p>

          <ul className="mt-12 space-y-5">
            {["Generative visuals", "Real-time Interaction", "Data mapping"].map(text => (
              <li
                key={text}
                className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-neutral-500"
              >
                <span className="text-[6px]">●</span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTIONS */}
      {sections.map(({ title, items }) => (
        <section
          key={title}
          className="relative z-10 max-w-7xl mx-auto px-6 py-32"
        >
          <h2 className="text-2xl font-semibold mb-10 tracking-tight">
            {title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* ABOUT */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="p-14 md:p-16 rounded-xl bg-white/40 backdrop-blur-2xl border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

          <div className="space-y-16">

            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                About
              </h2>
              <p className="text-neutral-500 max-w-3xl leading-relaxed">
                I’m a creative technologist focused on building expressive digital systems.
                My work blends real-time graphics, generative design, and modern web.
              </p>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                Skills
              </h2>

              <div className="flex flex-wrap gap-3">
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
                      rounded-xl
                      bg-white/60
                      border border-black/5
                      text-sm text-neutral-600
                      backdrop-blur-md
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

      {/* FOOTER */}
      <footer
        id="contact"
        className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-black/5 flex justify-between"
      >
        <p className="text-xs text-neutral-400">
          © {new Date().getFullYear()} neo3xt
        </p>

        <div className="flex gap-8 text-xs text-gray-400">
          <a className="hover:text-white transition" href="https://www.instagram.com/nyovhz_/">Instagram</a>
          <a className="hover:text-white transition" href="#">GitHub</a>
          <a className="hover:text-white transition" href="#">LinkedIn</a>
        </div>
      </footer>

      {/* MODAL */}
      {activeMedia && (
        <div
          onClick={() => setActiveMedia(null)}
          className="
            fixed inset-0 z-[100]
            bg-white/40 backdrop-blur-3xl
            flex items-center justify-center
            p-6
          "
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-xl"
          >
            {activeMedia.type === "image" ? (
              <Image
                src={optimizeCloudinaryUrl(activeMedia.src, 2400, "image")}
                alt="Expanded view"
                fill
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
              className="absolute -top-10 right-0 text-black text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </main>
  )
}