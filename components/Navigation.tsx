'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE_MODE } from '@/lib/siteMode'

interface NavigationProps {
  showNav: boolean
}

export default function Navigation({ showNav }: NavigationProps) {
  const pathname = usePathname()
  const isComingSoonHome = SITE_MODE === 'coming-soon' && pathname === '/'

  if (isComingSoonHome) {
    return null
  }

  const navItems = [
    { href: '/work', label: 'Work' },
    { href: '/about', label: 'About' },
    { href: '/testimonials', label: 'Testimonials' },
    { href: '/consultation', label: 'Design/Build Consultation' },
    { href: '/contact', label: 'Contact' }
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: showNav ? 1 : 0, 
        y: showNav ? 0 : -20 
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 border-b border-border/20 bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between" aria-label="Primary">
          <Link href="/" className="relative block h-[52px] w-[52px] sm:h-[56px] sm:w-[56px]">
            <Image
              src="/mutedlogo.png"
              alt="Muted Studio"
              fill
              className="object-contain"
              priority
            />
          </Link>

          <div className="flex flex-wrap justify-end gap-x-10 gap-y-3 text-sm tracking-widest uppercase lg:gap-x-12">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hover:text-accent transition-colors duration-300 ${
                  pathname === item.href ? 'text-accent' : 'text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </motion.header>
  )
} 
