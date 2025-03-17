"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrderFooterProps {
  totalPrice: number
  onAddToCart: () => void
  isDisabled?: boolean
}

export function OrderFooter({ totalPrice, onAddToCart, isDisabled = false }: OrderFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-rose-700 text-white p-4 flex justify-between items-center z-10">
      <div>
        <p className="text-sm opacity-90">Total do Pedido</p>
        <p className="font-bold text-xl">R$ {totalPrice.toFixed(2).replace(".", ",")}</p>
      </div>
      <Button onClick={onAddToCart} className="bg-white text-rose-700 hover:bg-gray-100 px-6" disabled={isDisabled}>
        <ShoppingBag className="w-5 h-5 mr-2" />
        Adicionar à Sacola
      </Button>
    </div>
  )
}

