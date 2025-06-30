'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface TeamMemberCardProps {
  name: string
  title: string
  description: string
  image?: string
  index: number
}

export default function TeamMemberCard({ name, title, description, image, index }: TeamMemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group"
    >
      <div className="relative border border-border bg-background/50 backdrop-blur-sm p-8 hover:border-accent/30 transition-all duration-300">
        {/* Portrait Image */}
        {image && (
          <div className="relative w-24 h-24 mb-6 overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
        
        {/* Content */}
        <div>
          <h3 className="text-xl font-light tracking-widest uppercase mb-2 group-hover:text-accent transition-colors">
            {name}
          </h3>
          <p className="text-sm text-accent mb-4 tracking-wide">
            {title}
          </p>
          <p className="text-sm text-muted leading-relaxed">
            {description}
          </p>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/20 transition-all duration-500 pointer-events-none" />
      </div>
    </motion.div>
  )
} 