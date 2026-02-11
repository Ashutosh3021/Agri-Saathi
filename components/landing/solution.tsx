"use client"

import { motion } from "framer-motion"
import { MessageSquare, Plane, Brain, ArrowRight } from "lucide-react"

const columns = [
  {
    icon: MessageSquare,
    role: "FARMER",
    color: "bg-primary/10 text-primary",
    steps: ["WhatsApp message", "Sends crop photo", "Gets instant diagnosis"],
    description:
      "Any farmer with a phone can send a crop photo on WhatsApp and receive a diagnosis in under 30 seconds.",
  },
  {
    icon: Plane,
    role: "VOLUNTEER",
    color: "bg-secondary/10 text-secondary",
    steps: ["Drone deployed", "Scans the field", "Earns reward coins"],
    description:
      "Local volunteers carry IoT-equipped drones to scan farms, earning crypto-style reward coins for every mission.",
  },
  {
    icon: Brain,
    role: "SYSTEM",
    color: "bg-chart-4/10 text-chart-4",
    steps: ["ML model processes", "Cross-references data", "Sends recommendation"],
    description:
      "Our machine learning pipeline processes images and soil data to produce actionable, localized recommendations.",
  },
]

export function Solution() {
  return (
    <section className="bg-muted/50 py-24 md:py-32" id="solution">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance md:text-5xl">
            One Platform. Three Layers of Intelligence.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A seamless pipeline from farm photo to actionable fix.
          </p>
        </motion.div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {columns.map((col, index) => (
            <motion.div
              key={col.role}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative flex flex-col items-center text-center"
            >
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${col.color}`}
              >
                <col.icon size={28} />
              </div>

              <span className="mb-4 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                {col.role}
              </span>

              <div className="mb-6 flex flex-col gap-3">
                {col.steps.map((step, stepIndex) => (
                  <div key={step} className="flex items-center justify-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {stepIndex + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{step}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">{col.description}</p>

              {/* Arrow connector (hidden on mobile, shown between columns on desktop) */}
              {index < columns.length - 1 && (
                <div className="absolute top-20 -right-4 hidden text-muted-foreground/30 md:block">
                  <ArrowRight size={24} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
