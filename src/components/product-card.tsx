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
    <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 mb-4 group flex flex-col rounded-2xl bg-white ">
      <div className="relative w-full aspect-square overflow-hidden bg-rose-50/50">
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 rounded-2xl" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <Image 
              src="/placeholder.svg?height=400&width=400" 
              alt={name} 
              fill 
              className="object-cover transition-transform duration-700 disabled:opacity-0 rounded-2xl" 
            />
          </div>
        )}
        
        {/* Subtle gradient so the heart button always remains visible overlaying the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 rounded-full bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:bg-white hover:scale-110 z-10 ${
            isFavorite ? "text-rose-500" : "text-gray-400"
          }`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleFavorite()
          }}
        >
          <Heart className={`w-5 h-5 transition-transform duration-300 ${isFavorite ? "fill-rose-500 scale-110" : "scale-100"}`} />
        </Button>
      </div>
      
      <CardContent className="p-4 md:p-5 flex-grow flex flex-col justify-start">
        <h3 className="font-bold text-xl text-rose-950 line-clamp-2 group-hover:text-rose-600 transition-colors duration-300 leading-tight">
          {name}
        </h3>
        {description && (
          <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-end p-4 md:p-5 pt-0 mt-auto">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-medium tracking-wider uppercase mb-1">Preço</span>
          <p className="font-black text-2xl text-rose-600 tracking-tight">
            R$ {price.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <Link href={`/product/${id}`} className="z-10">
          <Button 
            size="icon" 
            className="rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 h-12 w-12"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

