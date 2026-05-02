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
    <main className="relative flex min-h-[100svh] flex-col bg-[#070707] text-foreground overflow-hidden sm:min-h-[100dvh]">
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
              className={`h-full w-full object-cover object-[50%_44%] transition-opacity duration-700 sm:object-center ${
                isSmallScreen ? 'scale-100 contrast-100 saturate-100' : 'scale-[1.03] contrast-[1.05] saturate-[1.04]'
              } ${
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
        className="relative z-10 flex min-h-[100svh] flex-1 flex-col px-4 pt-[max(0.85rem,env(safe-area-inset-top))] sm:min-h-[100dvh] sm:px-10 sm:pt-0 lg:px-16"
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
          className="relative isolate flex flex-1 flex-col items-center justify-center py-8 text-center sm:py-16"
        >
          <div
            className="pointer-events-none absolute inset-x-[-2%] top-[0%] bottom-[2%] z-0 sm:inset-x-0 sm:top-[4%] sm:bottom-[8%]"
            aria-hidden
            style={{
              background: isSmallScreen
                ? 'radial-gradient(ellipse 78% 68% at 50% 42%, rgba(7,7,7,0.58) 0%, rgba(7,7,7,0.24) 50%, transparent 74%)'
                : 'radial-gradient(ellipse 72% 62% at 50% 44%, rgba(7,7,7,0.52) 0%, rgba(7,7,7,0.2) 48%, transparent 72%)',
            }}
          />
          <div className="relative z-10 flex w-full max-w-[min(100%,36rem)] flex-col items-center px-1 text-center sm:max-w-4xl sm:px-0">
          <motion.div
            initial={compactMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transitionBase}
            className="mb-5 h-px w-16 bg-gradient-to-r from-transparent via-accent/70 to-transparent sm:mb-9 sm:w-20"
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
            className="max-w-[22ch] font-light tracking-[0.095em] text-[clamp(1.85rem,8.2vw,4.9rem)] leading-[1.1] text-white sm:max-w-none sm:tracking-[0.14em]"
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
            className="mx-auto mt-7 max-w-[min(100%,38ch)] sm:mt-12 sm:max-w-2xl"
          >
            <p className="text-[clamp(1.02rem,4.4vw,1.18rem)] font-light leading-[1.78] tracking-[0.032em] text-white/92 [text-shadow:0_2px_14px_rgba(0,0,0,0.52)] sm:tracking-[0.05em]">
              A design-build firm that creates refined, thoughtfully curated environments and landscapes.
            </p>
          </motion.div>

          <motion.p
            initial={compactMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitionBase, delay: stagger * 3 }}
            className={`mt-6 max-w-[min(100%,33ch)] text-[clamp(0.97rem,4.1vw,1.28rem)] font-semibold uppercase leading-[1.68] tracking-[0.14em] text-white sm:mt-10 sm:max-w-3xl sm:tracking-[0.28em] ${
              reduceMotion
                ? '[text-shadow:0_2px_12px_rgba(0,0,0,0.55)]'
                : compactMotion
                  ? 'coming-soon-tagline-illume-static'
                  : 'coming-soon-tagline-illume'
            }`}
          >
            Our new digital experience is coming soon.
          </motion.p>
          </div>

        <div className="relative z-10 mt-8 w-full max-sm:max-w-[min(100%,22rem)] pb-[max(2.25rem,env(safe-area-inset-bottom))] sm:mt-12 sm:max-w-none sm:pb-[max(2.5rem,env(safe-area-inset-bottom))] lg:mt-14">
          <div className="mx-auto min-h-[200px] w-full max-w-xl text-center sm:min-h-[220px] lg:min-h-[236px]">
            <div
              className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-accent/65 to-transparent sm:w-24"
              aria-hidden
            />
            <footer className="relative mt-3 sm:mt-4">
              <div className="mx-auto w-full max-w-lg transform-gpu rounded-2xl border border-white/[0.07] bg-[rgba(7,7,7,0.42)] px-3 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-md sm:bg-white/[0.018] sm:px-5 sm:py-3 sm:backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setContactOpen((prev) => !prev)}
                className="coming-soon-contact-trigger mx-auto inline-flex min-h-[48px] w-full max-w-full touch-manipulation items-center justify-center gap-2.5 px-3 text-[0.88rem] font-normal uppercase tracking-[0.16em] text-white/88 outline-none ring-0 transition-[color,opacity] duration-300 ease-out [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline-none active:opacity-90 sm:min-h-[46px] sm:w-auto sm:max-w-none sm:px-2 sm:text-[1.05rem] sm:tracking-[0.24em]"
                aria-expanded={contactOpen}
                aria-controls="coming-soon-contact-panel"
              >
                <span>Contact Us</span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: contactOpen ? 45 : 0, opacity: contactOpen ? 0.92 : 1 }}
                  transition={{
                    duration: reduceMotion ? 0.01 : 0.45,
                    ease: easePremium,
                  }}
                  className="inline-block text-[0.98rem] leading-none text-accent/85 sm:text-[1.16rem]"
                >
                  +
                </motion.span>
              </button>

              <motion.div
                id="coming-soon-contact-panel"
                initial={false}
                animate={{
                  opacity: contactOpen ? 1 : 0,
                  y: contactOpen ? 0 : -8,
                  scale: contactOpen ? 1 : 0.985,
                }}
                transition={{
                  duration: reduceMotion ? 0.01 : 0.42,
                  ease: easePremium,
                }}
                style={{ transformOrigin: 'top center' }}
                className={`absolute inset-x-0 top-[calc(100%+0.72rem)] mx-auto w-full max-w-lg overflow-hidden sm:top-[calc(100%+0.9rem)] ${
                  contactOpen ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                <div className="mx-4 transform-gpu rounded-xl border border-white/[0.06] bg-[rgba(7,7,7,0.48)] px-4 py-3 shadow-[0_6px_24px_rgba(0,0,0,0.08)] backdrop-blur-md sm:bg-white/[0.025] sm:backdrop-blur-lg sm:mx-0 sm:px-5 sm:py-4">
                  <a
                    href="mailto:hello@mutedstudio.ca"
                    className="coming-soon-contact-mail inline-block py-1 text-[1rem] font-normal tracking-[0.01em] text-white underline decoration-white/35 underline-offset-[0.32em] outline-none transition-colors [-webkit-tap-highlight-color:transparent] hover:text-accent hover:decoration-accent/50 focus:outline-none focus-visible:outline-none sm:text-[1.08rem]"
                  >
                    hello@mutedstudio.ca
                  </a>
                  <p className="mx-auto mt-2 max-w-[40ch] text-pretty text-[0.84rem] font-light leading-relaxed tracking-[0.05em] text-white/68 sm:mt-3 sm:max-w-[42ch] sm:text-[0.9rem] sm:tracking-[0.06em]">
                    We are currently accepting select new client inquiries and project invitations.
                  </p>
                </div>
              </motion.div>
              </div>
            </footer>
          </div>
        </div>
        </div>
      </motion.div>
    </main>
  )
}
