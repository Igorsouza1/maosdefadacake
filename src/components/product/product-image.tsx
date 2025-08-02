import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Truck, Gift } from 'lucide-react'

interface ProductImageProps {
  imageUrl: string
  name: string
  hasFreeDelivery: boolean
  hasFreeTopper: boolean
  onBack: () => void
}

export function ProductImage({ 
  imageUrl, 
  name, 
  hasFreeDelivery, 
  hasFreeTopper, 
  onBack 
}: ProductImageProps) {
  return (
    <div className="relative h-80 w-full">
      <Image
        src={imageUrl || "/placeholder.svg?height=400&width=800"}
        alt={name}
        fill
        className="object-cover"
        priority
      />

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 rounded-full bg-white/80"
        onClick={onBack}
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </Button>

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {hasFreeDelivery && (
          <Badge className="bg-rose-500 text-white px-3 py-1 flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>Entrega Grátis</span>
          </Badge>
        )}
        {hasFreeTopper && (
          <Badge className="bg-rose-500 text-white px-3 py-1 flex items-center gap-1">
            <Gift className="w-3 h-3" />
            <span>Topper Grátis</span>
          </Badge>
        )}
      </div>
    </div>
  )
}
