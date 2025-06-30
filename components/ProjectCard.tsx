'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import ProjectModal from './ProjectModal'

interface ProjectImage {
  src: string
  alt: string
}

interface ProjectCardProps {
  title: string
  description: string
  status: 'Completed' | 'Under Construction' | 'Coming Soon'
  images: ProjectImage[]
  index: number
}

export default function ProjectCard({ title, description, status, images, index }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-900/20 text-green-400 border-green-400/30'
      case 'Under Construction':
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-400/30'
      case 'Coming Soon':
        return 'bg-blue-900/20 text-blue-400 border-blue-400/30'
      default:
        return 'bg-muted/20 text-muted border-border'
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <motion.div
          whileHover={{ 
            y: -8,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          className="relative overflow-hidden border border-border bg-background transition-all duration-300 group-hover:border-accent/50 group-hover:shadow-2xl group-hover:shadow-accent/10"
        >
          {/* Image */}
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 text-xs tracking-wider uppercase border ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>

            {/* Image Count Badge */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4">
                <span className="px-2 py-1 text-xs bg-background/80 backdrop-blur-sm border border-border">
                  {images.length} photos
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-light tracking-widest uppercase mb-3 group-hover:text-accent transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {description}
            </p>
            
            {/* Hover Indicator */}
            <div className="mt-4 flex items-center gap-2 text-xs text-muted group-hover:text-accent transition-colors">
              <span>View Project</span>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        description={description}
        status={status}
        images={images}
      />
    </>
  )
} 