'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProjectImage {
  src: string
  alt: string
}

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  status: string
  images: ProjectImage[]
  initialImageIndex?: number
}

export default function ProjectModal({
  isOpen,
  onClose,
  title,
  description,
  status,
  images,
  initialImageIndex = 0
}: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative h-full flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full max-h-full overflow-hidden bg-background border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-light tracking-widest uppercase mb-2">{title}</h2>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 text-xs tracking-wider uppercase ${
                        status === 'Completed' ? 'bg-green-900/20 text-green-400 border border-green-400/30' :
                        status === 'Under Construction' ? 'bg-yellow-900/20 text-yellow-400 border border-yellow-400/30' :
                        'bg-blue-900/20 text-blue-400 border border-blue-400/30'
                      }`}>
                        {status}
                      </span>
                      <span className="text-sm text-muted">{currentImageIndex + 1} / {images.length}</span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-border/50 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Image Container */}
              <div className="relative h-full pt-24">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={images[currentImageIndex].src}
                      alt={images[currentImageIndex].alt}
                      fill
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 backdrop-blur-sm border border-border hover:bg-border/50 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 backdrop-blur-sm border border-border hover:bg-border/50 transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border p-6">
                <p className="text-body text-muted max-w-2xl">{description}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 