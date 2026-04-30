'use client'

import { useEffect, useRef } from 'react'
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
  const { displayText, isComplete } = useTypewriter('mut:ed studio', 120)
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const exitDuration = reduceMotion ? 0.22 : 1.05
  const exitEase = reduceMotion ? 'easeOut' : easePremium

  useEffect(() => {
    if (!isComplete || !showIntro || fadeOutIntro) return
    completionTimeoutRef.current = setTimeout(() => {
      onComplete()
    }, 1000)

    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current)
      }
    }
  }, [fadeOutIntro, isComplete, onComplete, showIntro])

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
            ? { opacity: 0, y: reduceMotion ? 0 : -12, filter: reduceMotion ? 'blur(0px)' : 'blur(6px)' }
            : { opacity: 1, y: 0, filter: 'blur(0px)' }
        }
        transition={{
          duration: reduceMotion ? 0.18 : 0.85,
          ease: exitEase,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: fadeOutIntro ? (reduceMotion ? 0.96 : 0.88) : 1,
            opacity: fadeOutIntro ? 0 : 1,
          }}
          transition={{
            duration: fadeOutIntro ? (reduceMotion ? 0.2 : 0.9) : 0.8,
            ease: exitEase,
          }}
          className="relative mx-auto mb-8 h-[200px] w-[200px]"
        >
          <Image src="/mutedlogo.png" alt="Muted Studio" fill className="object-contain" priority />
        </motion.div>

        <div className="flex h-8 items-center justify-center text-2xl font-light uppercase tracking-[0.2em]">
          <span className="inline-flex items-center">
            {renderedTypewriterText}
            {!isComplete && <span className="ml-1 animate-pulse">|</span>}
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
