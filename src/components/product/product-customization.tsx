"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { CustomCheckbox } from "./custom-checkbox"
import type { ProductCustomizationOption } from "@/data/products"
import { getSizeMultiplier } from "@/data/products"

interface ProductCustomizationProps {
  option: ProductCustomizationOption
  customizations: Record<string, string | string[]>
  selectedFillings: {
    simple: string[]
    gourmet: string[]
  }
  remainingFillings: number
  totalSelectedFillings: number
  fillingLayers: number
  hasFreeTopper: boolean
  gourmetFillingMultiplier?: number
  handleCustomizationChange: (type: string, value: string | string[]) => void
  handleFillingSelection?: (fillingType: "simple" | "gourmet", fillingId: string, isSelected: boolean) => boolean
}

export function ProductCustomization({
  option,
  customizations,
  selectedFillings,
  remainingFillings,
  totalSelectedFillings,
  fillingLayers,
  hasFreeTopper,
  gourmetFillingMultiplier = 1,
  handleCustomizationChange,
  handleFillingSelection,
}: ProductCustomizationProps) {
  // Renderização especial para recheios
  if (option.type === "simpleFilling" || option.type === "gourmetFilling") {
    const isSimple = option.type === "simpleFilling"
    const fillingType = isSimple ? "simple" : "gourmet"
    const selectedIds = selectedFillings[fillingType]
    
    // Determinar se devemos mostrar o multiplicador
    const selectedSizeId = customizations["cakeSize"] as string
    const sizeMultiplier = selectedSizeId ? getSizeMultiplier(selectedSizeId) : 1
    const showMultiplier = !isSimple && sizeMultiplier > 1

    return (
      <div className="mb-0">
        <div className="bg-rose-400 text-white py-3 px-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium">
              {option.label}
              {showMultiplier && <span className="ml-2">(x{sizeMultiplier})</span>}
            </h3>
            <p className="text-sm opacity-90">
              {remainingFillings > 0 ? `Escolha até ${remainingFillings} opção(ões)` : "Limite de recheios atingido"}
            </p>
          </div>
          <Badge variant="secondary" className="bg-white text-rose-500">
            {totalSelectedFillings} / {fillingLayers}
          </Badge>
        </div>

        <div className="bg-white w-full">
          <div className="w-full divide-y divide-gray-100">
            {option.options.map((item) => {
              const isChecked = selectedIds.includes(item.id)
              // Calcular o preço com multiplicador para exibição
              const displayPrice = isSimple ? item.price : item.price * sizeMultiplier

              return (
                <div key={item.id} className="flex items-center justify-between py-3 px-4 w-full">
                  <span className="font-medium text-gray-800">
                    {item.name}
                    {displayPrice > 0 && (
                      <span className="ml-2 text-sm text-rose-600">
                        +R$ {displayPrice.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </span>
                  <CustomCheckbox
                    id={`${option.type}-${item.id}`}
                    checked={isChecked}
                    disabled={!isChecked && remainingFillings === 0}
                    onCheckedChange={(checked) => {
                      if (handleFillingSelection) {
                        return handleFillingSelection(fillingType, item.id, checked as boolean)
                      }
                      return true
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Adicionar renderização especial para topper quando é gratuito
  if (option.type === "topper" && hasFreeTopper) {
    return (
      <div className="mb-0">
        <div className="bg-rose-400 text-white py-3 px-4 flex justify-between items-center">
          <div>
            <h3 className="font-medium">{option.label}</h3>
            {option.required && <p className="text-sm opacity-90">Escolha 1 opção</p>}
          </div>
          <Badge variant="secondary" className="bg-white text-rose-500">
            Grátis
          </Badge>
        </div>

        <div className="bg-white w-full">
          <RadioGroup
            value={(customizations[option.type] as string) || ""}
            onValueChange={(value) => handleCustomizationChange(option.type, value)}
            className="w-full divide-y divide-gray-100"
          >
            {option.options.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 px-4 w-full">
                <label htmlFor={`${option.type}-${item.id}`} className="font-medium text-gray-800">
                  {item.name}
                  <span className="ml-2 text-sm text-green-600">Grátis</span>
                </label>
                <RadioGroupItem value={item.id} id={`${option.type}-${item.id}`} className="text-rose-500" />
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    )
  }

  // Renderização normal para outras opções
  return (
    <div className="mb-0">
      <div className="bg-rose-400 text-white py-3 px-4">
        <h3 className="font-medium">{option.label}</h3>
        {option.required && <p className="text-sm opacity-90">Escolha 1 opção</p>}
      </div>

      <div className="bg-white w-full">
        {!option.multiple ? (
          <RadioGroup
            value={(customizations[option.type] as string) || ""}
            onValueChange={(value) => handleCustomizationChange(option.type, value)}
            className="w-full divide-y divide-gray-100"
          >
            {option.options.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 px-4 w-full">
                <label htmlFor={`${option.type}-${item.id}`} className="font-medium text-gray-800">
                  {item.name}
                  {item.price !== 0 && (
                    <span className={`ml-2 text-sm ${item.price > 0 ? "text-rose-600" : "text-green-600"}`}>
                      {item.price > 0
                        ? `+R$ ${item.price.toFixed(2).replace(".", ",")}`
                        : `-R$ ${Math.abs(item.price).toFixed(2).replace(".", ",")}`}
                    </span>
                  )}
                </label>
                <RadioGroupItem value={item.id} id={`${option.type}-${item.id}`} className="text-rose-500" />
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="w-full divide-y divide-gray-100">
            {option.options.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 px-4 w-full">
                <span className="font-medium text-gray-800">
                  {item.name}
                  {item.price !== 0 && (
                    <span className={`ml-2 text-sm ${item.price > 0 ? "text-rose-600" : "text-green-600"}`}>
                      {item.price > 0
                        ? `+R$ ${item.price.toFixed(2).replace(".", ",")}`
                        : `-R$ ${Math.abs(item.price).toFixed(2).replace(".", ",")}`}
                    </span>
                  )}
                </span>
                <CustomCheckbox
                  id={`${option.type}-${item.id}`}
                  checked={((customizations[option.type] as string[]) || []).includes(item.id)}
                  onCheckedChange={(checked) => {
                    const currentSelections = (customizations[option.type] as string[]) || []
                    let newValues: string[]

                    if (checked) {
                      newValues = [...currentSelections, item.id]
                    } else {
                      newValues = currentSelections.filter((id) => id !== item.id)
                    }

                    handleCustomizationChange(option.type, newValues)
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
