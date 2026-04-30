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
  const [contactOpen, setContactOpen] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const update = () => setIsSmallScreen(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

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
    video.setAttribute('muted', '')
    video.setAttribute('autoplay', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', 'true')
    video.preload = 'auto'
    video.load()

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

    const onLoadedMetadata = () => {
      setVideoFailed(false)
      void attemptPlay()
    }

    const onError = () => {
      // Only fail over on definitive source failure.
      if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        setVideoFailed(true)
        return
      }

      // Safari/iOS can emit transient media errors while still recovering.
      // Keep the video path alive and retry playback.
      setVideoFailed(false)
      void attemptPlay()
    }

    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('loadeddata', onLoadedData)
    video.addEventListener('playing', onPlaying)
    video.addEventListener('error', onError)

    void attemptPlay()

    return () => {
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
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

  const compactMotion = reduceMotion || isSmallScreen

  const transitionBase = compactMotion
    ? { duration: 0.01 }
    : { duration: 1.05, ease: easePremium }

  const stagger = compactMotion ? 0 : 0.12

  return (
    <main className="relative flex min-h-[100dvh] flex-col bg-[#070707] text-foreground overflow-hidden">
      <IntroAnimation showIntro={showIntro} fadeOutIntro={fadeOutIntro} onComplete={handleIntroComplete} />
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 ${compactMotion ? '' : 'animate-coming-soon-drift'}`}
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
              style={{ objectPosition: isSmallScreen ? '56% center' : '50% center' }}
              className={`h-full w-full ${isSmallScreen ? 'scale-[1.01]' : 'scale-[1.03]'} object-cover contrast-[1.05] saturate-[1.04] transition-opacity duration-700 ${
                videoFailed ? 'opacity-0' : videoReady ? 'opacity-[0.97]' : 'opacity-[0.92]'
              }`}
            >
              <source src="/muted-ios.mp4" type='video/mp4; codecs="avc1.42E01F"' />
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
        {!isSmallScreen && (
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_100%,rgba(255,255,255,0.04),transparent_55%)]"
            aria-hidden
          />
        )}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_120%_92%_at_50%_50%,transparent_58%,rgba(0,0,0,0.26)_100%)]"
          aria-hidden
        />
        {!isSmallScreen && <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.42)]" aria-hidden />}
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#070707]/72 via-[#070707]/32 to-transparent" aria-hidden />

        {!isSmallScreen && (
          <div
            className="absolute inset-0 opacity-[0.025] mix-blend-soft-light"
            style={{ backgroundImage: noiseDataUri }}
            aria-hidden
          />
        )}
        {!compactMotion && (
          <div
            className="absolute inset-0 opacity-[0.014] mix-overlay animate-coming-soon-grain"
            style={{ backgroundImage: noiseDataUri, backgroundSize: '180px 180px' }}
            aria-hidden
          />
        )}
      </div>

      <motion.div
        className="relative z-10 flex min-h-[100dvh] flex-1 flex-col px-5 pt-[max(1.1rem,env(safe-area-inset-top))] sm:px-10 sm:pt-0 lg:px-16"
        initial={false}
        animate={{
          opacity: fadeOutIntro || !showIntro ? 1 : 0,
        }}
        transition={{
          duration: compactMotion ? 0.2 : 0.95,
          ease: easePremium,
          delay: compactMotion ? 0 : fadeOutIntro ? 0.08 : 0,
        }}
      >
        <div
          key={fadeOutIntro ? 'coming-soon-reveal' : 'coming-soon-pending'}
          className="flex flex-1 flex-col items-center justify-center py-11 text-center sm:py-16"
        >
          <motion.div
            initial={compactMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transitionBase}
            className="mb-7 h-px w-16 bg-gradient-to-r from-transparent via-accent/70 to-transparent sm:mb-9 sm:w-20"
          />

          <motion.h1
            aria-label="Muted Studio"
            initial={
              compactMotion
                ? false
                : { opacity: 0, y: 18, scale: 0.985, filter: 'blur(12px)' }
            }
            animate={{ opacity: 1, y: 0, scale: 1, filter: compactMotion ? 'none' : 'blur(0px)' }}
            transition={{
              duration: compactMotion ? 0.01 : 0.88,
              ease: easePremium,
              delay: compactMotion ? 0 : 0.22,
            }}
            className="max-w-[21ch] font-light tracking-[0.1em] text-[clamp(1.98rem,8.9vw,4.9rem)] leading-[1.08] text-white sm:max-w-none sm:tracking-[0.14em]"
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
            initial={compactMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitionBase, delay: stagger * 2 }}
            className="mx-auto mt-9 max-w-[36ch] sm:mt-12 sm:max-w-2xl"
          >
            <p className="text-[clamp(1.03rem,4.1vw,1.18rem)] font-light leading-[1.75] tracking-[0.035em] text-white/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.5)] sm:tracking-[0.05em]">
              A design-build firm that creates refined, thoughtfully curated environments and landscapes.
            </p>
          </motion.div>

          <motion.p
            initial={compactMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitionBase, delay: stagger * 3 }}
            className={`mt-7 max-w-[31ch] text-[clamp(0.99rem,4.2vw,1.28rem)] font-semibold uppercase leading-[1.62] tracking-[0.155em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.62)] sm:mt-10 sm:max-w-3xl sm:tracking-[0.28em] ${
              compactMotion ? '' : 'coming-soon-tagline-soft'
            }`}
          >
            Our new digital experience is coming soon.
          </motion.p>
        </div>

        <motion.div
          initial={compactMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transitionBase, delay: compactMotion ? 0 : 0.45 }}
          className="w-full pb-[max(1.4rem,env(safe-area-inset-bottom))] sm:pb-[max(3.2rem,env(safe-area-inset-bottom))] lg:pb-[max(5rem,env(safe-area-inset-bottom))]"
        >
          <div className="mx-auto h-[188px] w-full max-w-xl text-center sm:h-[220px] lg:h-[236px]">
            <div
              className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-accent/65 to-transparent sm:w-24"
              aria-hidden
            />
            <footer className="relative mt-5">
              <div className="mx-auto w-full max-w-lg rounded-2xl border border-white/20 bg-black/28 px-4 py-3 shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur-md sm:px-5">
              <button
                type="button"
                onClick={() => setContactOpen((prev) => !prev)}
                className="mx-auto inline-flex min-h-[44px] items-center justify-center gap-2 px-2 text-[0.9rem] font-normal uppercase tracking-[0.18em] text-white/90 transition-colors hover:text-white focus:outline-none sm:min-h-[46px] sm:text-[1.05rem] sm:tracking-[0.24em]"
                aria-expanded={contactOpen}
                aria-controls="coming-soon-contact-panel"
              >
                <span>Contact Us</span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: contactOpen ? 45 : 0 }}
                  transition={{ duration: compactMotion ? 0.01 : 0.32, ease: easePremium }}
                  className="inline-block text-[0.98rem] leading-none text-accent/90 sm:text-[1.16rem]"
                >
                  +
                </motion.span>
              </button>

              <motion.div
                id="coming-soon-contact-panel"
                initial={false}
                animate={{
                  opacity: contactOpen ? 1 : 0,
                  y: contactOpen ? 0 : -10,
                }}
                transition={{ duration: compactMotion ? 0.01 : 0.38, ease: easePremium }}
                className={`absolute inset-x-0 top-[calc(100%+0.72rem)] mx-auto w-full max-w-lg overflow-hidden sm:top-[calc(100%+0.9rem)] ${
                  contactOpen ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                <div className="mx-4 rounded-xl border border-white/12 bg-black/20 px-4 py-3 backdrop-blur-sm sm:mx-0 sm:px-5 sm:py-4">
                  <a
                    href="mailto:hello@mutedstudio.ca"
                    className="inline-block py-1 text-[1rem] font-normal tracking-[0.01em] text-white underline decoration-white/35 underline-offset-[0.32em] transition-colors hover:text-accent hover:decoration-accent/50 sm:text-[1.08rem]"
                  >
                    hello@mutedstudio.ca
                  </a>
                  <p className="mx-auto mt-2 max-w-[40ch] text-[0.84rem] font-light leading-relaxed tracking-[0.05em] text-white/68 sm:mt-3 sm:max-w-[42ch] sm:text-[0.9rem] sm:tracking-[0.06em]">
                    We are currently accepting select new client inquiries and project invitations.
                  </p>
                </div>
              </motion.div>
              </div>
            </footer>
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}
