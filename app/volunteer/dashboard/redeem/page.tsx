'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Coins, 
  Wallet, 
  Smartphone, 
  Building2, 
  ArrowRight,
  AlertCircle,
  Clock,
  CheckCircle2
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/redemptions')
const mockRedemptionHistory = [
  { 
    id: 1, 
    method: "UPI", 
    amount: 500, 
    value: 50, 
    status: "completed", 
    date: "2024-01-10",
    details: "ashutosh@upi"
  },
  { 
    id: 2, 
    method: "Paytm", 
    amount: 1000, 
    value: 100, 
    status: "pending", 
    date: "2024-01-14",
    details: "8249912238"
  },
]

export default function RedeemPage() {
  const router = useRouter()
  const [totalCoins] = useState(1240)
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'paytm' | 'bank' | null>(null)
  const [amount, setAmount] = useState('')
  const [formData, setFormData] = useState({
    upiId: '',
    paytmNumber: '',
    accountNumber: '',
    ifsc: '',
    accountHolder: ''
  })
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/Volunteers')
      }
    }
    checkAuth()
  }, [router, supabase])

  const coinValue = (totalCoins * 0.1).toFixed(2)
  const minCoins = {
    upi: 500,
    paytm: 500,
    bank: 1000
  }

  const canRedeem = (method: string) => totalCoins >= minCoins[method as keyof typeof minCoins]

  const handleSubmit = async () => {
    // BACKEND_CONNECTION: Implement redemption API call
    alert('Redemption request submitted!')
  }

  const redemptionMethods = [
    {
      id: 'upi' as const,
      name: 'UPI Transfer',
      minCoins: 500,
      icon: Smartphone,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: 'paytm' as const,
      name: 'Paytm Wallet',
      minCoins: 500,
      icon: Wallet,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'bank' as const,
      name: 'Bank Transfer',
      minCoins: 1000,
      icon: Building2,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Redeem Coins</h1>
        <p className="text-gray-600 mt-1">Convert your earned coins to real money</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Coins className="w-8 h-8" />
          <span className="text-4xl font-bold">{totalCoins.toLocaleString()}</span>
          <span className="text-xl">coins</span>
        </div>
        <p className="text-white/80 text-lg">= ₹{coinValue}</p>
        <p className="text-white/60 text-sm mt-2">1 coin = ₹0.10</p>
      </div>

      {/* Redemption Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {redemptionMethods.map((method) => {
          const Icon = method.icon
          const isAvailable = canRedeem(method.id)
          const isSelected = selectedMethod === method.id

          return (
            <button
              key={method.id}
              onClick={() => isAvailable && setSelectedMethod(method.id)}
              disabled={!isAvailable}
              className={cn(
                "p-6 rounded-xl border-2 text-left transition-all",
                isSelected 
                  ? "border-amber-500 ring-2 ring-amber-500/20" 
                  : "border-gray-200 hover:border-gray-300",
                !isAvailable && "opacity-50 cursor-not-allowed",
                method.color
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-white", method.iconColor)}>
                  <Icon className="w-6 h-6" />
                </div>
                {!isAvailable && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                    Min {method.minCoins} coins
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{method.name}</h3>
              <p className="text-sm text-gray-600">Minimum {method.minCoins} coins</p>
            </button>
          )
        })}
      </div>

      {/* Redemption Form */}
      {selectedMethod && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Redeem via {redemptionMethods.find(m => m.id === selectedMethod)?.name}
          </h3>

          {/* Amount Selection */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Amount (coins)
            </Label>
            <div className="flex gap-2 flex-wrap mb-3">
              {[500, 1000, 2000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  disabled={totalCoins < amt}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    amount === amt.toString()
                      ? "bg-amber-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    totalCoins < amt && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {amt} coins
                </button>
              ))}
            </div>
            <Input
              type="number"
              placeholder="Enter custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="max-w-xs"
              min={minCoins[selectedMethod]}
              max={totalCoins}
            />
            {amount && (
              <p className="text-sm text-gray-600 mt-2">
                You will receive: <span className="font-semibold text-amber-600">₹{(parseInt(amount) * 0.1).toFixed(2)}</span>
              </p>
            )}
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            {selectedMethod === 'upi' && (
              <div>
                <Label htmlFor="upiId" className="text-sm font-medium text-gray-700">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="name@upi"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                />
              </div>
            )}

            {selectedMethod === 'paytm' && (
              <div>
                <Label htmlFor="paytmNumber" className="text-sm font-medium text-gray-700">Paytm Number</Label>
                <Input
                  id="paytmNumber"
                  placeholder="10-digit mobile number"
                  value={formData.paytmNumber}
                  onChange={(e) => setFormData({ ...formData, paytmNumber: e.target.value })}
                />
              </div>
            )}

            {selectedMethod === 'bank' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accountHolder" className="text-sm font-medium text-gray-700">Account Holder Name</Label>
                  <Input
                    id="accountHolder"
                    placeholder="Full name"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Account number"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="ifsc" className="text-sm font-medium text-gray-700">IFSC Code</Label>
                  <Input
                    id="ifsc"
                    placeholder="SBIN0001234"
                    value={formData.ifsc}
                    onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!amount || parseInt(amount) < minCoins[selectedMethod] || parseInt(amount) > totalCoins}
            className="w-full mt-6 bg-amber-500 hover:bg-amber-600"
            size="lg"
          >
            Redeem Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {parseInt(amount) > totalCoins && (
            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Insufficient coins
            </p>
          )}
        </div>
      )}

      {/* Redemption History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Redemption History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coins</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockRedemptionHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{item.date}</td>
                  <td className="px-4 py-3 text-sm">{item.method}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-amber-600">{item.amount}</td>
                  <td className="px-4 py-3 text-sm">₹{item.value}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full",
                      item.status === 'completed' 
                        ? "bg-green-100 text-green-700" 
                        : "bg-amber-100 text-amber-700"
                    )}>
                      {item.status === 'completed' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {item.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
