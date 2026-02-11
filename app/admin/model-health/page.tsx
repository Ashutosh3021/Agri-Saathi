"use client"

import { useState, useEffect } from "react"
import { Brain, Zap, Clock, CheckCircle2, XCircle, CalendarDays } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

// BACKEND_CONNECTION: Replace with fetch('/api/admin/model-health')
interface ModelStats {
  pestModel: {
    accuracy: number
    avgInference: number
    predictionsToday: number
  }
  soilModel: {
    accuracy: number
    avgInference: number
    predictionsToday: number
  }
  serviceStatus: "online" | "offline"
  lastModelUpdate: string
}

// BACKEND_CONNECTION: Replace with fetch('/api/ml/health') for real status
function useModelHealth() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ModelStats | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        pestModel: { accuracy: 94.2, avgInference: 127, predictionsToday: 312 },
        soilModel: { accuracy: 91.8, avgInference: 89, predictionsToday: 184 },
        serviceStatus: "online",
        lastModelUpdate: "Jan 28, 2026",
      })
      setLoading(false)
    }, 700)
    return () => clearTimeout(timer)
  }, [])

  return { loading, data }
}

// Mock accuracy data for last 7 days
const accuracyData = [
  { day: "Feb 4", pest: 93.1, soil: 90.4 },
  { day: "Feb 5", pest: 93.5, soil: 91.0 },
  { day: "Feb 6", pest: 93.8, soil: 91.2 },
  { day: "Feb 7", pest: 94.0, soil: 91.5 },
  { day: "Feb 8", pest: 93.9, soil: 91.6 },
  { day: "Feb 9", pest: 94.2, soil: 91.8 },
  { day: "Feb 10", pest: 94.5, soil: 92.1 },
]

const chartConfig = {
  pest: {
    label: "Pest Detection",
    color: "#ea580c",
  },
  soil: {
    label: "Soil Analysis",
    color: "#2563eb",
  },
}

export default function ModelHealthPage() {
  const { loading, data } = useModelHealth()

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Model Health</h1>
          <p className="text-sm text-neutral-500">AI model performance and inference stats</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5">
              <Skeleton className="mb-3 h-5 w-32" />
              <Skeleton className="mb-2 h-8 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Model Health</h1>
        <p className="text-sm text-neutral-500">AI model performance and inference stats</p>
      </div>

      {/* Model cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Pest Detection */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
              <Brain className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Pest Detection Model</h3>
              <p className="text-xs text-neutral-400">CNN v3.2 - ResNet50</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-neutral-400">Accuracy</p>
              <p className="mt-0.5 text-xl font-bold text-neutral-900">{data.pestModel.accuracy}%</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Avg Inference</p>
              <div className="mt-0.5 flex items-baseline gap-1">
                <p className="text-xl font-bold text-neutral-900">{data.pestModel.avgInference}</p>
                <span className="text-xs text-neutral-400">ms</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Today</p>
              <p className="mt-0.5 text-xl font-bold text-neutral-900">{data.pestModel.predictionsToday}</p>
            </div>
          </div>
        </div>

        {/* Soil Model */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Soil Analysis Model</h3>
              <p className="text-xs text-neutral-400">Regression v2.1 - XGBoost</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-neutral-400">Accuracy</p>
              <p className="mt-0.5 text-xl font-bold text-neutral-900">{data.soilModel.accuracy}%</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Avg Inference</p>
              <div className="mt-0.5 flex items-baseline gap-1">
                <p className="text-xl font-bold text-neutral-900">{data.soilModel.avgInference}</p>
                <span className="text-xs text-neutral-400">ms</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Today</p>
              <p className="mt-0.5 text-xl font-bold text-neutral-900">{data.soilModel.predictionsToday}</p>
            </div>
          </div>
        </div>

        {/* FastAPI Status */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              data.serviceStatus === "online" ? "bg-emerald-50" : "bg-red-50"
            }`}>
              {data.serviceStatus === "online" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">FastAPI Service</h3>
              <p className="text-xs text-neutral-400">ML inference endpoint</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={
                data.serviceStatus === "online"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }
            >
              {data.serviceStatus === "online" ? "Online" : "Offline"}
            </Badge>
            {data.serviceStatus === "online" && (
              <span className="flex items-center gap-1 text-xs text-neutral-400">
                <Clock className="h-3 w-3" />
                Uptime: 99.9%
              </span>
            )}
          </div>
        </div>

        {/* Last Update */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <CalendarDays className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">Last Model Update</h3>
              <p className="text-xs text-neutral-400">Retraining schedule</p>
            </div>
          </div>
          <p className="text-lg font-bold text-neutral-900">{data.lastModelUpdate}</p>
          <p className="mt-1 text-xs text-neutral-400">Next scheduled: Feb 28, 2026</p>
        </div>
      </div>

      {/* Accuracy chart */}
      <Card className="border-neutral-200 bg-white">
        <CardHeader>
          <CardTitle className="text-base text-neutral-900">Accuracy Over Last 7 Days</CardTitle>
          <CardDescription className="text-neutral-500">
            Pest detection and soil analysis model accuracy trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#a3a3a3" }}
                  axisLine={{ stroke: "#e5e5e5" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[88, 96]}
                  tick={{ fontSize: 12, fill: "#a3a3a3" }}
                  axisLine={{ stroke: "#e5e5e5" }}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <span className="font-medium">
                          {typeof value === "number" ? value.toFixed(1) : value}%
                        </span>
                      )}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="pest"
                  stroke="#ea580c"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#ea580c" }}
                  activeDot={{ r: 6 }}
                  name="Pest Detection"
                />
                <Line
                  type="monotone"
                  dataKey="soil"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#2563eb" }}
                  activeDot={{ r: 6 }}
                  name="Soil Analysis"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-orange-600" />
              <span className="text-sm text-neutral-600">Pest Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              <span className="text-sm text-neutral-600">Soil Analysis</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
