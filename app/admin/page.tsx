"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Users, HandHelping, Camera, ArrowLeftRight, UserPlus, ScanLine, Wallet } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

// BACKEND_CONNECTION: Replace with fetch('/api/admin/stats')
function useAdminStats() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    totalFarmers: number
    totalVolunteers: number
    scansToday: number
    pendingRedemptions: number
  } | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        totalFarmers: 12847,
        totalVolunteers: 342,
        scansToday: 89,
        pendingRedemptions: 3,
      })
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return { loading, data }
}

interface ActivityItem {
  id: string
  type: "scan" | "redemption" | "volunteer"
  message: string
  timestamp: string
}

// BACKEND_CONNECTION: Replace with fetch('/api/admin/activity?limit=20')
const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "a1", type: "scan", message: "New drone scan submitted by Ravi Kumar in Nagpur, MH", timestamp: "2 min ago" },
  { id: "a2", type: "redemption", message: "Redemption request: 500 coins by Amit Sharma (UPI)", timestamp: "8 min ago" },
  { id: "a3", type: "volunteer", message: "New volunteer registered: Priya Deshmukh, Amravati", timestamp: "15 min ago" },
  { id: "a4", type: "scan", message: "WhatsApp scan completed for farmer in Wardha, MH", timestamp: "22 min ago" },
  { id: "a5", type: "redemption", message: "Redemption request: 300 coins by Suresh Patil (Paytm)", timestamp: "35 min ago" },
  { id: "a6", type: "scan", message: "Soil reading submitted by Deepak Ingle in Yavatmal", timestamp: "42 min ago" },
  { id: "a7", type: "volunteer", message: "Volunteer Meena Gawande achieved 100 scans milestone", timestamp: "1 hr ago" },
  { id: "a8", type: "scan", message: "New drone scan submitted by Nilesh Wagh in Chandrapur", timestamp: "1 hr ago" },
  { id: "a9", type: "redemption", message: "Redemption approved: 400 coins by Aarti Kadam (Coupon)", timestamp: "1.5 hr ago" },
  { id: "a10", type: "scan", message: "WhatsApp scan completed for farmer in Buldhana, MH", timestamp: "2 hr ago" },
  { id: "a11", type: "scan", message: "Drone scan submitted by Kiran Sonawane in Akola", timestamp: "2.5 hr ago" },
  { id: "a12", type: "volunteer", message: "Volunteer Rahul Bhise updated profile information", timestamp: "3 hr ago" },
  { id: "a13", type: "redemption", message: "Redemption completed: 600 coins by Vijay More (UPI)", timestamp: "3 hr ago" },
  { id: "a14", type: "scan", message: "Soil reading submitted by Sachin Gaikwad in Latur", timestamp: "3.5 hr ago" },
  { id: "a15", type: "scan", message: "New drone scan submitted by Ganesh Pawar in Jalgaon", timestamp: "4 hr ago" },
  { id: "a16", type: "volunteer", message: "New volunteer registered: Shweta Kulkarni, Pune", timestamp: "4.5 hr ago" },
  { id: "a17", type: "scan", message: "WhatsApp scan completed for farmer in Nashik, MH", timestamp: "5 hr ago" },
  { id: "a18", type: "redemption", message: "Redemption request: 500 coins by Anand Jadhav (UPI)", timestamp: "5 hr ago" },
  { id: "a19", type: "scan", message: "Soil reading submitted by Manoj Kale in Sangli", timestamp: "6 hr ago" },
  { id: "a20", type: "scan", message: "Drone scan submitted by Pravin Shinde in Solapur", timestamp: "6.5 hr ago" },
]

const activityIcons: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  scan: { icon: ScanLine, bg: "bg-blue-50", color: "text-blue-600" },
  redemption: { icon: Wallet, bg: "bg-amber-50", color: "text-amber-600" },
  volunteer: { icon: UserPlus, bg: "bg-emerald-50", color: "text-emerald-600" },
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  iconBg: string
  badge?: number
}

function StatCard({ title, value, icon, iconBg, badge }: StatCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          {badge !== undefined && badge > 0 && (
            <Badge className="h-5 border-red-200 bg-red-50 px-1.5 text-xs text-red-700">
              {badge}
            </Badge>
          )}
        </div>
        <p className="mt-0.5 text-2xl font-bold text-neutral-900">{value}</p>
      </div>
    </div>
  )
}

export default function AdminOverviewPage() {
  const { loading, data } = useAdminStats()
  const [activityLoading, setActivityLoading] = useState(true)
  const [activity, setActivity] = useState<ActivityItem[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setActivity(MOCK_ACTIVITY)
      setActivityLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      {/* Stats */}
      {loading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-5">
              <Skeleton className="h-11 w-11 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Farmers"
            value={data.totalFarmers.toLocaleString()}
            icon={<Users className="h-5 w-5 text-blue-600" />}
            iconBg="bg-blue-50"
          />
          <StatCard
            title="Total Volunteers"
            value={data.totalVolunteers.toLocaleString()}
            icon={<HandHelping className="h-5 w-5 text-emerald-600" />}
            iconBg="bg-emerald-50"
          />
          <StatCard
            title="Scans Today"
            value={data.scansToday.toLocaleString()}
            icon={<Camera className="h-5 w-5 text-orange-600" />}
            iconBg="bg-orange-50"
          />
          <StatCard
            title="Pending Redemptions"
            value={data.pendingRedemptions.toLocaleString()}
            icon={<ArrowLeftRight className="h-5 w-5 text-red-600" />}
            iconBg="bg-red-50"
            badge={data.pendingRedemptions}
          />
        </div>
      )}

      {/* Activity feed */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-4 text-base font-semibold text-neutral-900">Recent Activity</h2>
        {activityLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {activity.map((item) => {
              const config = activityIcons[item.type]
              const Icon = config.icon
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-neutral-50"
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-700">{item.message}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">{item.timestamp}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
