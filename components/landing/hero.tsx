"use client"

import { motion } from "framer-motion"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Stats {
  farmersHelped: number
  diseasesDetected: number
  volunteers: number
  accuracy: number
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-3xl font-bold text-primary md:text-4xl"
    >
      {value.toLocaleString()}
      {suffix}
    </motion.span>
  )
}

export function Hero() {
  // BACKEND_CONNECTION: Fetch live stats from /api/stats — connect to Supabase
  const { data } = useSWR<Stats>("/api/stats", fetcher, {
    refreshInterval: 30000,
  })

  const statItems = [
    { label: "Farmers Helped", value: data?.farmersHelped ?? 0, suffix: "" },
    { label: "Diseases Detected", value: data?.diseasesDetected ?? 0, suffix: "" },
    { label: "Volunteers Active", value: data?.volunteers ?? 0, suffix: "" },
    { label: "Accuracy Rate", value: data?.accuracy ?? 0, suffix: "%" },
  ]

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-secondary/15 blur-3xl"
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5"
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-medium tracking-wide text-primary uppercase">
              LIVE DATA
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-6xl lg:text-7xl"
          >
            AI-Powered Crop Intelligence for Every Indian Farmer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Detect diseases in seconds. Know your soil. Grow smarter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="#how-it-works"
              className="rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:brightness-110"
            >
              See How It Works
            </a>
            <a
              href="#demo"
              className="rounded-lg border border-border bg-transparent px-8 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Watch Demo
            </a>
          </motion.div>

          {/* Stats counters */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 grid w-full max-w-3xl grid-cols-2 gap-8 md:grid-cols-4"
          >
            {statItems.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
