"use client"

import { useState, useMemo } from "react"
import { Check, X, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
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

type RedemptionStatus = "pending" | "approved" | "completed" | "rejected"

interface Redemption {
  id: string
  volunteerName: string
  method: string
  coins: number
  value: number
  requestedDate: string
  status: RedemptionStatus
}

// BACKEND_CONNECTION: Replace with fetch('/api/admin/redemptions')
const MOCK_REDEMPTIONS: Redemption[] = [
  { id: "rd1", volunteerName: "Amit Sharma", method: "UPI Transfer", coins: 500, value: 50, requestedDate: "Feb 9, 2026", status: "pending" },
  { id: "rd2", volunteerName: "Suresh Patil", method: "Paytm Wallet", coins: 300, value: 30, requestedDate: "Feb 9, 2026", status: "pending" },
  { id: "rd3", volunteerName: "Meena Gawande", method: "UPI Transfer", coins: 800, value: 80, requestedDate: "Feb 8, 2026", status: "pending" },
  { id: "rd4", volunteerName: "Ravi Kumar", method: "UPI Transfer", coins: 500, value: 50, requestedDate: "Feb 7, 2026", status: "approved" },
  { id: "rd5", volunteerName: "Priya Deshmukh", method: "Agri Coupon", coins: 400, value: 40, requestedDate: "Feb 7, 2026", status: "approved" },
  { id: "rd6", volunteerName: "Nilesh Wagh", method: "UPI Transfer", coins: 600, value: 60, requestedDate: "Feb 5, 2026", status: "completed" },
  { id: "rd7", volunteerName: "Deepak Ingle", method: "Paytm Wallet", coins: 500, value: 50, requestedDate: "Feb 4, 2026", status: "completed" },
  { id: "rd8", volunteerName: "Kiran Sonawane", method: "UPI Transfer", coins: 300, value: 30, requestedDate: "Feb 3, 2026", status: "rejected" },
  { id: "rd9", volunteerName: "Ravi Kumar", method: "Paytm Wallet", coins: 200, value: 20, requestedDate: "Feb 1, 2026", status: "completed" },
  { id: "rd10", volunteerName: "Amit Sharma", method: "Agri Coupon", coins: 400, value: 40, requestedDate: "Jan 28, 2026", status: "completed" },
]

const STATUS_TABS: { label: string; value: RedemptionStatus | "all" }[] = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
]

const statusStyles: Record<RedemptionStatus, string> = {
  pending: "border-yellow-200 bg-yellow-50 text-yellow-700",
  approved: "border-blue-200 bg-blue-50 text-blue-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
}

export default function RedemptionsPage() {
  const [activeTab, setActiveTab] = useState<RedemptionStatus | "all">("pending")
  const [redemptions, setRedemptions] = useState(MOCK_REDEMPTIONS)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject">("approve")
  const [actionTarget, setActionTarget] = useState<string[]>([])
  const [adminNote, setAdminNote] = useState("")

  const filtered = useMemo(() => {
    if (activeTab === "all") return redemptions
    return redemptions.filter((r) => r.status === activeTab)
  }, [activeTab, redemptions])

  const pendingCount = redemptions.filter((r) => r.status === "pending").length

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    const pendingIds = filtered.filter((r) => r.status === "pending").map((r) => r.id)
    const allSelected = pendingIds.every((id) => selected.has(id))
    if (allSelected) {
      setSelected((prev) => {
        const next = new Set(prev)
        for (const id of pendingIds) next.delete(id)
        return next
      })
    } else {
      setSelected((prev) => {
        const next = new Set(prev)
        for (const id of pendingIds) next.add(id)
        return next
      })
    }
  }

  function openActionModal(type: "approve" | "reject", ids: string[]) {
    setActionType(type)
    setActionTarget(ids)
    setAdminNote("")
    setActionModalOpen(true)
  }

  function handleAction() {
    // BACKEND_CONNECTION: PATCH /api/admin/redemptions/:id
    // Body: { status: actionType === 'approve' ? 'approved' : 'rejected', adminNote }
    const newStatus: RedemptionStatus = actionType === "approve" ? "approved" : "rejected"
    setRedemptions((prev) =>
      prev.map((r) =>
        actionTarget.includes(r.id) ? { ...r, status: newStatus } : r
      )
    )
    setSelected((prev) => {
      const next = new Set(prev)
      for (const id of actionTarget) next.delete(id)
      return next
    })
    setActionModalOpen(false)
  }

  const selectedPending = Array.from(selected).filter((id) =>
    redemptions.find((r) => r.id === id && r.status === "pending")
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Redemptions</h1>
          <p className="text-sm text-neutral-500">
            Manage coin redemption requests
            {pendingCount > 0 && (
              <span className="ml-1.5 font-medium text-red-600">
                ({pendingCount} pending)
              </span>
            )}
          </p>
        </div>

        {/* Bulk actions */}
        {selectedPending.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">
              {selectedPending.length} selected
            </span>
            <Button
              size="sm"
              className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => openActionModal("approve", selectedPending)}
            >
              <Check className="h-3.5 w-3.5" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
              onClick={() => openActionModal("reject", selectedPending)}
            >
              <X className="h-3.5 w-3.5" />
              Reject
            </Button>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 rounded-lg border border-neutral-200 bg-white p-1">
        {STATUS_TABS.map((tab) => {
          const count = redemptions.filter((r) => r.status === tab.value).length
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setActiveTab(tab.value)
                setSelected(new Set())
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  activeTab === tab.value
                    ? "bg-neutral-700 text-neutral-300"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-200 hover:bg-transparent">
                {activeTab === "pending" && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filtered.filter((r) => r.status === "pending").length > 0 &&
                        filtered
                          .filter((r) => r.status === "pending")
                          .every((r) => selected.has(r.id))
                      }
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                )}
                <TableHead className="text-xs font-medium text-neutral-500">Volunteer</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">Method</TableHead>
                <TableHead className="text-right text-xs font-medium text-neutral-500">Coins</TableHead>
                <TableHead className="text-right text-xs font-medium text-neutral-500">{"Value (\u20B9)"}</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">Requested</TableHead>
                <TableHead className="text-xs font-medium text-neutral-500">Status</TableHead>
                {activeTab === "pending" && (
                  <TableHead className="text-right text-xs font-medium text-neutral-500">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={activeTab === "pending" ? 8 : 6}
                    className="py-12 text-center text-sm text-neutral-400"
                  >
                    No redemptions in this category.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.id} className="border-neutral-100 hover:bg-neutral-50">
                    {activeTab === "pending" && (
                      <TableCell>
                        {r.status === "pending" && (
                          <Checkbox
                            checked={selected.has(r.id)}
                            onCheckedChange={() => toggleSelect(r.id)}
                            aria-label={`Select ${r.volunteerName}`}
                          />
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-sm font-medium text-neutral-800">
                      {r.volunteerName}
                    </TableCell>
                    <TableCell className="text-sm text-neutral-600">{r.method}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-amber-600">
                      {r.coins.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-sm text-neutral-700">
                      {"\u20B9"}{r.value.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-neutral-500">{r.requestedDate}</TableCell>
                    <TableCell>
                      <Badge className={statusStyles[r.status]}>{r.status}</Badge>
                    </TableCell>
                    {activeTab === "pending" && (
                      <TableCell className="text-right">
                        {r.status === "pending" && (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                              title="Approve"
                              onClick={() => openActionModal("approve", [r.id])}
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Approve</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                              title="Reject"
                              onClick={() => openActionModal("reject", [r.id])}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Reject</span>
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Approve/Reject Modal */}
      <Dialog open={actionModalOpen} onOpenChange={setActionModalOpen}>
        <DialogContent className="border-neutral-200 bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-neutral-900">
              {actionType === "approve" ? "Approve" : "Reject"} Redemption{actionTarget.length > 1 ? "s" : ""}
            </DialogTitle>
            <DialogDescription className="text-neutral-500">
              {actionType === "approve"
                ? `Approve ${actionTarget.length} redemption request${actionTarget.length > 1 ? "s" : ""}? Funds will be released.`
                : `Reject ${actionTarget.length} redemption request${actionTarget.length > 1 ? "s" : ""}? Coins will be returned to volunteer balance.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <label htmlFor="admin-note" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-neutral-700">
              <MessageSquare className="h-3.5 w-3.5" />
              Admin Note
            </label>
            <Textarea
              id="admin-note"
              placeholder={
                actionType === "approve"
                  ? "Optional note (e.g. payment reference)..."
                  : "Reason for rejection..."
              }
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="min-h-20 border-neutral-200 bg-white"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionModalOpen(false)}
              className="border-neutral-200 text-neutral-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              className={
                actionType === "approve"
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }
            >
              {actionType === "approve" ? "Confirm Approve" : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
