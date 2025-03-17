"use client"

import { useState, useEffect } from "react"
import { MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface MapLocationPickerProps {
  onLocationSelected: (location: { lat: number; lng: number; address: string }) => void
}

export function MapLocationPicker({ onLocationSelected }: MapLocationPickerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [mapUrl, setMapUrl] = useState("")

  useEffect(() => {
    // Verificar se o navegador suporta geolocalização
    if ("geolocation" in navigator) {
      // Verificar permissão atual
      navigator.permissions.query({ name: "geolocation" as PermissionName }).then((result) => {
        setHasPermission(result.state === "granted")

        // Se já tiver permissão, carregar o mapa com a localização atual
        if (result.state === "granted") {
          getCurrentLocation()
        }

        // Ouvir mudanças de permissão
        result.onchange = () => {
          setHasPermission(result.state === "granted")
        }
      })
    }
  }, [])

  const requestPermission = () => {
    setIsLoading(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setHasPermission(true)
        getCurrentLocation()
        setIsLoading(false)
      },
      (error) => {
        console.error("Erro ao obter permissão:", error)
        toast.error("Não foi possível obter permissão para acessar sua localização")
        setHasPermission(false)
        setIsLoading(false)
      },
    )
  }

  const getCurrentLocation = () => {
    setIsLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // Criar URL do mapa com a localização atual
          const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${latitude},${longitude}&zoom=17`
          setMapUrl(mapUrl)

          // Obter endereço a partir das coordenadas
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
          )

          if (!response.ok) {
            throw new Error("Não foi possível obter o endereço")
          }

          const data = await response.json()

          // Extrair informações relevantes do endereço
          const address = data.display_name || "Endereço não encontrado"

          // Notificar o componente pai sobre a localização selecionada
          onLocationSelected({
            lat: latitude,
            lng: longitude,
            address,
          })

          toast.success("Localização obtida com sucesso!")
        } catch (error) {
          console.error("Erro ao obter localização:", error)
          toast.error("Não foi possível obter sua localização")
        } finally {
          setIsLoading(false)
        }
      },
      (error) => {
        console.error("Erro de geolocalização:", error)
        toast.error("Não foi possível obter sua localização")
        setIsLoading(false)
      },
    )
  }

  return (
    <div className="space-y-4">
      {hasPermission === null || hasPermission === false ? (
        <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg">
          <MapPin className="w-12 h-12 text-rose-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Compartilhe sua localização</h3>
          <p className="text-gray-500 text-center mb-4">
            Precisamos da sua permissão para mostrar restaurantes próximos e calcular o tempo de entrega
          </p>
          <Button onClick={requestPermission} className="bg-rose-500 hover:bg-rose-600" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              "Compartilhar localização"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative w-full h-[300px] rounded-lg overflow-hidden border">
            {mapUrl ? (
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
              </div>
            )}
          </div>

          <Button onClick={getCurrentLocation} variant="outline" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atualizando localização...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Atualizar minha localização
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

