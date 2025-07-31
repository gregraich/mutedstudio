'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationProps {
  showNav: boolean
}

export default function Navigation({ showNav }: NavigationProps) {
  const pathname = usePathname()

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
      className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/20"
    >
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="relative w-[60px] h-[60px]">
            <Image
              src="/mutedlogo.png"
              alt="Muted Studio"
              fill
              className="object-contain"
              priority
            />
          </Link>
          
          <div className="flex gap-12 text-sm tracking-widest uppercase">
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
