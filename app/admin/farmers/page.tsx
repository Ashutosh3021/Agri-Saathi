"use client"

import { useState, useMemo } from "react"
import { Search, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

interface Farmer {
  id: string
  phone: string
  name: string
  location: string
  state: string
  totalScans: number
  lastActive: string
}

interface FarmerScan {
  id: string
  date: string
  type: string
  diseaseFound: string | null
  volunteer: string
}

// BACKEND_CONNECTION: Replace with fetch('/api/admin/farmers')
const MOCK_FARMERS: Farmer[] = [
  { id: "f1", phone: "+91 98765 43210", name: "Ramesh Jadhav", location: "Nagpur", state: "Maharashtra", totalScans: 12, lastActive: "Feb 9, 2026" },
  { id: "f2", phone: "+91 98765 43211", name: "Sunita Patil", location: "Amravati", state: "Maharashtra", totalScans: 8, lastActive: "Feb 8, 2026" },
  { id: "f3", phone: "+91 98765 43212", name: "Govind Rao", location: "Warangal", state: "Telangana", totalScans: 15, lastActive: "Feb 9, 2026" },
  { id: "f4", phone: "+91 98765 43213", name: "Lakshmi Devi", location: "Belgaum", state: "Karnataka", totalScans: 6, lastActive: "Feb 7, 2026" },
  { id: "f5", phone: "+91 98765 43214", name: "Balu Shinde", location: "Wardha", state: "Maharashtra", totalScans: 22, lastActive: "Feb 9, 2026" },
  { id: "f6", phone: "+91 98765 43215", name: "Meera Kulkarni", location: "Pune", state: "Maharashtra", totalScans: 3, lastActive: "Feb 5, 2026" },
  { id: "f7", phone: "+91 98765 43216", name: "Raju Reddy", location: "Nizamabad", state: "Telangana", totalScans: 18, lastActive: "Feb 8, 2026" },
  { id: "f8", phone: "+91 98765 43217", name: "Anita Sharma", location: "Indore", state: "Madhya Pradesh", totalScans: 9, lastActive: "Feb 6, 2026" },
  { id: "f9", phone: "+91 98765 43218", name: "Prakash Gaikwad", location: "Latur", state: "Maharashtra", totalScans: 11, lastActive: "Feb 8, 2026" },
  { id: "f10", phone: "+91 98765 43219", name: "Savita More", location: "Solapur", state: "Maharashtra", totalScans: 7, lastActive: "Feb 4, 2026" },
]

// BACKEND_CONNECTION: Replace with fetch('/api/admin/farmers/:id/scans')
const MOCK_FARMER_SCANS: FarmerScan[] = [
  { id: "fs1", date: "Feb 9, 2026", type: "Drone", diseaseFound: "Leaf Blight", volunteer: "Ravi Kumar" },
  { id: "fs2", date: "Feb 7, 2026", type: "WhatsApp", diseaseFound: null, volunteer: "Amit Sharma" },
  { id: "fs3", date: "Feb 5, 2026", type: "Soil", diseaseFound: "N Deficiency", volunteer: "Ravi Kumar" },
  { id: "fs4", date: "Feb 2, 2026", type: "Drone", diseaseFound: "Rust", volunteer: "Priya Deshmukh" },
  { id: "fs5", date: "Jan 28, 2026", type: "WhatsApp", diseaseFound: "Powdery Mildew", volunteer: "Amit Sharma" },
]

const STATES = ["All States", "Maharashtra", "Telangana", "Karnataka", "Madhya Pradesh"]

export default function FarmersPage() {
  const [search, setSearch] = useState("")
  const [stateFilter, setStateFilter] = useState("All States")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null)

  const filtered = useMemo(() => {
    return MOCK_FARMERS.filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.phone.includes(search) ||
        f.location.toLowerCase().includes(search.toLowerCase())
      const matchesState = stateFilter === "All States" || f.state === stateFilter
      return matchesSearch && matchesState
    })
  }, [search, stateFilter])

  function openDrawer(farmer: Farmer) {
    setSelectedFarmer(farmer)
    setDrawerOpen(true)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Registered Farmers</h1>
        <p className="text-sm text-neutral-500">{MOCK_FARMERS.length.toLocaleString()} farmers on platform</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search by name, phone, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-neutral-200 bg-white pl-9"
          />
        </div>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-full border-neutral-200 bg-white sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-200 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-neutral-500">Phone</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">Name</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">Location</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">State</TableHead>
                <TableHead className="text-right text-xs font-medium text-neutral-500">Total Scans</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">Last Active</TableHead>
                <TableHead className="text-right text-xs font-medium text-neutral-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-sm text-neutral-400">
                    No farmers found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((farmer) => (
                  <TableRow key={farmer.id} className="border-neutral-100 hover:bg-neutral-50">
                    <TableCell className="text-sm font-mono text-neutral-600">{farmer.phone}</TableCell>
                    <TableCell className="text-sm font-medium text-neutral-800">{farmer.name}</TableCell>
                    <TableCell className="text-sm text-neutral-600">{farmer.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-neutral-200 bg-neutral-50 text-neutral-600">
                        {farmer.state}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold text-neutral-800">
                      {farmer.totalScans}
                    </TableCell>
                    <TableCell className="text-sm text-neutral-500">{farmer.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                        onClick={() => openDrawer(farmer)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View History
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Side drawer for scan history */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="overflow-y-auto border-neutral-200 bg-white sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-neutral-900">{selectedFarmer?.name}</SheetTitle>
            <SheetDescription className="text-neutral-500">
              {selectedFarmer?.location}, {selectedFarmer?.state} &middot; {selectedFarmer?.phone}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-semibold text-neutral-700">Scan History</h3>
            <div className="space-y-3">
              {MOCK_FARMER_SCANS.map((scan) => (
                <div
                  key={scan.id}
                  className="rounded-lg border border-neutral-200 bg-neutral-50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-neutral-800">{scan.type} Scan</span>
                    <span className="text-xs text-neutral-400">{scan.date}</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">By: {scan.volunteer}</span>
                    {scan.diseaseFound ? (
                      <Badge className="border-red-200 bg-red-50 text-xs text-red-700">
                        {scan.diseaseFound}
                      </Badge>
                    ) : (
                      <Badge className="border-emerald-200 bg-emerald-50 text-xs text-emerald-700">
                        Healthy
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
