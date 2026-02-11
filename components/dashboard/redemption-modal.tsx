"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface RedemptionModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  method: string
  coins: number
  destination: string
}

export function RedemptionModal({
  open,
  onClose,
  onConfirm,
  method,
  coins,
  destination,
}: RedemptionModalProps) {
  const valueInRupees = Math.floor(coins / 10)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-neutral-200 bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-neutral-900">Confirm Redemption</DialogTitle>
          <DialogDescription className="text-neutral-500">
            Please review the details below before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 rounded-lg bg-neutral-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Method</span>
            <span className="font-medium text-neutral-800">{method}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Destination</span>
            <span className="font-medium text-neutral-800">{destination}</span>
          </div>
          <Separator className="bg-neutral-200" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Coins to redeem</span>
            <span className="font-bold text-amber-600">{coins.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Value</span>
            <span className="font-bold text-green-700">Rs. {valueInRupees.toLocaleString()}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="border-neutral-200 text-neutral-700 bg-transparent">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-green-600 text-white hover:bg-green-700">
            Confirm Redemption
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
