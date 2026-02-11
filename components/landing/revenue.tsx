"use client"

import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, Users, Leaf, IndianRupee } from "lucide-react"

const revenueFlow = [
  { label: "Hardware Sale", value: "Rs 8,500", sublabel: "Per IoT Device" },
  { label: "Cost of Goods", value: "Rs 4,200", sublabel: "Components + Assembly" },
  { label: "Gross Margin", value: "Rs 4,300", sublabel: "50.6% Margin" },
  { label: "Volunteer Pool", value: "Rs 1,000", sublabel: "Per Unit Allocation" },
  { label: "R&D Fund", value: "Rs 1,500", sublabel: "Model Training + Data" },
  { label: "Net Revenue", value: "Rs 1,800", sublabel: "Per Unit Profit" },
]

const impactMetrics = [
  {
    icon: Users,
    metric: "15,000+",
    label: "Farmers Reached",
    description: "Per 1,000 units deployed across districts",
  },
  {
    icon: Leaf,
    metric: "500+",
    label: "Volunteers Earning",
    description: "Active in the reward coin ecosystem",
  },
  {
    icon: TrendingUp,
    metric: "40%",
    label: "Crop Loss Reduction",
    description: "Average improvement in early-detected fields",
  },
  {
    icon: IndianRupee,
    metric: "Rs 18L",
    label: "Revenue per 1K Units",
    description: "Scalable hardware-as-a-service model",
  },
]

export function Revenue() {
  return (
    <section className="bg-muted/50 py-24 md:py-32" id="impact">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground text-balance md:text-5xl">
            Built to Last. Not Just to Win.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A sustainable revenue engine that powers farmer impact at scale.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {/* Revenue Model */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="mb-6 text-lg font-semibold text-foreground">Revenue Flow per Unit</h3>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-col gap-3">
                {revenueFlow.map((item, index) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-muted">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        <div>
                          <span className="text-sm font-medium text-foreground">{item.label}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {item.sublabel}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-semibold ${index === revenueFlow.length - 1 ? "text-primary" : "text-foreground"}`}
                      >
                        {item.value}
                      </span>
                    </div>
                    {index < revenueFlow.length - 1 && (
                      <div className="flex justify-center py-1 text-muted-foreground/30">
                        <ArrowRight size={14} className="rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Impact Projection */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Impact Projection (1,000 Units)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {impactMetrics.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon size={20} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{item.metric}</div>
                  <div className="mt-1 text-sm font-medium text-foreground">{item.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{item.description}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
