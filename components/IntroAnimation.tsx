'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useTypewriter } from '@/lib/useTypewriter'

/** Match overlay fade + handoff in parents’ setTimeout before unmounting intro */
export const INTRO_EXIT_HANDOFF_MS = 1050

const easePremium: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface IntroAnimationProps {
  showIntro: boolean
  fadeOutIntro: boolean
  onComplete: () => void
}

export default function IntroAnimation({ showIntro, fadeOutIntro, onComplete }: IntroAnimationProps) {
  const reduceMotion = useReducedMotion()
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const { displayText, isComplete } = useTypewriter('mut:ed studio', 120)
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const update = () => setIsSmallScreen(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  const compactMotion = reduceMotion || isSmallScreen
  const exitDuration = compactMotion ? 0.28 : 1.05
  const exitEase = compactMotion ? 'easeOut' : easePremium

  useEffect(() => {
    if (!isComplete || !showIntro || fadeOutIntro) return
    completionTimeoutRef.current = setTimeout(() => {
      onComplete()
    }, compactMotion ? 620 : 1000)

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
      animate={{
        opacity: fadeOutIntro ? 0 : 1,
      }}
      transition={{
        duration: exitDuration,
        ease: exitEase,
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      style={{ willChange: fadeOutIntro ? 'opacity' : 'auto' }}
    >
      <motion.div
        className="text-center"
        animate={
          fadeOutIntro
            ? { opacity: 0, y: compactMotion ? -6 : -12, filter: compactMotion ? 'none' : 'blur(6px)' }
            : { opacity: 1, y: 0, filter: compactMotion ? 'none' : 'blur(0px)' }
        }
        transition={{
          duration: compactMotion ? 0.22 : 0.85,
          ease: exitEase,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: fadeOutIntro ? (compactMotion ? 0.95 : 0.88) : 1,
            opacity: fadeOutIntro ? 0 : 1,
          }}
          transition={{
            duration: fadeOutIntro ? (compactMotion ? 0.24 : 0.9) : compactMotion ? 0.55 : 0.8,
            ease: exitEase,
          }}
          className="relative mx-auto mb-7 h-[156px] w-[156px] sm:mb-8 sm:h-[200px] sm:w-[200px]"
        >
          <Image src="/mutedlogo.png" alt="Muted Studio" fill className="object-contain" priority />
        </motion.div>

        <div className="flex min-h-[2.1rem] items-center justify-center text-[1.3rem] font-light uppercase tracking-[0.17em] sm:h-8 sm:text-2xl sm:tracking-[0.2em]">
          <span className="inline-flex items-center">
            {renderedTypewriterText}
            {!isComplete && <span className="ml-1 animate-pulse">|</span>}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
