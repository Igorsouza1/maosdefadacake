"use client"

import { Plus, Heart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  id: string
  name: string
  price: number
  imageUrl?: string
  description?: string
  onAddToCart?: () => void
  onToggleFavorite: () => void
  isFavorite: boolean
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  description,
  onToggleFavorite,
  isFavorite,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden border-none shadow-md mb-4">
      <div className="relative">
        {imageUrl && (
          <div className="relative w-full h-48 bg-gray-100">
            <Image src={imageUrl || "/placeholder.svg?height=200&width=400"} alt={name} fill className="object-cover" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 rounded-full bg-white/80 ${isFavorite ? "text-rose-500" : "text-gray-400"}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleFavorite()
          }}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-rose-500" : ""}`} />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-2xl text-rose-800">{name}</h3>
        {description && <p className="text-gray-500 text-sm mt-1 line-clamp-2">{description}</p>}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <p className="font-bold text-2xl text-rose-600">R$ {price.toFixed(2).replace(".", ",")}</p>
        <Link href={`/product/${id}`}>
          <Button size="icon" className="rounded-full bg-rose-500 hover:bg-rose-600 h-8 w-8">
            <Plus className="w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

