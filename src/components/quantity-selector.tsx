"use client"

import type React from "react"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface QuantitySelectorProps {
  minQuantity: number
  maxQuantity?: number
  defaultQuantity?: number
  onChange: (quantity: number) => void
}

export function QuantitySelector({ minQuantity, maxQuantity = 100, defaultQuantity, onChange }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(defaultQuantity || minQuantity)

  useEffect(() => {
    // Inicializar com o valor padrão ou mínimo
    onChange(quantity)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const increment = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
      onChange(newQuantity)
    } else {
      toast.error(`Quantidade máxima é ${maxQuantity}`)
    }
  }

  const decrement = () => {
    if (quantity > minQuantity) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      onChange(newQuantity)
    } else {
      toast.error(`Quantidade mínima é ${minQuantity}`)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      if (value < minQuantity) {
        toast.error(`Quantidade mínima é ${minQuantity}`)
        setQuantity(minQuantity)
        onChange(minQuantity)
      } else if (value > maxQuantity) {
        toast.error(`Quantidade máxima é ${maxQuantity}`)
        setQuantity(maxQuantity)
        onChange(maxQuantity)
      } else {
        setQuantity(value)
        onChange(value)
      }
    }
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center bg-rose-100 rounded-full overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-rose-600 hover:bg-rose-200"
          onClick={decrement}
          disabled={quantity <= minQuantity}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          className="w-12 text-center bg-transparent border-none focus:outline-none text-rose-800 font-medium"
          min={minQuantity}
          max={maxQuantity}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-rose-600 hover:bg-rose-200"
          onClick={increment}
          disabled={quantity >= maxQuantity}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

