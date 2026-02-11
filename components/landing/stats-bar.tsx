"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Stats {
  scansToday: number
  accuracy: number
  districts: number
  volunteers: number
}

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start || end === 0) return

    let startTime: number | null = null
    let raf: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))

      if (progress < 1) {
        raf = requestAnimationFrame(animate)
      }
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [end, duration, start])

  return count
}

function StatCounter({
  value,
  suffix,
  label,
  started,
}: {
  value: number
  suffix: string
  label: string
  started: boolean
}) {
  const count = useCountUp(value, 2000, started)

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-3xl font-bold text-primary-foreground md:text-4xl">
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wide">
        {label}
      </span>
    </div>
  )
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  // BACKEND_CONNECTION: Fetch live stats from /api/stats — connect to Supabase
  const { data } = useSWR<Stats>("/api/stats", fetcher, {
    refreshInterval: 30000,
  })

  const statItems = [
    { label: "Total Scans Today", value: data?.scansToday ?? 0, suffix: "" },
    { label: "Model Accuracy", value: data?.accuracy ?? 0, suffix: "%" },
    { label: "Districts Covered", value: data?.districts ?? 0, suffix: "" },
    { label: "Volunteer Network", value: data?.volunteers ?? 0, suffix: "+" },
  ]

  return (
    <section ref={ref} className="bg-primary py-16" id="stats">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4"
      >
        {statItems.map((stat) => (
          <StatCounter
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            started={isInView}
          />
        ))}
      </motion.div>
    </section>
  )
}
