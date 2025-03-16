"use client"

import { useState, useEffect } from "react"
import type { ProductCustomizationOption } from "@/data/products"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

interface ProductCustomizationProps {
  options: ProductCustomizationOption[]
  onChange: (selections: Record<string, string | string[]>) => void
}

export function ProductCustomization({ options, onChange }: ProductCustomizationProps) {
  const [selections, setSelections] = useState<Record<string, string | string[]>>({})

  // Inicializar seleções com valores padrão
  useEffect(() => {
    const initialSelections: Record<string, string | string[]> = {}

    options.forEach((option) => {
      if (option.required && !option.multiple) {
        initialSelections[option.type] = option.options[0].id
      } else if (option.multiple) {
        initialSelections[option.type] = []
      }
    })

    setSelections(initialSelections)
    // Só chame onChange na inicialização, não em cada renderização
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Adicione um novo useEffect para chamar onChange quando as seleções mudarem
  useEffect(() => {
    // Evite a primeira renderização
    if (Object.keys(selections).length > 0) {
      onChange(selections)
    }
  }, [selections, onChange])

  const handleSingleSelection = (type: string, value: string) => {
    const newSelections = { ...selections, [type]: value }
    setSelections(newSelections)
    onChange(newSelections)
  }

  const handleMultipleSelection = (type: string, value: string, checked: boolean) => {
    const currentSelections = (selections[type] as string[]) || []
    let newValues: string[]

    if (checked) {
      newValues = [...currentSelections, value]
    } else {
      newValues = currentSelections.filter((item) => item !== value)
    }

    const newSelections = { ...selections, [type]: newValues }
    setSelections(newSelections)
    onChange(newSelections)
  }

  const formatPrice = (price: number) => {
    if (price === 0) return ""
    return price > 0
      ? `+R$ ${price.toFixed(2).replace(".", ",")}`
      : `-R$ ${Math.abs(price).toFixed(2).replace(".", ",")}`
  }

  return (
    <div className="space-y-8">
      {options.map((option) => (
        <div key={option.type} className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-medium text-rose-800">
              {option.label}
              {option.required && <span className="text-rose-500 ml-1">*</span>}
            </Label>
          </div>

          {!option.multiple ? (
            <RadioGroup
              value={(selections[option.type] as string) || ""}
              onValueChange={(value) => handleSingleSelection(option.type, value)}
              className="grid grid-cols-1 gap-2"
            >
              {option.options.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-rose-50">
                  <RadioGroupItem value={item.id} id={`${option.type}-${item.id}`} />
                  <Label htmlFor={`${option.type}-${item.id}`} className="flex-1 cursor-pointer">
                    {item.name}
                  </Label>
                  {item.price !== 0 && (
                    <span className={`text-sm font-medium ${item.price > 0 ? "text-rose-600" : "text-green-600"}`}>
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {option.options.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 border rounded-md p-3 hover:bg-rose-50">
                  <Checkbox
                    id={`${option.type}-${item.id}`}
                    checked={((selections[option.type] as string[]) || []).includes(item.id)}
                    onCheckedChange={(checked) => handleMultipleSelection(option.type, item.id, checked as boolean)}
                  />
                  <Label htmlFor={`${option.type}-${item.id}`} className="flex-1 cursor-pointer">
                    {item.name}
                  </Label>
                  {item.price !== 0 && (
                    <span className={`text-sm font-medium ${item.price > 0 ? "text-rose-600" : "text-green-600"}`}>
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <Separator />
        </div>
      ))}
    </div>
  )
}

