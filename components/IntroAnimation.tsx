'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useTypewriter } from '@/lib/useTypewriter'

/** Match the longest overlay exit before parents unmount the intro. */
export const INTRO_EXIT_HANDOFF_MS = 1100

const easePremium: [number, number, number, number] = [0.16, 1, 0.3, 1]
const easeCinematic: [number, number, number, number] = [0.65, 0, 0.2, 1]

interface IntroAnimationProps {
  showIntro: boolean
  fadeOutIntro: boolean
  onComplete: () => void
}

/**
 * Performance contract:
 * - Animate ONLY `opacity` + `transform` — never `filter`, `letter-spacing`,
 *   `width`, `height`, `top/left`, `box-shadow`, or `text-shadow` (those force
 *   layout/paint per frame and tank FPS on mid/low-end devices).
 * - Glow is rendered as static CSS text-shadow (`.intro-text-glow`) so it
 *   paints once and rides the parent's opacity fade on the compositor.
 * - Every animated element is promoted to its own GPU layer via `translateZ(0)`
 *   + `willChange` while motion is active.
 */
export default function IntroAnimation({ showIntro, fadeOutIntro, onComplete }: IntroAnimationProps) {
  const reduceMotion = useReducedMotion()
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const { displayText, isComplete } = useTypewriter('mut:ed studio', isSmallScreen ? 88 : 120)
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const update = () => setIsSmallScreen(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  const compactMotion = reduceMotion || isSmallScreen
  const exitDuration = compactMotion ? 0.45 : 1.0
  const exitEase = compactMotion ? easePremium : easeCinematic

  useEffect(() => {
    if (!isComplete || !showIntro || fadeOutIntro) return
    completionTimeoutRef.current = setTimeout(() => {
      onComplete()
    }, compactMotion ? 580 : 880)

    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current)
      }
    }
  }, [compactMotion, fadeOutIntro, isComplete, onComplete, showIntro])

  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current)
      }
    }
  }, [])

  const renderedTypewriterText = displayText.split('').map((char, index) => {
    if (char === ':') {
      return (
        <span
          key={`colon-${index}`}
          className="inline-flex h-[1lh] shrink-0 items-center justify-center self-center leading-none -translate-y-[0.11em]"
          aria-hidden
        >
          :
        </span>
      )
    }

    if (char === ' ') {
      return (
        <span key={`space-${index}`} aria-hidden>
          {'\u00A0'}
        </span>
      )
    }

    return <span key={`char-${index}`}>{char}</span>
  })

  if (!showIntro) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOutIntro ? 0 : 1 }}
      transition={{ duration: exitDuration, ease: exitEase }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black px-5 sm:px-8"
      style={{
        pointerEvents: fadeOutIntro ? 'none' : 'auto',
        willChange: 'opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      {!compactMotion && (
        <>
          {/* Cinematic letterbox — slides off-screen on exit. Solid blocks
              (no gradient = cheaper paint), translate-only animation. */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-[30vh] bg-black"
            initial={{ y: 0 }}
            animate={{ y: fadeOutIntro ? '-100%' : 0 }}
            transition={{ duration: 0.95, ease: easeCinematic }}
            style={{ willChange: 'transform' }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[30vh] bg-black"
            initial={{ y: 0 }}
            animate={{ y: fadeOutIntro ? '100%' : 0 }}
            transition={{ duration: 0.95, ease: easeCinematic }}
            style={{ willChange: 'transform' }}
            aria-hidden
          />
        </>
      )}

      <motion.div
        className="relative z-10 text-center"
        animate={
          fadeOutIntro
            ? {
                opacity: 0,
                y: compactMotion ? -4 : -18,
                scale: compactMotion ? 0.98 : 0.92,
              }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{
          duration: compactMotion ? 0.4 : 0.9,
          ease: exitEase,
        }}
        style={{
          willChange: 'transform, opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{
            scale: fadeOutIntro ? (compactMotion ? 0.96 : 1.08) : 1,
            opacity: fadeOutIntro ? 0 : 1,
          }}
          transition={{
            duration: fadeOutIntro ? (compactMotion ? 0.35 : 0.92) : compactMotion ? 0.5 : 0.75,
            ease: exitEase,
          }}
          className="relative mx-auto mb-6 h-[148px] w-[148px] sm:mb-8 sm:h-[200px] sm:w-[200px]"
          style={{
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
        >
          <Image
            src="/mutedlogo.png"
            alt="Muted Studio"
            fill
            sizes="(min-width: 640px) 200px, 148px"
            className="object-contain"
            priority
          />
        </motion.div>

        <div className="flex min-h-[2.1rem] max-w-[calc(100vw-2.5rem)] items-center justify-center text-[1.22rem] font-light uppercase tracking-[0.15em] sm:h-8 sm:max-w-none sm:text-2xl sm:tracking-[0.2em]">
          <span className="intro-text-glow inline-flex items-center text-white">
            {renderedTypewriterText}
            {!isComplete && <span className="ml-1 animate-pulse">|</span>}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
