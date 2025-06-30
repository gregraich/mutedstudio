'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTypewriter } from '@/lib/useTypewriter'

interface IntroAnimationProps {
  showIntro: boolean
  fadeOutIntro: boolean
  onComplete: () => void
}

export default function IntroAnimation({ showIntro, fadeOutIntro, onComplete }: IntroAnimationProps) {
  const { displayText, isComplete } = useTypewriter("Muted Studio", 120)

  // Trigger completion after typewriter finishes
  if (isComplete && showIntro && !fadeOutIntro) {
    setTimeout(() => {
      onComplete()
    }, 1000)
  }

  if (!showIntro) return null

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: fadeOutIntro ? 0.1 : 1, 
            opacity: fadeOutIntro ? 0.3 : 1 
          }}
          transition={{ 
            duration: fadeOutIntro ? 1 : 0.8,
            ease: "easeInOut"
          }}
          className="relative w-[200px] h-[200px] mx-auto mb-8"
        >
          <Image
            src="/mutedlogo.png"
            alt="Muted Studio"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Typewriter Text */}
        <div className="text-2xl font-light tracking-[0.2em] uppercase h-8 flex items-center justify-center">
          <span>
            {displayText}
            {!isComplete && (
              <span className="ml-1 animate-pulse">|</span>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  )
} 