'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis smooth scroll with enhanced settings
    lenisRef.current = new Lenis({
      duration: 1.4, // Slightly longer duration for more fluid motion
      easing: (t: number) => {
        // Custom easing function for more natural, architectural feel
        return 1 - Math.pow(2, -10 * t)
      },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8, // Reduced for more controlled scrolling
      touchMultiplier: 1.5, // Balanced touch sensitivity
      infinite: false,
      // Enhanced settings for better performance
      lerp: 0.1, // Linear interpolation for smoother motion
      touchInertiaMultiplier: 50,
    })

    // RAF loop for Lenis with enhanced performance
    function raf(time: number) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Add scroll event listener for potential section snapping
    const handleScroll = (e: any) => {
      // You can add section snapping logic here if needed
      // For now, we'll keep it smooth and fluid
    }

    lenisRef.current.on('scroll', handleScroll)

    // Cleanup
    return () => {
      lenisRef.current?.off('scroll', handleScroll)
      lenisRef.current?.destroy()
    }
  }, [])

  return <>{children}</>
} 