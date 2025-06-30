'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import PageTransition from '@/components/PageTransition'

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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <PageTransition>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-background pt-32"
      >
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-16">
            <h1 className="text-display tracking-widest uppercase mb-8">Contact</h1>
            <p className="text-xl text-muted max-w-2xl">
              Ready to transform your outdoor space? Let's discuss your vision and explore how we can bring it to life.
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="block text-sm tracking-wider uppercase mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-border p-4 text-foreground placeholder-muted focus:border-accent outline-none transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm tracking-wider uppercase mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-border p-4 text-foreground placeholder-muted focus:border-accent outline-none transition-colors"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm tracking-wider uppercase mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={8}
                className="w-full bg-transparent border border-border p-4 text-foreground placeholder-muted focus:border-accent outline-none transition-colors resize-none"
                placeholder="Tell us about your project..."
                required
              />
            </div>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-accent text-background tracking-widest uppercase hover:bg-accent/90 transition-colors"
            >
              Send Message
            </motion.button>
          </motion.form>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="mt-16 pt-16 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg tracking-wider uppercase mb-4">Location</h3>
                <p className="text-muted">Toronto, Ontario<br />Canada</p>
              </div>
              <div>
                <h3 className="text-lg tracking-wider uppercase mb-4">Email</h3>
                <p className="text-muted">hello@mutedstudio.com</p>
              </div>
              <div>
                <h3 className="text-lg tracking-wider uppercase mb-4">Phone</h3>
                <p className="text-muted">+1 (416) 555-0123</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PageTransition>
  )
} 