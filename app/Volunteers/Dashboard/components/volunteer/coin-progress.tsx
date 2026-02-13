"use client"

import { Coins, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CoinProgressProps {
  coins?: number
}

export function CoinProgress({ coins = 0 }: CoinProgressProps) {
  const target = 1500
  const bonus = 150
  const progress = Math.min((coins / target) * 100, 100)
  const remaining = Math.max(target - coins, 0)

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground md:text-lg">
          Next Milestone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-amber-600" />
          <span className="text-xl font-bold text-amber-600">
            {coins.toLocaleString()} coins
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{coins.toLocaleString()}</span>
            <span>{target.toLocaleString()}</span>
          </div>
          <Progress
            value={progress}
            className="h-3 bg-amber-100 [&>div]:bg-amber-500"
          />
          <p className="text-xs text-muted-foreground">
            {remaining > 0 
              ? `${remaining} more coins to unlock +${bonus} bonus`
              : "Bonus unlocked! 🎉"
            }
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <Target className="h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {target.toLocaleString()} coins
            </p>
            <p className="text-xs text-muted-foreground">
              +{bonus} bonus reward
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
