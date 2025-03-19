import { Button } from "@/components/ui/button"
import { Heart } from 'lucide-react'
import { Product } from "@/data/products"

interface ProductHeaderProps {
  product: Product
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function ProductHeader({ product, isFavorite, onToggleFavorite }: ProductHeaderProps) {
  return (
    <div className="py-4 px-4 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-rose-800">{product.name}</h1>
          <p className="text-gray-600 text-sm mt-1">{product.description}</p>

          {/* Informações sobre benefícios para bolo de andar */}
          {product.id === "4" && (
            <div className="mt-2 text-sm">
              <p className="text-rose-600 font-medium">Benefícios especiais para bolo de 3 andares:</p>
              <ul className="list-disc list-inside text-gray-600 ml-2">
                <li>Entrega gratuita</li>
                <li>Topper gratuito</li>
              </ul>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`${isFavorite ? "text-rose-500" : "text-gray-400"}`}
          onClick={onToggleFavorite}
        >
          <Heart className={`w-6 h-6 ${isFavorite ? "fill-rose-500" : ""}`} />
        </Button>
      </div>
    </div>
  )
}
