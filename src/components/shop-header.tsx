import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ShopHeaderProps {
  name: string
  rating: number
  imageUrl: string
  logoUrl?: string
}

export function ShopHeader({ name, rating, imageUrl, logoUrl }: ShopHeaderProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="relative z-20">
      {/* Background Image */}
      <div className="w-full h-48 relative overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg?height=400&width=800"}
          alt={name}
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
      </div>

      {/* Shop Info Card */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-4">
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-30 h-30 -mt-16 border-4 border-white shadow-md">
                <AvatarImage src={logoUrl} alt={name} />
                <AvatarFallback className="bg-rose-100 text-rose-500 text-xl font-semibold">
                  {name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <h1 className="text-2xl font-bold mt-3 text-rose-800">{name}</h1>

              <div className="flex items-center mt-1 gap-1">
                <Badge variant="secondary" className="bg-rose-50 text-rose-700 hover:bg-rose-100">
                  <span className="font-medium">{rating.toFixed(1)}</span>
                  <div className="flex ml-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < fullStars || (i === fullStars && hasHalfStar)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </Badge>
              </div>
              <p className="text-gray-500 text-sm mt-2 text-center">
                R. Barão de Melgaço, 773 - Universitário, Corumbá - MS
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

