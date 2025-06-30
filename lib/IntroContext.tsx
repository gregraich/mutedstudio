'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface IntroContextType {
  showNav: boolean
  setShowNav: (show: boolean) => void
}

const IntroContext = createContext<IntroContextType | undefined>(undefined)

export function IntroProvider({ children }: { children: ReactNode }) {
  const [showNav, setShowNav] = useState(false)

  return (
    <IntroContext.Provider value={{ showNav, setShowNav }}>
      {children}
    </IntroContext.Provider>
  )
}

export function useIntro() {
  const context = useContext(IntroContext)
  if (context === undefined) {
    throw new Error('useIntro must be used within an IntroProvider')
  }
  return context
} 