"use client"

import { motion } from "framer-motion"
import { Play, MessageSquare, Coins, Sprout } from "lucide-react"

const scenarios = [
  {
    icon: MessageSquare,
    title: "Farmer sends diseased leaf photo on WhatsApp",
    description:
      "Simply capture a photo of the affected leaf and send it via WhatsApp. Our AI identifies the disease and responds with a treatment plan.",
  },
  {
    icon: Coins,
    title: "Volunteer earns coins after drone scan",
    description:
      "Volunteers complete aerial scans of farms using our IoT drones and earn reward coins for every mission completed.",
  },
  {
    icon: Sprout,
    title: "Soil device recommends best crop for the season",
    description:
      "Our IoT soil sensor analyzes NPK levels, moisture, and temperature to recommend the optimal crop for maximum yield.",
  },
]

export function Demo() {
  return (
    <section className="py-24 md:py-32" id="demo">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance md:text-5xl">
            See It In Action
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Watch how Agri Sathi transforms crop management in real time.
          </p>
        </motion.div>

        {/* Video placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-12 max-w-4xl"
        >
          {/* BACKEND_CONNECTION: Replace with actual demo video URL */}
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-foreground/5">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <button
                type="button"
                className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:scale-110 hover:shadow-2xl hover:shadow-primary/30"
                aria-label="Play demo video"
              >
                <Play size={32} className="ml-1" />
              </button>
              <span className="text-sm font-medium text-muted-foreground">
                Watch the 2-minute demo
              </span>
            </div>
            {/* Decorative grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>
        </motion.div>

        {/* Scenario cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <scenario.icon size={20} />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">{scenario.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {scenario.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
