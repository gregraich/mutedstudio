'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import ProjectCard from '@/components/ProjectCard'
import TeamMemberCard from '@/components/TeamMemberCard'
import IntroAnimation from '@/components/IntroAnimation'
import PageTransition from '@/components/PageTransition'
import { useIntro } from '@/lib/IntroContext'

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

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)
  const [fadeOutIntro, setFadeOutIntro] = useState(false)
  const { setShowNav } = useIntro()

  const handleIntroComplete = () => {
    setFadeOutIntro(true)
    // Remove intro from DOM after fade completes
    setTimeout(() => {
      setShowIntro(false)
      // Show navigation after intro is removed
      setTimeout(() => {
        setShowNav(true)
      }, 100)
    }, 500)
  }

  return (
    <SmoothScrollProvider>
      <main className="relative min-h-screen bg-background text-foreground">
        {/* Intro Animation */}
        <IntroAnimation
          showIntro={showIntro}
          fadeOutIntro={fadeOutIntro}
          onComplete={handleIntroComplete}
        />

        {/* Main Content */}
        <PageTransition>
          {/* Hero Section */}
          <section className="relative h-screen">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/muted.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative h-full flex items-center justify-center text-center">
              <div className="max-w-4xl px-8">
                <h1 className="text-display mb-8 tracking-widest uppercase">
                  Architectural Design-Build
                </h1>
                <p className="text-xl tracking-wide">
                  Creating bold, cinematic outdoor environments that balance form and function
                </p>
              </div>
            </div>
          </section>

          {/* Work Section */}
          <section id="work" className="py-32">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.title}
                    title={project.title}
                    description={project.description}
                    status={project.status}
                    images={project.images}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-32 bg-black/50">
            <div className="container mx-auto max-w-6xl">
              <div className="mb-16">
                <h2 className="text-h2 tracking-widest uppercase mb-8">About</h2>
                <p className="text-body mb-8 max-w-3xl">
                  Muted Studio is an architectural design-build practice based in Toronto. We create bold outdoor environments that balance form and function, using precise design language and premium materials.
                </p>
                <p className="text-body max-w-3xl">
                  Our work explores the relationship between built form and natural elements, creating spaces that are both visually striking and deeply functional.
                </p>
              </div>

              {/* Team Section */}
              <div>
                <h3 className="text-h3 tracking-widest uppercase mb-12">Our Team</h3>
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
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-32">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-h2 tracking-widest uppercase mb-8">Contact</h2>
              <form className="space-y-8">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full bg-transparent border border-border p-4 text-foreground placeholder-muted focus:border-accent outline-none transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent border border-border p-4 text-foreground placeholder-muted focus:border-accent outline-none transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Message"
                    rows={6}
                    className="w-full bg-transparent border border-border p-4 text-foreground placeholder-muted focus:border-accent outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-accent text-background tracking-widest uppercase hover:bg-accent/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-16 border-t border-border">
            <div className="container mx-auto text-center text-sm text-muted">
              © {new Date().getFullYear()} Muted Studio. All rights reserved.
            </div>
          </footer>
        </PageTransition>
      </main>
    </SmoothScrollProvider>
  )
}
