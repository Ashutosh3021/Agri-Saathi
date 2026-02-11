"use client"

import { useState, useMemo } from "react"
import { Search, Coins, UserX, Eye, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Volunteer {
  id: string
  name: string
  phone: string
  district: string
  state: string
  totalCoins: number
  totalScans: number
  avgRating: number
  status: "active" | "inactive"
}

// BACKEND_CONNECTION: Replace with fetch('/api/admin/volunteers')
const MOCK_VOLUNTEERS: Volunteer[] = [
  { id: "v1", name: "Ravi Kumar", phone: "+91 98765 00001", district: "Nagpur", state: "Maharashtra", totalCoins: 1240, totalScans: 87, avgRating: 4.8, status: "active" },
  { id: "v2", name: "Amit Sharma", phone: "+91 98765 00002", district: "Amravati", state: "Maharashtra", totalCoins: 980, totalScans: 64, avgRating: 4.5, status: "active" },
  { id: "v3", name: "Priya Deshmukh", phone: "+91 98765 00003", district: "Wardha", state: "Maharashtra", totalCoins: 1560, totalScans: 112, avgRating: 4.9, status: "active" },
  { id: "v4", name: "Suresh Patil", phone: "+91 98765 00004", district: "Yavatmal", state: "Maharashtra", totalCoins: 640, totalScans: 41, avgRating: 4.2, status: "active" },
  { id: "v5", name: "Deepak Ingle", phone: "+91 98765 00005", district: "Chandrapur", state: "Maharashtra", totalCoins: 320, totalScans: 22, avgRating: 4.0, status: "inactive" },
  { id: "v6", name: "Meena Gawande", phone: "+91 98765 00006", district: "Warangal", state: "Telangana", totalCoins: 1800, totalScans: 134, avgRating: 4.9, status: "active" },
  { id: "v7", name: "Nilesh Wagh", phone: "+91 98765 00007", district: "Akola", state: "Maharashtra", totalCoins: 890, totalScans: 58, avgRating: 4.6, status: "active" },
  { id: "v8", name: "Kiran Sonawane", phone: "+91 98765 00008", district: "Belgaum", state: "Karnataka", totalCoins: 450, totalScans: 30, avgRating: 3.9, status: "inactive" },
]

const STATES = ["All States", "Maharashtra", "Telangana", "Karnataka"]

export default function VolunteersPage() {
  const [search, setSearch] = useState("")
  const [stateFilter, setStateFilter] = useState("All States")
  const [coinModalOpen, setCoinModalOpen] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)
  const [coinAmount, setCoinAmount] = useState("")
  const [coinReason, setCoinReason] = useState("")
  const [volunteers, setVolunteers] = useState(MOCK_VOLUNTEERS)

  const filtered = useMemo(() => {
    return volunteers.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.phone.includes(search) ||
        v.district.toLowerCase().includes(search.toLowerCase())
      const matchesState = stateFilter === "All States" || v.state === stateFilter
      return matchesSearch && matchesState
    })
  }, [search, stateFilter, volunteers])

  function openCoinModal(volunteer: Volunteer) {
    setSelectedVolunteer(volunteer)
    setCoinAmount("")
    setCoinReason("")
    setCoinModalOpen(true)
  }

  function handleCoinAdjust() {
    if (!selectedVolunteer || !coinAmount || !coinReason.trim()) return
    // BACKEND_CONNECTION: POST /api/admin/volunteers/:id/adjust-coins
    // Body: { amount: Number(coinAmount), reason: coinReason }
    // This creates a CoinTransaction record in the database
    const amount = Number(coinAmount)
    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === selectedVolunteer.id
          ? { ...v, totalCoins: v.totalCoins + amount }
          : v
      )
    )
    setCoinModalOpen(false)
  }

  function handleDeactivate(volunteerId: string) {
    // BACKEND_CONNECTION: PATCH /api/admin/volunteers/:id/status
    // Body: { status: 'inactive' }
    setVolunteers((prev) =>
      prev.map((v) =>
        v.id === volunteerId ? { ...v, status: "inactive" as const } : v
      )
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Volunteers</h1>
        <p className="text-sm text-neutral-500">{volunteers.length} registered volunteers</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search by name, phone, or district..."
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
                <TableHead className="text-xs font-medium text-neutral-500">Name</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">Phone</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">District</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">State</TableHead>
                <TableHead className="text-right text-xs font-medium text-neutral-500">Coins</TableHead>
                <TableHead className="text-right text-xs font-medium text-neutral-500">Scans</TableHead>
                <TableHead className="text-right text-xs font-medium text-neutral-500">Avg Rating</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">Status</TableHead>
                <TableHead className="text-right text-xs font-medium text-neutral-500">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center text-sm text-neutral-400">
                    No volunteers found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((vol) => (
                  <TableRow key={vol.id} className="border-neutral-100 hover:bg-neutral-50">
                    <TableCell className="text-sm font-medium text-neutral-800">{vol.name}</TableCell>
                    <TableCell className="text-sm font-mono text-neutral-600">{vol.phone}</TableCell>
                    <TableCell className="text-sm text-neutral-600">{vol.district}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-neutral-200 bg-neutral-50 text-neutral-600">
                        {vol.state}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm font-semibold text-amber-600">
                      {vol.totalCoins.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm text-neutral-800">
                      {vol.totalScans}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1 text-sm text-neutral-700">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {vol.avgRating.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          vol.status === "active"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-neutral-200 bg-neutral-100 text-neutral-500"
                        }
                      >
                        {vol.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-500 hover:text-neutral-700"
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View Profile</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                          title="Adjust Coins"
                          onClick={() => openCoinModal(vol)}
                        >
                          <Coins className="h-4 w-4" />
                          <span className="sr-only">Adjust Coins</span>
                        </Button>
                        {vol.status === "active" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            title="Deactivate"
                            onClick={() => handleDeactivate(vol.id)}
                          >
                            <UserX className="h-4 w-4" />
                            <span className="sr-only">Deactivate</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Coin Adjustment Modal */}
      <Dialog open={coinModalOpen} onOpenChange={setCoinModalOpen}>
        <DialogContent className="border-neutral-200 bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-neutral-900">Adjust Coins</DialogTitle>
            <DialogDescription className="text-neutral-500">
              Adjust coin balance for {selectedVolunteer?.name}. Current balance:{" "}
              <span className="font-semibold text-amber-600">{selectedVolunteer?.totalCoins.toLocaleString()}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="coin-amount" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Amount (use negative to deduct)
              </label>
              <Input
                id="coin-amount"
                type="number"
                placeholder="e.g. 50 or -20"
                value={coinAmount}
                onChange={(e) => setCoinAmount(e.target.value)}
                className="border-neutral-200 bg-white"
              />
            </div>
            <div>
              <label htmlFor="coin-reason" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Reason
              </label>
              <Textarea
                id="coin-reason"
                placeholder="Reason for adjustment..."
                value={coinReason}
                onChange={(e) => setCoinReason(e.target.value)}
                className="min-h-20 border-neutral-200 bg-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCoinModalOpen(false)}
              className="border-neutral-200 text-neutral-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCoinAdjust}
              disabled={!coinAmount || !coinReason.trim()}
              className="bg-orange-600 text-white hover:bg-orange-700 disabled:bg-neutral-200 disabled:text-neutral-400"
            >
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
