"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export interface CoinTransaction {
  id: string
  type: "earn" | "redeem"
  description: string
  amount: number
  date: string
}

export function CoinHistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-14" />
        </div>
      ))}
    </div>
  )
}

interface CoinHistoryProps {
  transactions: CoinTransaction[]
}

export function CoinHistory({ transactions }: CoinHistoryProps) {
  return (
    <div className="space-y-1">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-neutral-50"
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              tx.type === "earn" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            {tx.type === "earn" ? (
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-neutral-800">
              {tx.description}
            </p>
            <p className="text-xs text-neutral-400">{tx.date}</p>
          </div>
          <span
            className={`text-sm font-semibold ${
              tx.type === "earn" ? "text-green-600" : "text-red-500"
            }`}
          >
            {tx.type === "earn" ? "+" : "-"}{tx.amount}
          </span>
        </div>
      ))}
    </div>
  )
}
