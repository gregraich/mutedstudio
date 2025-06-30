'use client'

import { motion } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

const testimonials = [
  {
    name: "Sarah Chen",
    title: "Residential Client",
    project: "Stone Garden",
    content: "Muted Studio transformed our backyard into a breathtaking outdoor sanctuary. Their attention to detail and understanding of our vision exceeded all expectations. The stone garden they created is not just beautiful—it's a place where our family gathers daily.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    title: "Commercial Property Owner",
    project: "Conversation Pit",
    content: "Working with Muted Studio was a revelation. They took our corporate courtyard from functional to phenomenal. The conversation pit has become the heart of our outdoor meetings and employee gatherings. Their design-build approach ensured seamless execution.",
    rating: 5
  },
  {
    name: "Jennifer Walsh",
    title: "Luxury Homeowner",
    project: "Pool House",
    content: "The pool house Muted Studio designed for us is nothing short of architectural poetry. Every element feels intentional and refined. They managed to create a space that's both modern and timeless, perfectly complementing our home's aesthetic.",
    rating: 5
  },
  {
    name: "David Thompson",
    title: "Landscape Enthusiast",
    project: "Terraced Garden",
    content: "As someone who appreciates both form and function, I was blown away by Muted Studio's terraced garden design. The way they integrated water features with geometric plantings creates a dynamic, ever-changing landscape that's both beautiful and sustainable.",
    rating: 5
  },
  {
    name: "Lisa Park",
    title: "Interior Designer",
    project: "Courtyard",
    content: "Collaborating with Muted Studio on our courtyard project was a dream. Their understanding of spatial relationships and material selection perfectly complemented our interior design work. The result is a seamless indoor-outdoor experience.",
    rating: 5
  },
  {
    name: "Robert Kim",
    title: "Architecture Collector",
    project: "Multiple Projects",
    content: "I've worked with many architectural firms, but Muted Studio stands apart. Their ability to balance bold design statements with practical functionality is remarkable. Each project they've completed for us has exceeded our expectations and become a conversation piece.",
    rating: 5
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-accent">
          ★
        </span>
      ))}
    </div>
  )
}

export default function TestimonialsPage() {
  return (
    <PageTransition>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-background pt-32"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-16">
            <h1 className="text-display tracking-widest uppercase mb-8">Testimonials</h1>
            <p className="text-xl text-muted max-w-2xl">
              Hear from our clients about their experiences working with Muted Studio and the transformative impact of our designs.
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.name} 
                variants={itemVariants}
                className="border border-border p-8 hover:border-accent/50 transition-colors duration-300"
              >
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>
                
                <blockquote className="text-body mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="border-t border-border pt-4">
                  <div className="font-medium tracking-wide uppercase text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-muted text-sm mb-1">
                    {testimonial.title}
                  </div>
                  <div className="text-accent text-xs tracking-wider uppercase">
                    {testimonial.project}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="mt-16 pt-16 border-t border-border text-center">
            <h2 className="text-h2 tracking-widest uppercase mb-4">Ready to Start Your Project?</h2>
            <p className="text-muted mb-8 max-w-2xl mx-auto">
              Join our satisfied clients and experience the Muted Studio difference. Let's create something extraordinary together.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block px-8 py-4 bg-accent text-background tracking-widest uppercase hover:bg-accent/90 transition-colors"
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </PageTransition>
  )
} 