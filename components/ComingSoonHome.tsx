'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useIntro } from '@/lib/IntroContext'
import IntroAnimation, { INTRO_EXIT_HANDOFF_MS } from '@/components/IntroAnimation'

const easePremium: [number, number, number, number] = [0.16, 1, 0.3, 1]

const noiseDataUri = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`

export default function ComingSoonHome() {
  const { setShowNav } = useIntro()
  const reduceMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [showIntro, setShowIntro] = useState(true)
  const [fadeOutIntro, setFadeOutIntro] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    setShowNav(false)
  }, [setShowNav])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let fallbackTimeout: ReturnType<typeof setTimeout> | null = null

    // Reinforce iOS/Safari inline-autoplay requirements on the actual DOM node.
    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.setAttribute('muted', '')
    video.setAttribute('autoplay', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', 'true')

    const attemptPlay = async () => {
      try {
        const playPromise = video.play()
        if (playPromise && typeof playPromise.then === 'function') {
          await playPromise
        }
      } catch {
        // iOS can reject autoplay promises in Low Power mode/settings.
        // Do not trigger fallback unless media loading actually fails.
      }
    }

    const onCanPlay = () => {
      setVideoReady(true)
      setVideoFailed(false)
      void attemptPlay()
    }

    const onLoadedData = () => {
      setVideoReady(true)
      setVideoFailed(false)
    }

    const onPlaying = () => {
      setVideoReady(true)
      setVideoFailed(false)
    }

    const onError = () => {
      const errorCode = video.error?.code
      const hasKnownSource =
        Boolean(video.currentSrc) ||
        Array.from(video.querySelectorAll('source')).some((sourceEl) => Boolean(sourceEl.src))
      const hasLoadedData = video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA

      // iOS Safari can fire transient errors before media settles; only fall back on definitive source failures.
      if (!hasLoadedData && (!hasKnownSource || errorCode === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED)) {
        setVideoFailed(true)
      }
    }

    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('error', onError)

    fallbackTimeout = setTimeout(() => {
      const hasLoadedData = video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
      if (!hasLoadedData) {
        setVideoFailed(true)
      }
    }, 6500)

    void attemptPlay()

    return () => {
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout)
      }
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('loadeddata', onLoadedData)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('error', onError)
    }
  }, [setShowNav])

  const handleIntroComplete = () => {
    setFadeOutIntro(true)
    window.setTimeout(() => {
      setShowIntro(false)
      window.setTimeout(() => {
        setShowNav(true)
      }, 80)
    }, INTRO_EXIT_HANDOFF_MS)
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
                videoFailed ? 'opacity-0' : videoReady ? 'opacity-[0.97]' : 'opacity-[0.92]'
              }`}
            >
              <source src="/muted.mp4" type="video/mp4" />
            </video>
            {videoFailed && (
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

        <div className="absolute inset-0 bg-gradient-to-b from-black/38 via-[#0a0a0a]/46 to-[#070707]/64" aria-hidden />
        <div className="absolute inset-0 bg-black/[0.08]" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(155,180,212,0.18),transparent_58%)]"
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

      <motion.div
        className="relative z-10 flex min-h-[100dvh] flex-1 flex-col px-6 sm:px-10 lg:px-16"
        initial={false}
        animate={{
          opacity: fadeOutIntro || !showIntro ? 1 : 0,
        }}
        transition={{
          duration: reduceMotion ? 0.2 : 0.95,
          ease: easePremium,
          delay: reduceMotion ? 0 : fadeOutIntro ? 0.08 : 0,
        }}
      >
        <div
          key={fadeOutIntro ? 'coming-soon-reveal' : 'coming-soon-pending'}
          className="flex flex-1 flex-col items-center justify-center py-12 text-center sm:py-16"
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transitionBase}
            className="mb-7 h-px w-16 bg-gradient-to-r from-transparent via-accent/70 to-transparent sm:mb-9 sm:w-20"
          />

          <motion.h1
            aria-label="Muted Studio"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 18, scale: 0.985, filter: 'blur(12px)' }
            }
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.88,
              ease: easePremium,
              delay: reduceMotion ? 0 : 0.22,
            }}
            className="max-w-[22ch] font-light tracking-[0.11em] text-[clamp(2.1rem,6.7vw,4.9rem)] leading-[1.05] text-white sm:max-w-none sm:tracking-[0.14em]"
          >
            <span className="inline-flex flex-wrap items-center justify-center gap-x-[0.03em]">
              <span>MUT</span>
              <span
                className="inline-flex h-[1lh] shrink-0 items-center justify-center self-center font-light leading-none text-[#d8d2c8] -translate-y-[0.11em]"
                aria-hidden
              >
                :
              </span>
              <span>ED STUDIO</span>
            </span>
          </motion.h1>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitionBase, delay: stagger * 2 }}
            className="mx-auto mt-10 max-w-2xl sm:mt-12"
          >
            <p className="text-[clamp(1rem,2.2vw,1.18rem)] font-light leading-relaxed tracking-[0.05em] text-white/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.5)]">
              A design-build firm that creates refined, thoughtfully curated environments and landscapes.
            </p>
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitionBase, delay: stagger * 3 }}
            className={`mt-8 max-w-3xl text-[clamp(0.96rem,2.65vw,1.28rem)] font-semibold uppercase leading-relaxed tracking-[0.22em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.62)] sm:mt-10 sm:tracking-[0.28em] ${
              reduceMotion ? '' : 'coming-soon-tagline-soft'
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
      </motion.div>
    </main>
  )
}
