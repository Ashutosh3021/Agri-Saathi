"use client"

import { motion } from "framer-motion"
import { Bug, Droplets, MapPinOff } from "lucide-react"
import Image from "next/image"
import { useState, useMemo } from "react"

interface ProblemCard {
  icon: typeof Bug
  title: string
  description: string
  hoverImage: string
}

const problems: ProblemCard[] = [
  {
    icon: Bug,
    title: "Pest Detection is Slow",
    description:
      "By the time an expert arrives, 40% of the crop is already lost. Traditional diagnosis can't keep up with the scale of Indian agriculture.",
    hoverImage: "/images/Gemini_Generated_Image_xsonr7xsonr7xson.png",
  },
  {
    icon: Droplets,
    title: "Soil Health is Invisible",
    description:
      "Farmers have no affordable real-time way to monitor soil NPK, moisture, and temperature. They're farming blind.",
    hoverImage: "/images/Gemini_Generated_Image_ohktpwohktpwohkt.png",
  },
  {
    icon: MapPinOff,
    title: "No Trusted Last Mile",
    description:
      "Solutions exist but never reach the farmer who needs them. The gap between lab and field remains massive.",
    hoverImage: "/images/Gemini_Generated_Image_dffjikdffjikdffj.png",
  },
]

function ProblemCardComponent({ problem, index }: { problem: ProblemCard; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)

  const cardContent = useMemo(() => (
    <>
      {/* Desktop-only hover background image with blur effect */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl hidden lg:block">
        {!imageError && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ 
              opacity: isHovered ? 0.4 : 0,
              scale: isHovered ? 1.02 : 1
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Image
              src={problem.hoverImage}
              alt=""
              fill
              className="object-cover"
              style={{ filter: "blur(0.01rem)" }}
              priority={index < 2}
              onError={() => setImageError(true)}
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          </motion.div>
        )}
        
        {/* Dark overlay for text contrast */}
        <motion.div
          className="absolute inset-0 bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Gradient overlay for better text readability */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <motion.div 
          className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
          animate={{
            backgroundColor: isHovered ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.1)",
            color: isHovered ? "hsl(var(--primary-foreground))" : "hsl(var(--primary))"
          }}
          transition={{ duration: 0.3 }}
        >
          <problem.icon size={24} />
        </motion.div>
        <h3 className="mb-3 text-xl font-semibold text-foreground">{problem.title}</h3>
        <p className="leading-relaxed text-muted-foreground">{problem.description}</p>
      </div>
    </>
  ), [isHovered, imageError, problem, index])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="group relative rounded-2xl border border-border bg-card p-8 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      style={{ willChange: "transform" }}
    >
      {cardContent}
    </motion.div>
  )
}

export function Problem() {
  return (
    <section className="py-24 md:py-32 relative" id="problem">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance md:text-5xl">
            600 Million Farmers. Too Few Solutions.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            India feeds the world, but the farmers who make it possible are underserved by technology.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {problems.map((problem, index) => (
            <ProblemCardComponent key={problem.title} problem={problem} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
