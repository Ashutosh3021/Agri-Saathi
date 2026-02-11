"use client"

import { motion } from "framer-motion"
import { Smartphone, ScanSearch, FileCheck, Radio } from "lucide-react"

const steps = [
  {
    icon: Smartphone,
    step: "01",
    title: "Farmer sends crop photo on WhatsApp",
    description:
      "No app download needed. The farmer simply sends a photo of the affected crop to our WhatsApp number — in any language.",
  },
  {
    icon: ScanSearch,
    step: "02",
    title: "AI model detects disease with 90%+ accuracy",
    description:
      "Our trained convolutional neural network identifies the disease within seconds, cross-referencing thousands of known crop conditions.",
  },
  {
    icon: FileCheck,
    step: "03",
    title: "Instant diagnosis + quick fix + permanent fix sent back",
    description:
      "The farmer gets a clear WhatsApp message with what's wrong, an immediate remedy, and a long-term prevention strategy.",
  },
  {
    icon: Radio,
    step: "04",
    title: "Volunteer follows up with IoT soil scan if needed",
    description:
      "For complex cases, a local volunteer is dispatched with our IoT soil-testing device to provide in-depth soil NPK and moisture analysis.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance md:text-5xl">
            From Farm to Fix in Under 30 Seconds
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A simple, frictionless workflow that meets farmers where they already are.
          </p>
        </motion.div>

        <div className="relative mt-16">
          {/* Vertical line connector */}
          <div className="absolute top-0 bottom-0 left-6 hidden w-px bg-border md:left-1/2 md:block" />

          <div className="flex flex-col gap-16">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative"
                >
                  {/* Step indicator on the line */}
                  <div className="absolute top-0 left-6 z-10 hidden -translate-x-1/2 md:left-1/2 md:block">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-background bg-primary text-sm font-bold text-primary-foreground">
                      {step.step}
                    </div>
                  </div>

                  <div
                    className={`flex flex-col md:flex-row ${isEven ? "" : "md:flex-row-reverse"}`}
                  >
                    <div className="md:w-1/2" />
                    <div
                      className={`md:w-1/2 ${isEven ? "md:pl-16" : "md:pr-16 md:text-right"}`}
                    >
                      <div className="flex items-center gap-4 md:hidden">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          {step.step}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <div className="hidden items-center gap-4 md:flex md:flex-col md:items-start">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ${isEven ? "" : "md:ml-auto"}`}
                        >
                          <step.icon size={24} />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                      </div>
                      <p className="mt-3 pl-14 leading-relaxed text-muted-foreground md:pl-0">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
