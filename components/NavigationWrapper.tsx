'use client'

import { useIntro } from '@/lib/IntroContext'
import Navigation from './Navigation'

export default function NavigationWrapper() {
  const { showNav } = useIntro()
  
  return <Navigation showNav={showNav} />
} 