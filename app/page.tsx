import type { Metadata } from 'next'
import { SITE_MODE } from '@/lib/siteMode'
import ComingSoonHome from '@/components/ComingSoonHome'
import HomeFull from '@/components/home/HomeFull'

const fullMetadata: Metadata = {
  title: 'Muted Studio - Architectural Design-Build',
  description:
    'Creating bold, cinematic outdoor environments that balance form and function. Based in Toronto.',
  keywords:
    'architecture, design-build, landscape architecture, outdoor environments, Toronto, modern design',
}

const comingSoonMetadata: Metadata = {
  title: 'Muted Studio — Coming Soon',
  description:
    'A design-build practice shaping refined outdoor environments. Our new digital experience is coming soon.',
  keywords: 'Muted Studio, design-build, landscape architecture, Toronto, outdoor environments',
}

export function generateMetadata(): Metadata {
  return SITE_MODE === 'coming-soon' ? comingSoonMetadata : fullMetadata
}

export default function Home() {
  if (SITE_MODE === 'coming-soon') {
    return <ComingSoonHome />
  }
  return <HomeFull />
}
