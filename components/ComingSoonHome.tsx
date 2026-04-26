'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useIntro } from '@/lib/IntroContext'
import IntroAnimation from '@/components/IntroAnimation'

const easePremium: [number, number, number, number] = [0.16, 1, 0.3, 1]

const noiseDataUri = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`

export default function ComingSoonHome() {
  const { setShowNav } = useIntro()
  const reduceMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [showIntro, setShowIntro] = useState(true)
  const [fadeOutIntro, setFadeOutIntro] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [videoPlayable, setVideoPlayable] = useState(true)

  useEffect(() => {
    setShowNav(false)
  }, [setShowNav])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Reinforce iOS/Safari inline-autoplay requirements on the actual DOM node.
    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', 'true')

    const attemptPlay = async () => {
      try {
        const playPromise = video.play()
        if (playPromise && typeof playPromise.then === 'function') {
          await playPromise
        }
      } catch {
        // iOS can block autoplay in Low Power mode or strict settings.
        setVideoPlayable(false)
      }
    }

    const onCanPlay = () => {
      setVideoReady(true)
      void attemptPlay()
    }

    const onLoadedData = () => {
      setVideoReady(true)
    }

    const onPlaying = () => {
      setVideoReady(true)
      setVideoPlayable(true)
    }

    const onError = () => {
      setVideoPlayable(false)
    }

    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('error', onError)

    void attemptPlay()

    return () => {
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('error', onError)
    }
  }, [setShowNav])

  const handleIntroComplete = () => {
    setFadeOutIntro(true)
    setTimeout(() => {
      setShowIntro(false)
      setTimeout(() => {
        setShowNav(true)
      }, 120)
    }, 520)
  }

  const transitionBase = reduceMotion
    ? { duration: 0.01 }
    : { duration: 1.05, ease: easePremium }

  const stagger = reduceMotion ? 0 : 0.12

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#070707] text-foreground overflow-hidden">
      <IntroAnimation showIntro={showIntro} fadeOutIntro={fadeOutIntro} onComplete={handleIntroComplete} />
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 ${reduceMotion ? '' : 'animate-coming-soon-drift'}`}
            style={{ transformOrigin: '50% 50%' }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              poster="/black8.jpg"
              className={`h-full w-full scale-[1.03] object-cover contrast-[1.05] saturate-[1.04] transition-opacity duration-700 ${
                videoPlayable ? (videoReady ? 'opacity-[0.97]' : 'opacity-[0.92]') : 'opacity-0'
              }`}
            >
              <source src="/muted.mp4" type="video/mp4" />
            </video>
            {!videoPlayable && (
              <div className="absolute inset-0">
                <img
                  src="/black8.jpg"
                  alt=""
                  className="h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#0a0a0a]/47 to-[#070707]/66" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(193,171,120,0.16),transparent_58%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_100%,rgba(255,255,255,0.04),transparent_55%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_120%_92%_at_50%_50%,transparent_58%,rgba(0,0,0,0.26)_100%)]"
          aria-hidden
        />
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.42)]" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#070707]/72 via-[#070707]/32 to-transparent" aria-hidden />
        <div
          className="absolute left-1/2 top-[58%] h-[20%] w-[min(92vw,44rem)] -translate-x-1/2 bg-[radial-gradient(ellipse_70%_65%_at_50%_50%,rgba(0,0,0,0.34),rgba(0,0,0,0)_100%)]"
          aria-hidden
        />

        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-soft-light"
          style={{ backgroundImage: noiseDataUri }}
          aria-hidden
        />
        {!reduceMotion && (
          <div
            className="absolute inset-0 opacity-[0.014] mix-overlay animate-coming-soon-grain"
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
            <p className="text-[clamp(1rem,2.4vw,1.2rem)] font-light leading-relaxed tracking-[0.06em] text-white/82">
              A design-build firm that creates refined, thoughtfully curated environments and landscapes.
            </p>
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitionBase, delay: stagger * 3 }}
            className={`mt-8 max-w-2xl px-3 py-2 text-[clamp(0.8rem,2.1vw,0.95rem)] font-semibold uppercase leading-relaxed tracking-[0.34em] text-white/94 [text-shadow:0_2px_10px_rgba(0,0,0,0.58)] sm:mt-10 sm:px-4 sm:tracking-[0.4em] ${
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
