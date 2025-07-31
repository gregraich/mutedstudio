'use client'

import { motion } from 'framer-motion'
import PageTransition from '@/components/PageTransition'

const testimonials = [
  {
    name: "Sarah C",
    title: "Residential Client",
    project: "Stone Garden",
    content: "Fion as a designer really knows how to make a space feel like home. She is so easy to work with and always has a solution to any problem. I would highly recommend her to anyone looking for a landscape architect.",
    rating: 5
  },
  {
    name: "Michael R",
    title: "Commercial Client",
    project: "Conversation Pit",
    content: "Alex and Greg are a dream team. They are so easy to work with and always have a solution to any problem. They are also very responsive and always willing to help. I would highly recommend them to anyone looking for a proper team.",
    rating: 5
  },
  {
    name: "Jennifer W",
    title: "Residential Client",
    project: "Full front and back yard renovation",
    content: "Muted Studio really blew it out of the park with the pool house. It is so much more than a backyard, it is a space that we can use for so many different things. The design is so thoughtful and the attention to detail is unmatched.I recommend them to anyone looking for professional results!.",
    rating: 5
  },
  {
    name: "David T",
    title: "Residential Client",
    project: "Terraced Garden",
    content: "Im very picky, and have gone through a lot of landscape architects. Muted Studio is the best I have worked with. They are so easy to work with and always have a solution to any problem. I would highly recommend them to anyone looking for a professional job done right.",
    rating: 5
  },
  {
    name: "Lisa P",
    title: "Residential Client",
    project: "Full outdoor reconstruction",
    content: "The way they transformed our backyard is amazing. They are so easy to work with and always have a solution to any problem. I would highly recommend them to anyone looking for an amazing team.",
    rating: 5
  },
  {
    name: "Robert K",
    title: "Residential Client",
    project: "Multiple Projects",
    content: "I've worked with many Design and Build firms, but Muted Studio stands out alot. Every project they have done for me has been a success. They are so easy to work with and always have a solution to any problem. I would highly recommend them to anyone looking for a great team.",
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