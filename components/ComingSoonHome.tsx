'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useIntro } from '@/lib/IntroContext'
import IntroAnimation, { INTRO_EXIT_HANDOFF_MS } from '@/components/IntroAnimation'
import { ComingSoonHeroVideo } from '@/components/ComingSoonHeroVideo'

const easePremium: [number, number, number, number] = [0.16, 1, 0.3, 1]

const noiseDataUri = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")`

export default function ComingSoonHome() {
  const { setShowNav } = useIntro()
  const reduceMotion = useReducedMotion()
  const [showIntro, setShowIntro] = useState(true)
  const [fadeOutIntro, setFadeOutIntro] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)')
    const update = () => setIsSmallScreen(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    setShowNav(false)
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
      <div className="pointer-events-none absolute inset-0 z-0 isolate">
        <ComingSoonHeroVideo />

        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#0a0a0a]/34 to-[#070707]/52 sm:from-black/38 sm:via-[#0a0a0a]/46 sm:to-[#070707]/64"
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/[0.035] sm:bg-black/[0.08]" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_100%_68%_at_50%_0%,rgba(155,180,212,0.1),transparent_56%)] sm:bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(155,180,212,0.18),transparent_58%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 max-sm:block sm:hidden bg-[radial-gradient(ellipse_88%_56%_at_50%_44%,rgba(5,5,5,0.22)_0%,transparent_62%)]"
          aria-hidden
        />
        {!isSmallScreen && (
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_100%,rgba(255,255,255,0.04),transparent_55%)]"
            aria-hidden
          />
        )}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_120%_92%_at_50%_50%,transparent_52%,rgba(0,0,0,0.14)_100%)] sm:bg-[radial-gradient(ellipse_120%_92%_at_50%_50%,transparent_58%,rgba(0,0,0,0.26)_100%)]"
          aria-hidden
        />
        {!isSmallScreen && <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.42)]" aria-hidden />}
        <div
          className="absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-[#070707]/48 via-[#070707]/18 to-transparent sm:h-[42%] sm:from-[#070707]/72 sm:via-[#070707]/32"
          aria-hidden
        />

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
        className="relative z-10 flex min-h-[100svh] flex-1 flex-col px-5 pt-[max(0.85rem,env(safe-area-inset-top))] sm:min-h-[100dvh] sm:px-10 sm:pt-0 lg:px-16"
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
          className="relative isolate flex flex-1 flex-col items-center justify-center py-7 text-center max-sm:-translate-y-[0.5vh] sm:translate-y-0 sm:py-16"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-[2%] bottom-[10%] z-0 max-sm:block sm:hidden"
            aria-hidden
            style={{
              background:
                'radial-gradient(ellipse 96% 78% at 50% 40%, rgba(6,6,6,0.38) 0%, rgba(6,6,6,0.12) 46%, transparent 70%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-[4%] bottom-[8%] z-0 hidden sm:block"
            aria-hidden
            style={{
              background:
                'radial-gradient(ellipse 72% 62% at 50% 44%, rgba(7,7,7,0.52) 0%, rgba(7,7,7,0.2) 48%, transparent 72%)',
            }}
          />
          <div className="relative z-10 flex w-full max-w-[min(100%,21rem)] flex-col items-center px-0 text-center sm:max-w-4xl sm:px-0">
          <motion.div
            initial={compactMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transitionBase}
            className="mb-4 h-px w-11 bg-gradient-to-r from-transparent via-accent/55 to-transparent sm:mb-9 sm:h-px sm:w-20 sm:via-accent/70"
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
            className="max-w-[20ch] font-normal tracking-[0.108em] text-[clamp(1.88rem,7.85vw,2.35rem)] leading-[1.07] text-white [text-shadow:0_1px_18px_rgba(0,0,0,0.35)] sm:max-w-none sm:font-light sm:text-[clamp(1.85rem,8.2vw,4.9rem)] sm:leading-[1.1] sm:tracking-[0.14em] sm:[text-shadow:none]"
          >
            <span className="inline-flex flex-wrap items-center justify-center gap-x-[0.04em]">
              <span>MUT</span>
              <span
                className="inline-flex h-[1lh] shrink-0 items-center justify-center self-center font-normal leading-none text-[#c4beb4] -translate-y-[0.1em] sm:font-light sm:text-[#d8d2c8] sm:-translate-y-[0.11em]"
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
            className="mx-auto mt-5 max-w-[26ch] sm:mt-12 sm:max-w-2xl"
          >
            <p className="text-[clamp(0.9375rem,calc(0.82rem+1.1vw),1.0625rem)] font-light leading-[1.68] tracking-[0.015em] text-white/[0.91] [text-shadow:0_1px_12px_rgba(0,0,0,0.48),0_0_1px_rgba(0,0,0,0.4)] sm:text-[clamp(1.02rem,4.4vw,1.18rem)] sm:leading-[1.78] sm:tracking-[0.05em] sm:text-white/92 sm:[text-shadow:0_2px_14px_rgba(0,0,0,0.52)]">
              A design-build firm that creates refined, thoughtfully curated environments and landscapes.
            </p>
          </motion.div>

          <motion.p
            initial={compactMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transitionBase, delay: stagger * 3 }}
            className={`mt-3 max-w-[24ch] text-balance text-[clamp(0.78125rem,calc(0.68rem+0.85vw),0.84375rem)] font-semibold uppercase leading-[1.55] tracking-[0.155em] text-white/[0.94] sm:mt-10 sm:max-w-3xl sm:text-[clamp(0.97rem,4.1vw,1.28rem)] sm:leading-[1.68] sm:tracking-[0.28em] ${
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

        <div className="relative z-10 mt-9 w-full pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:mt-12 sm:max-w-none sm:pb-[max(2.5rem,env(safe-area-inset-bottom))] lg:mt-14">
          <div className="mx-auto w-full max-w-xl text-center sm:min-h-[220px] lg:min-h-[236px]">
            <div
              className="mx-auto h-px w-12 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-80 sm:mt-0 sm:h-px sm:w-24 sm:via-accent/65 sm:opacity-100"
              aria-hidden
            />
            <footer className="relative mt-3 sm:mt-4">
              <div className="mx-auto w-full max-w-lg sm:transform-gpu sm:rounded-2xl sm:border sm:border-white/[0.07] sm:bg-white/[0.018] sm:px-5 sm:py-3 sm:shadow-[0_8px_32px_rgba(0,0,0,0.1)] sm:backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setContactOpen((prev) => !prev)}
                className="coming-soon-contact-trigger mx-auto inline-flex min-h-[44px] max-sm:w-full max-sm:max-w-[17rem] touch-manipulation items-center justify-center gap-[0.42em] border-0 bg-transparent px-4 py-3 text-[clamp(0.75rem,calc(0.65rem+0.95vw),0.8125rem)] font-medium uppercase tracking-[0.185em] text-white/[0.76] outline-none ring-0 transition-[color,opacity] duration-300 ease-out [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline-none max-sm:hover:text-white/[0.9] max-sm:active:opacity-75 sm:min-h-[46px] sm:w-auto sm:max-w-none sm:px-2 sm:py-0 sm:text-[1.05rem] sm:font-normal sm:tracking-[0.24em] sm:text-white/88 sm:hover:text-inherit sm:active:opacity-90"
                aria-expanded={contactOpen}
                aria-controls="coming-soon-contact-panel"
              >
                <span className="max-sm:border-b max-sm:border-white/[0.09] max-sm:pb-0.5 sm:border-0 sm:pb-0">Contact Us</span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: contactOpen ? 45 : 0, opacity: contactOpen ? 0.88 : 0.55 }}
                  transition={{
                    duration: reduceMotion ? 0.01 : 0.45,
                    ease: easePremium,
                  }}
                  className="inline-block translate-y-[0.04em] text-[clamp(0.71875rem,calc(0.62rem+0.9vw),0.78125rem)] font-light leading-none text-accent/58 sm:translate-y-0 sm:text-[1.16rem] sm:text-accent/85 sm:opacity-100"
                >
                  +
                </motion.span>
              </button>

              <motion.div
                id="coming-soon-contact-panel"
                initial={false}
                animate={{
                  opacity: contactOpen ? 1 : 0,
                  y: contactOpen ? 0 : isSmallScreen ? -3 : -8,
                  scale: contactOpen ? 1 : isSmallScreen ? 1 : 0.985,
                }}
                transition={{
                  duration: reduceMotion ? 0.01 : isSmallScreen ? 0.5 : 0.42,
                  ease: easePremium,
                }}
                style={{ transformOrigin: 'top center' }}
                className={`absolute inset-x-0 top-[calc(100%+0.35rem)] mx-auto w-full max-w-lg overflow-visible sm:overflow-hidden sm:top-[calc(100%+0.9rem)] ${
                  contactOpen ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                <div className="mx-auto max-w-lg max-sm:border-t max-sm:border-white/[0.06] max-sm:pt-3.5 sm:mx-4 sm:rounded-xl sm:border sm:border-white/[0.06] sm:bg-white/[0.025] sm:px-5 sm:py-4 sm:shadow-[0_6px_24px_rgba(0,0,0,0.08)] sm:backdrop-blur-lg">
                  <a
                    href="mailto:hello@mutedstudio.ca"
                    className="coming-soon-contact-mail inline-block py-0.5 text-[clamp(0.9375rem,calc(0.84rem+1.05vw),1.03125rem)] font-normal tracking-[0.035em] text-white/[0.95] underline decoration-white/[0.24] outline-none transition-[color,text-decoration-color] duration-300 [-webkit-tap-highlight-color:transparent] underline-offset-[0.3em] max-sm:decoration-white/[0.2] hover:text-accent hover:decoration-accent/40 focus:outline-none focus-visible:outline-none sm:py-1 sm:text-[1.08rem] sm:tracking-[0.01em] sm:text-white sm:decoration-white/35"
                  >
                    hello@mutedstudio.ca
                  </a>
                  <p className="mx-auto mt-2.5 max-w-[32ch] text-pretty text-[clamp(0.75rem,calc(0.68rem+0.75vw),0.8125rem)] font-light leading-[1.62] tracking-[0.048em] text-white/[0.56] sm:mt-3 sm:max-w-[42ch] sm:text-[0.9rem] sm:tracking-[0.06em] sm:text-white/68">
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
