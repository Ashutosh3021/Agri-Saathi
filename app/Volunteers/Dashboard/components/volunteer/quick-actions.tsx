"use client"

import { Smartphone, Plane, Banknote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const actions = [
  {
    title: "Report a Scan",
    description: "Upload photos from your recent farm visit",
    buttonLabel: "Upload Now",
    icon: Smartphone,
    disabled: false,
    color: "text-sky-600",
    bgColor: "bg-sky-50",
  },
  {
    title: "Schedule Drone Visit",
    description: "Plan your next field scanning session",
    buttonLabel: "Schedule",
    icon: Plane,
    disabled: false,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Redeem Coins",
    description: "Convert your coins to cash (min 500 coins)",
    buttonLabel: "Redeem Now",
    icon: Banknote,
    disabled: false,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
]

export function QuickActions() {
  return (
    <div>
      <h2 className="mb-3 text-base font-semibold text-foreground md:text-lg">
        Quick Actions
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <Card
            key={action.title}
            className="border-border/60 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="flex flex-col items-start gap-3 p-4 md:p-5">
              <div className={`rounded-lg p-2.5 ${action.bgColor}`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {action.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {action.description}
                </p>
              </div>
              <Button
                size="sm"
                disabled={action.disabled}
                className="mt-auto bg-amber-600 text-white hover:bg-amber-700"
              >
                {action.buttonLabel}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
