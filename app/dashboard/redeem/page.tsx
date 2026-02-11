"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RedemptionModal } from "@/components/dashboard/redemption-modal"
import { Coins, Banknote, Wallet, ShoppingBag, ArrowRightLeft } from "lucide-react"

interface Redemption {
  id: string
  date: string
  method: string
  coins: number
  value: number
  status: "pending" | "approved" | "completed"
}

const MOCK_HISTORY: Redemption[] = [
  { id: "r1", date: "Feb 7, 2026", method: "UPI Transfer", coins: 500, value: 50, status: "completed" },
  { id: "r2", date: "Jan 28, 2026", method: "Paytm Wallet", coins: 300, value: 30, status: "completed" },
  { id: "r3", date: "Jan 15, 2026", method: "Agri Coupon - Seeds", coins: 400, value: 40, status: "approved" },
  { id: "r4", date: "Jan 5, 2026", method: "UPI Transfer", coins: 600, value: 60, status: "completed" },
  { id: "r5", date: "Dec 20, 2025", method: "Paytm Wallet", coins: 500, value: 50, status: "pending" },
]

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  approved: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
}

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/redeem/history')
function useRedemptionHistory() {
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<Redemption[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setHistory(MOCK_HISTORY)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return { loading, history }
}

interface RedeemOption {
  key: string
  label: string
  icon: React.ElementType
  minCoins: number
  inputLabel: string
  inputPlaceholder: string
  inputType: "text" | "select"
  selectOptions?: string[]
}

const redeemOptions: RedeemOption[] = [
  {
    key: "upi",
    label: "UPI Transfer",
    icon: Banknote,
    minCoins: 500,
    inputLabel: "UPI ID",
    inputPlaceholder: "yourname@upi",
    inputType: "text",
  },
  {
    key: "paytm",
    label: "Paytm Wallet",
    icon: Wallet,
    minCoins: 500,
    inputLabel: "Paytm Number",
    inputPlaceholder: "+91 XXXXX XXXXX",
    inputType: "text",
  },
  {
    key: "coupon",
    label: "Agri Coupon",
    icon: ShoppingBag,
    minCoins: 400,
    inputLabel: "Coupon Type",
    inputPlaceholder: "Select type",
    inputType: "select",
    selectOptions: ["Seeds", "Fertilizer"],
  },
]

const COINS_PER_RUPEE = 10

export default function RedeemPage() {
  const { loading, history } = useRedemptionHistory()
  const [balance] = useState(1240)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [coinsToRedeem, setCoinsToRedeem] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  const activeOption = redeemOptions.find((o) => o.key === selectedOption)
  const coinsNum = Number.parseInt(coinsToRedeem, 10) || 0
  const canRedeem =
    activeOption &&
    inputValue.trim() &&
    coinsNum >= activeOption.minCoins &&
    coinsNum <= balance

  function handleRedeem() {
    if (!canRedeem) return
    setModalOpen(true)
  }

  function handleConfirm() {
    // BACKEND_CONNECTION: POST to /api/volunteer/redeem
    // Body: { method: activeOption.label, coins: coinsNum, destination: inputValue }
    setModalOpen(false)
    setSelectedOption(null)
    setInputValue("")
    setCoinsToRedeem("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Redeem Coins</h1>
        <p className="text-sm text-neutral-500">Convert your earned coins into real rewards</p>
      </div>

      {/* Balance card */}
      <div className="flex flex-col items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-6 py-8">
        <Coins className="h-10 w-10 text-amber-500" />
        <p className="text-3xl font-bold text-amber-800">{balance.toLocaleString()} Coins</p>
        <p className="text-sm text-amber-600">Available Balance</p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
          <ArrowRightLeft className="h-3.5 w-3.5" />
          <span>10 Coins = Rs. 1</span>
        </div>
      </div>

      {/* Redemption options */}
      <div className="grid gap-4 sm:grid-cols-3">
        {redeemOptions.map((option) => {
          const Icon = option.icon
          const isSelected = selectedOption === option.key
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => {
                setSelectedOption(isSelected ? null : option.key)
                setInputValue("")
                setCoinsToRedeem("")
              }}
              className={`flex flex-col items-center gap-3 rounded-xl border-2 bg-white p-6 text-center transition-all ${
                isSelected
                  ? "border-green-500 shadow-sm"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isSelected ? "bg-green-50" : "bg-neutral-100"}`}>
                <Icon className={`h-6 w-6 ${isSelected ? "text-green-600" : "text-neutral-500"}`} />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">{option.label}</p>
                <p className="mt-0.5 text-xs text-neutral-400">Min {option.minCoins} coins</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Input area */}
      {activeOption && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="redeem-input" className="mb-1.5 block text-sm font-medium text-neutral-700">
                {activeOption.inputLabel}
              </label>
              {activeOption.inputType === "select" ? (
                <Select value={inputValue} onValueChange={setInputValue}>
                  <SelectTrigger id="redeem-input" className="border-neutral-200 bg-white">
                    <SelectValue placeholder={activeOption.inputPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeOption.selectOptions?.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="redeem-input"
                  placeholder={activeOption.inputPlaceholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="border-neutral-200 bg-white"
                />
              )}
            </div>
            <div>
              <label htmlFor="coins-amount" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Coins to Redeem
              </label>
              <Input
                id="coins-amount"
                type="number"
                placeholder={`Min ${activeOption.minCoins}`}
                value={coinsToRedeem}
                onChange={(e) => setCoinsToRedeem(e.target.value)}
                className="border-neutral-200 bg-white"
              />
              {coinsNum > 0 && (
                <p className="mt-1 text-xs text-neutral-500">
                  Value: Rs. {Math.floor(coinsNum / COINS_PER_RUPEE).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={handleRedeem}
            disabled={!canRedeem}
            className="mt-4 bg-green-600 text-white hover:bg-green-700 disabled:bg-neutral-200 disabled:text-neutral-400"
          >
            Redeem Now
          </Button>
        </div>
      )}

      {/* Redemption history */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Redemption History</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28 flex-1" />
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-neutral-200 hover:bg-transparent">
                  <TableHead className="text-xs font-medium text-neutral-500">Date</TableHead>
                  <TableHead className="text-xs font-medium text-neutral-500">Method</TableHead>
                  <TableHead className="text-right text-xs font-medium text-neutral-500">Coins</TableHead>
                  <TableHead className="text-right text-xs font-medium text-neutral-500">Value</TableHead>
                  <TableHead className="text-right text-xs font-medium text-neutral-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((r) => (
                  <TableRow key={r.id} className="border-neutral-100 hover:bg-neutral-50">
                    <TableCell className="text-sm text-neutral-600">{r.date}</TableCell>
                    <TableCell className="text-sm font-medium text-neutral-800">{r.method}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-amber-600">
                      {r.coins.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm text-neutral-700">
                      Rs. {r.value.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={statusStyles[r.status]}>
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Modal */}
      {activeOption && (
        <RedemptionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
          method={activeOption.label}
          coins={coinsNum}
          destination={inputValue}
        />
      )}
    </div>
  )
}
