'use client'

import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useIntro } from '@/lib/IntroContext'

const easePremium: [number, number, number, number] = [0.16, 1, 0.3, 1]

const noiseDataUri = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`

export default function ComingSoonHome() {
  const { setShowNav } = useIntro()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    setShowNav(true)
  }, [setShowNav])

  const transitionBase = reduceMotion
    ? { duration: 0.01 }
    : { duration: 1.05, ease: easePremium }

  const stagger = reduceMotion ? 0 : 0.12

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#070707] text-foreground overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 ${reduceMotion ? '' : 'animate-coming-soon-drift'}`}
            style={{ transformOrigin: '50% 50%' }}
          >
            <video autoPlay muted loop playsInline className="h-full w-full scale-[1.08] object-cover opacity-[0.92]">
              <source src="/muted.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-b from-black/75 via-[#0a0a0a]/82 to-[#070707] mix-blend-multiply"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(193,171,120,0.14),transparent_58%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_100%,rgba(255,255,255,0.04),transparent_55%)]"
          aria-hidden
        />
        <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.72)]" aria-hidden />

        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-soft-light"
          style={{ backgroundImage: noiseDataUri }}
          aria-hidden
        />
        {!reduceMotion && (
          <div
            className="absolute inset-0 opacity-[0.022] mix-overlay animate-coming-soon-grain"
            style={{ backgroundImage: noiseDataUri, backgroundSize: '180px 180px' }}
            aria-hidden
          />
        )}
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-1 flex-col px-6 sm:px-10 lg:px-16">
        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center sm:py-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transitionBase}
            className="mb-7 h-px w-16 bg-gradient-to-r from-transparent via-accent/70 to-transparent sm:mb-9 sm:w-20"
          />

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitionBase, delay: stagger }}
            className="max-w-[18ch] font-light tracking-[0.28em] text-[clamp(2rem,6.5vw,4.75rem)] leading-[1.05] text-white sm:max-w-none sm:tracking-[0.34em]"
          >
            MUTED STUDIO
          </motion.h1>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitionBase, delay: stagger * 2 }}
            className="mx-auto mt-10 max-w-xl sm:mt-12"
          >
            <p className="text-[clamp(1rem,2.4vw,1.2rem)] font-light leading-relaxed tracking-[0.06em] text-white/78">
              A design-build practice shaping refined outdoor environments.
            </p>
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitionBase, delay: stagger * 3 }}
            className={`mt-8 max-w-2xl px-2 text-[clamp(0.8rem,2.1vw,0.95rem)] font-medium uppercase leading-relaxed tracking-[0.32em] sm:mt-10 sm:tracking-[0.38em] ${
              reduceMotion ? 'text-muted' : 'coming-soon-tagline'
            }`}
          >
            Our new digital experience is coming soon.
          </motion.p>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transitionBase, delay: reduceMotion ? 0 : 0.45 }}
          className="mt-auto flex w-full flex-col items-center pb-[max(2rem,env(safe-area-inset-bottom))] pt-4"
        >
          <div
            className="h-px w-16 bg-gradient-to-r from-transparent via-accent/65 to-transparent sm:w-24"
            aria-hidden
          />
          <footer className="mt-6 w-full max-w-xl text-center sm:mt-8">
            <p className="text-[0.8rem] font-light uppercase leading-relaxed tracking-[0.26em] text-white/50 sm:text-sm sm:tracking-[0.3em]">
              Contact us at{' '}
              <a
                href="mailto:hello@mutedstudio.ca"
                className="text-[0.88rem] font-normal normal-case tracking-normal text-white/88 underline decoration-white/25 underline-offset-[0.35em] transition-colors hover:text-accent hover:decoration-accent/50 sm:text-base"
              >
                hello@mutedstudio.ca
              </a>
            </p>
          </footer>
        </motion.div>
      </div>
    </main>
  )
}
