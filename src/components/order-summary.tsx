"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrderSummaryProps {
  total: number
  itemCount: number
  onViewCart: () => void
}

export function OrderSummary({ total, itemCount, onViewCart }: OrderSummaryProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">Total do Pedido</p>
        <p className="font-bold text-rose-800 text-lg">R$ {total.toFixed(2).replace(".", ",")}</p>
      </div>
      <Button onClick={onViewCart} className="bg-rose-500 hover:bg-rose-600 rounded-full px-6">
        <ShoppingBag className="w-4 h-4 mr-2" />
        Ver Sacola
        {itemCount > 0 && (
          <span className="ml-2 bg-white text-rose-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {itemCount}
          </span>
        )}
      </Button>
    </div>
  )
}

