'use client'

import { motion } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import PageTransition from '@/components/PageTransition'

// Project data with status and multiple images
const projects = [
  {
    title: "Stone Garden",
    description: "A massed stone garden balancing slope and softness, creating a harmonious blend of natural elements and architectural precision.",
    status: "Completed" as const,
    images: [
      { src: "/res1.png", alt: "A massed stone garden balancing slope and softness" },
      { src: "/res1.png", alt: "Stone garden detail view" },
      { src: "/res1.png", alt: "Stone garden overview" }
    ]
  },
  {
    title: "Conversation Pit",
    description: "A sunken conversation pit surrounded by corten steel and structured plantings, designed for intimate gatherings and contemplation.",
    status: "Under Construction" as const,
    images: [
      { src: "/res2.png", alt: "A sunken conversation pit surrounded by corten steel and structured plantings" },
      { src: "/res2.png", alt: "Conversation pit construction progress" }
    ]
  },
  {
    title: "Pool House",
    description: "A geometric pool house with cantilevered concrete planes, embodying modern architectural principles and functional elegance.",
    status: "Completed" as const,
    images: [
      { src: "/res3.png", alt: "A geometric pool house with cantilevered concrete planes" },
      { src: "/res3.png", alt: "Pool house interior view" },
      { src: "/res3.png", alt: "Pool house exterior detail" }
    ]
  },
  {
    title: "Courtyard",
    description: "A minimalist courtyard with rhythmic stone pavers and sculptural plantings, creating a serene outdoor living space.",
    status: "Coming Soon" as const,
    images: [
      { src: "/res4.png", alt: "A minimalist courtyard with rhythmic stone pavers and sculptural plantings" }
    ]
  },
  {
    title: "Terraced Garden",
    description: "A terraced garden with cascading water features and geometric plantings, demonstrating the integration of natural and built elements.",
    status: "Under Construction" as const,
    images: [
      { src: "/res5.png", alt: "A terraced garden with cascading water features and geometric plantings" },
      { src: "/res5.png", alt: "Terraced garden construction phase" }
    ]
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

export default function WorkPage() {
  return (
    <PageTransition>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-background pt-32"
      >
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-16">
            <h1 className="text-display tracking-widest uppercase mb-4">Our Work</h1>
            <p className="text-xl text-muted max-w-2xl">
              Exploring the intersection of architectural precision and natural elements through bold, cinematic outdoor environments.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            {projects.map((project, index) => (
              <motion.div key={project.title} variants={itemVariants}>
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  status={project.status}
                  images={project.images}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </PageTransition>
  )
} 