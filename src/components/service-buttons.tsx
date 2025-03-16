"use client"

import { Truck, Paintbrush } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ServiceButtons() {
  return (
    <div className="flex justify-center gap-4 mt-40 px-4">
      <Badge variant="outline" className="py-2 px-4 bg-white border-rose-200 text-rose-600 rounded-full">
        <Truck className="w-4 h-4 mr-2" />
        Delivery Disponível
      </Badge>
      <Badge variant="outline" className="py-2 px-4 bg-white border-rose-200 text-rose-600 rounded-full">
        <Paintbrush className="w-4 h-4 mr-2" />
        Bolos Customizados
      </Badge>
    </div>
  )
}

