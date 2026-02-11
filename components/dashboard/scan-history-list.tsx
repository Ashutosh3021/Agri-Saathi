"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Star } from "lucide-react"

export interface ScanRecord {
  id: string
  date: string
  farmerLocation: string
  type: "Drone" | "WhatsApp" | "Soil"
  diseaseFound: string | null
  coinsEarned: number
  rating: number
}

const typeBadgeClass: Record<string, string> = {
  Drone: "bg-blue-50 text-blue-700 border-blue-200",
  WhatsApp: "bg-green-50 text-green-700 border-green-200",
  Soil: "bg-amber-50 text-amber-700 border-amber-200",
}

export function ScanHistorySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32 flex-1" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-10" />
        </div>
      ))}
    </div>
  )
}

interface ScanHistoryListProps {
  scans: ScanRecord[]
}

export function ScanHistoryList({ scans }: ScanHistoryListProps) {
  return (
    <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-200 hover:bg-transparent">
              <TableHead className="text-xs font-medium text-neutral-500">Date</TableHead>
              <TableHead className="text-xs font-medium text-neutral-500">Farmer Location</TableHead>
              <TableHead className="text-xs font-medium text-neutral-500">Type</TableHead>
              <TableHead className="text-xs font-medium text-neutral-500">Disease Found</TableHead>
              <TableHead className="text-right text-xs font-medium text-neutral-500">Coins</TableHead>
              <TableHead className="text-right text-xs font-medium text-neutral-500">Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scans.map((scan) => (
              <TableRow key={scan.id} className="border-neutral-100 hover:bg-neutral-50">
                <TableCell className="text-sm text-neutral-600">{scan.date}</TableCell>
                <TableCell className="text-sm font-medium text-neutral-800">{scan.farmerLocation}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={typeBadgeClass[scan.type]}>
                    {scan.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-neutral-600">
                  {scan.diseaseFound ?? (
                    <span className="text-green-600">No disease</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm font-semibold text-amber-600">
                  +{scan.coinsEarned}
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center gap-1 text-sm text-neutral-600">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    {scan.rating.toFixed(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-3 flex justify-end">
        <Link
          href="/dashboard/scans"
          className="text-sm font-medium text-green-600 transition-colors hover:text-green-700"
        >
          View All Scans
        </Link>
      </div>
    </div>
  )
}
