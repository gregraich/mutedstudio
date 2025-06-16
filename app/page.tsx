'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [fadeOutIntro, setFadeOutIntro] = useState(false)
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    // Start fade out after 2.5s
    const fadeTimer = setTimeout(() => {
      setFadeOutIntro(true)
    }, 2500)

    // Remove intro from DOM after fade completes (1s)
    const removeTimer = setTimeout(() => {
      setShowIntro(false)
      // Show nav after intro is removed
      setTimeout(() => setShowNav(true), 100)
    }, 3500)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Intro Animation */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${
          showIntro ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative z-10 text-center">
          <div className={`relative w-[200px] h-[200px] transition-all duration-800 ${
            fadeOutIntro ? 'animate-morph-logo' : 'animate-scale-up animate-glow-pulse'
          }`}>
            <Image
              src="/mutedlogo.png"
              alt="Muted Studio"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className={`mt-8 text-2xl font-light tracking-[0.2em] uppercase overflow-hidden whitespace-nowrap border-r-2 border-white animate-typewriter w-[17ch] transition-opacity duration-500 ${
            fadeOutIntro ? 'opacity-0' : 'opacity-100'
          }`}>
            Muted Studio
          </div>
        </div>
      </div>

      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        showNav ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className={`relative w-[60px] h-[60px] transition-all duration-800 ${
              fadeOutIntro ? 'opacity-100' : 'opacity-0'
            }`}>
              <Image
                src="/mutedlogo.png"
                alt="Muted Studio"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex gap-12 text-sm tracking-widest uppercase">
              <Link href="#work" className="hover:text-accent transition-colors">Work</Link>
              <Link href="#about" className="hover:text-accent transition-colors">About</Link>
              <Link href="#contact" className="hover:text-accent transition-colors">Contact</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/muted.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-4xl px-8">
            <h1 className="text-display mb-8 tracking-widest uppercase">
              Architectural Design-Build
            </h1>
            <p className="text-xl tracking-wide">
              Creating bold, cinematic outdoor environments that balance form and function
            </p>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-32">
        <div className="container mx-auto space-y-32">
          <div className="animate-fade-in">
            <div className="relative aspect-video mb-8">
              <Image
                src="/res1.png"
                alt="A massed stone garden balancing slope and softness"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h2 className="text-h2 tracking-widest uppercase mb-4">Stone Garden</h2>
            <p className="text-body text-muted">A massed stone garden balancing slope and softness</p>
          </div>

          <div className="animate-fade-in">
            <div className="relative aspect-video mb-8">
              <Image
                src="/res2.png"
                alt="A sunken conversation pit surrounded by corten steel and structured plantings"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h2 className="text-h2 tracking-widest uppercase mb-4">Conversation Pit</h2>
            <p className="text-body text-muted">A sunken conversation pit surrounded by corten steel and structured plantings</p>
          </div>

          <div className="animate-fade-in">
            <div className="relative aspect-video mb-8">
              <Image
                src="/res3.png"
                alt="A geometric pool house with cantilevered concrete planes"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h2 className="text-h2 tracking-widest uppercase mb-4">Pool House</h2>
            <p className="text-body text-muted">A geometric pool house with cantilevered concrete planes</p>
          </div>

          <div className="animate-fade-in">
            <div className="relative aspect-video mb-8">
              <Image
                src="/res4.png"
                alt="A minimalist courtyard with rhythmic stone pavers and sculptural plantings"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h2 className="text-h2 tracking-widest uppercase mb-4">Courtyard</h2>
            <p className="text-body text-muted">A minimalist courtyard with rhythmic stone pavers and sculptural plantings</p>
          </div>

          <div className="animate-fade-in">
            <div className="relative aspect-video mb-8">
              <Image
                src="/res5.png"
                alt="A terraced garden with cascading water features and geometric plantings"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h2 className="text-h2 tracking-widest uppercase mb-4">Terraced Garden</h2>
            <p className="text-body text-muted">A terraced garden with cascading water features and geometric plantings</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-black/50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-h2 tracking-widest uppercase mb-8">About</h2>
          <p className="text-body mb-8">
            Muted Studio is an architectural design-build practice based in Toronto. We create bold outdoor environments that balance form and function, using precise design language and premium materials.
          </p>
          <p className="text-body">
            Our work explores the relationship between built form and natural elements, creating spaces that are both visually striking and deeply functional.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-h2 tracking-widest uppercase mb-8">Contact</h2>
          <form className="space-y-8">
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full bg-transparent border border-border p-4 text-foreground placeholder-muted focus:border-accent outline-none transition-colors"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent border border-border p-4 text-foreground placeholder-muted focus:border-accent outline-none transition-colors"
              />
            </div>
            <div>
              <textarea
                placeholder="Message"
                rows={6}
                className="w-full bg-transparent border border-border p-4 text-foreground placeholder-muted focus:border-accent outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-accent text-background tracking-widest uppercase hover:bg-accent/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted">
          © {new Date().getFullYear()} Muted Studio. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
