'use client'

import { motion } from 'framer-motion'
import TeamMemberCard from '@/components/TeamMemberCard'
import PageTransition from '@/components/PageTransition'

// Team data
const teamMembers = [
  {
    name: "Engineering Partner",
    title: "Structural Engineer",
    description: "Holds an engineering degree from Queen's University, bringing a strong foundation of structural knowledge and technical precision to every project.",
    image: "/team-engineer.jpg"
  },
  {
    name: "Lead Architect",
    title: "Design Director",
    description: "Earned her doctorate in architecture from the University of Toronto, grounding our design ethos in academic excellence and spatial innovation.",
    image: "/team-architect.jpg"
  },
  {
    name: "Creative Technologist",
    title: "Digital Experience Lead",
    description: "Specializing in visual design, 3D rendering, and digital experience, contributing forward-thinking visuals and project previews.",
    image: "/team-technologist.jpg"
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

export default function AboutPage() {
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
            <h1 className="text-display tracking-widest uppercase mb-8">About</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <p className="text-body mb-8">
                  Muted Studio is an architectural design-build practice based in Toronto. We create bold outdoor environments that balance form and function, using precise design language and premium materials.
                </p>
                <p className="text-body">
                  Our work explores the relationship between built form and natural elements, creating spaces that are both visually striking and deeply functional.
                </p>
              </div>
              <div>
                <p className="text-body mb-8">
                  We believe in the power of thoughtful design to transform outdoor spaces into meaningful experiences. Every project begins with a deep understanding of context, climate, and client vision.
                </p>
                <p className="text-body">
                  Through collaboration with skilled craftspeople and careful material selection, we bring our architectural vision to life with uncompromising attention to detail.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div variants={itemVariants}>
            <h2 className="text-h2 tracking-widest uppercase mb-12">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <TeamMemberCard
                  key={member.name}
                  name={member.name}
                  title={member.title}
                  description={member.description}
                  image={member.image}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PageTransition>
  )
} 