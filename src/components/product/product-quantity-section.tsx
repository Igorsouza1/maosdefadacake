import { QuantitySelector } from "@/components/quantity-selector"
import { QuantityConfig } from "@/data/products"

interface ProductQuantitySectionProps {
  quantityConfig: QuantityConfig
  category: string
  setQuantity: (quantity: number) => void
}

export function ProductQuantitySection({ 
  quantityConfig, 
  category, 
  setQuantity 
}: ProductQuantitySectionProps) {
  return (
    <div className="mb-0">
      <div className="bg-rose-400 text-white py-3 px-4">
        <h3 className="font-medium">Quantidade</h3>
        <p className="text-sm opacity-90">
          Mínimo: {quantityConfig.minQuantity} {category === "Cupcake" ? "unidades" : "unidades"}
        </p>
      </div>
      <div className="bg-white w-full py-3 px-4 flex justify-between items-center">
        <span className="font-medium text-gray-800">Selecione a quantidade</span>
        <QuantitySelector
          minQuantity={quantityConfig.minQuantity}
          maxQuantity={quantityConfig.maxQuantity}
          defaultQuantity={quantityConfig.defaultQuantity || quantityConfig.minQuantity}
          onChange={setQuantity}
        />
      </div>
    </div>
  )
}
