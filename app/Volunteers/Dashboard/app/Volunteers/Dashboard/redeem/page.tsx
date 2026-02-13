"use client"

import { useState } from "react"
import { Coins, Smartphone, Wallet, Building2, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/balance')
const currentBalance = 1240

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/redemptions')
const redemptionHistory = [
  {
    id: 1,
    method: "UPI Transfer",
    amount: 500,
    rupees: 50,
    date: "Jan 28, 2026",
    status: "completed" as const,
  },
  {
    id: 2,
    method: "Paytm Wallet",
    amount: 500,
    rupees: 50,
    date: "Jan 15, 2026",
    status: "completed" as const,
  },
  {
    id: 3,
    method: "UPI Transfer",
    amount: 1000,
    rupees: 100,
    date: "Dec 29, 2025",
    status: "completed" as const,
  },
]

const amountOptions = [500, 1000]

export default function RedeemPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number>(500)
  const [customAmount, setCustomAmount] = useState("")
  const [upiId, setUpiId] = useState("")
  const [paytmNumber, setPaytmNumber] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [ifscCode, setIfscCode] = useState("")

  const effectiveAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount
  const canRedeem = effectiveAmount >= 500 && effectiveAmount <= currentBalance

  const methods = [
    {
      id: "upi",
      label: "UPI Transfer",
      description: "Min 500 coins",
      icon: Smartphone,
      minCoins: 500,
    },
    {
      id: "paytm",
      label: "Paytm Wallet",
      description: "Min 500 coins",
      icon: Wallet,
      minCoins: 500,
    },
    {
      id: "bank",
      label: "Bank Transfer",
      description: "Min 1000 coins",
      icon: Building2,
      minCoins: 1000,
    },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header with balance */}
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Redeem Coins
        </h1>
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-amber-50 p-4">
          <Coins className="h-8 w-8 text-amber-600" />
          <div>
            <p className="text-2xl font-bold text-amber-600">
              {currentBalance.toLocaleString()} coins
            </p>
            <p className="text-sm text-muted-foreground">
              {"= \u20B9"}
              {(currentBalance / 10).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Redemption Methods */}
      <div className="grid gap-4 lg:grid-cols-3">
        {methods.map((method) => {
          const isSelected = selectedMethod === method.id
          const meetsMin = currentBalance >= method.minCoins
          return (
            <Card
              key={method.id}
              className={cn(
                "cursor-pointer border-border/60 shadow-sm transition-all",
                isSelected && "border-amber-400 ring-2 ring-amber-200",
                !meetsMin && "cursor-not-allowed opacity-50"
              )}
              onClick={() => meetsMin && setSelectedMethod(method.id)}
            >
              <CardContent className="flex items-start gap-3 p-4 md:p-5">
                <div className="rounded-lg bg-amber-50 p-2.5">
                  <method.icon className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {method.label}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Selected method form */}
      {selectedMethod && (
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">
              {selectedMethod === "upi" && "UPI Transfer Details"}
              {selectedMethod === "paytm" && "Paytm Wallet Details"}
              {selectedMethod === "bank" && "Bank Transfer Details"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Amount selector */}
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Amount (coins)</Label>
              <div className="flex flex-wrap gap-2">
                {amountOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount)
                      setCustomAmount("")
                    }}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      selectedAmount === amount && !customAmount
                        ? "bg-amber-600 text-white"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    )}
                  >
                    {amount}
                  </button>
                ))}
                <Input
                  type="number"
                  placeholder="Custom"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-28"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {`= \u20B9${(effectiveAmount / 10).toFixed(2)}`}
              </p>
            </div>

            {/* Method-specific fields */}
            {selectedMethod === "upi" && (
              <div className="space-y-2">
                <Label htmlFor="upi-id" className="text-sm text-foreground">UPI ID</Label>
                <Input
                  id="upi-id"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}

            {selectedMethod === "paytm" && (
              <div className="space-y-2">
                <Label htmlFor="paytm-num" className="text-sm text-foreground">Paytm Number</Label>
                <Input
                  id="paytm-num"
                  placeholder="Enter your Paytm number"
                  value={paytmNumber}
                  onChange={(e) => setPaytmNumber(e.target.value)}
                />
              </div>
            )}

            {selectedMethod === "bank" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account-num" className="text-sm text-foreground">Account Number</Label>
                  <Input
                    id="account-num"
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifsc" className="text-sm text-foreground">IFSC Code</Label>
                  <Input
                    id="ifsc"
                    placeholder="Enter IFSC code"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Button
              disabled={!canRedeem}
              className="bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {canRedeem
                ? `Redeem ${effectiveAmount} coins (\u20B9${(effectiveAmount / 10).toFixed(2)})`
                : "Insufficient coins or below minimum"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Redemption History */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-foreground md:text-lg">
          Redemption History
        </h2>
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-0">
            {/* Desktop table */}
            <table className="hidden w-full md:table">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3 text-right">Coins</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {redemptionHistory.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-border/50 text-sm last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {entry.method}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {entry.amount}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-foreground">
                      {`\u20B9${entry.rupees}`}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {entry.date}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-xs text-emerald-700"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {entry.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Mobile list */}
            <div className="md:hidden">
              {redemptionHistory.map((entry, i) => (
                <div
                  key={entry.id}
                  className={cn(
                    "flex items-center justify-between p-4",
                    i !== redemptionHistory.length - 1 &&
                      "border-b border-border/50"
                  )}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {entry.method}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">
                      {`\u20B9${entry.rupees}`}
                    </p>
                    <div className="mt-0.5 flex items-center justify-end gap-1 text-xs text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                      {entry.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
