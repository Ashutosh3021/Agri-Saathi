"use client"

import { motion } from "framer-motion"
import { Bug, Droplets, MapPinOff } from "lucide-react"

const problems = [
  {
    icon: Bug,
    title: "Pest Detection is Slow",
    description:
      "By the time an expert arrives, 40% of the crop is already lost. Traditional diagnosis can't keep up with the scale of Indian agriculture.",
  },
  {
    icon: Droplets,
    title: "Soil Health is Invisible",
    description:
      "Farmers have no affordable real-time way to monitor soil NPK, moisture, and temperature. They're farming blind.",
  },
  {
    icon: MapPinOff,
    title: "No Trusted Last Mile",
    description:
      "Solutions exist but never reach the farmer who needs them. The gap between lab and field remains massive.",
  },
]

export function Problem() {
  return (
    <section className="py-24 md:py-32" id="problem">
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
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <problem.icon size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">{problem.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
