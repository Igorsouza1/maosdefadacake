"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getProductById } from "@/data/products"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useFavorites } from "@/hooks/use-favorites"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [customMessage, setCustomMessage] = useState("")
  const [customizations, setCustomizations] = useState<Record<string, string | string[]>>({})
  const [totalPrice, setTotalPrice] = useState(0)

  const productId = params.id as string
  const product = getProductById(productId)

  useEffect(() => {
    if (product) {
      // Inicialize o preço e as customizações padrão
      setTotalPrice(product.price)

      if (product.customizationOptions) {
        const initialSelections: Record<string, string | string[]> = {}

        product.customizationOptions.forEach((option) => {
          if (option.required && !option.multiple) {
            initialSelections[option.type] = option.options[0].id
          } else if (option.multiple) {
            initialSelections[option.type] = []
          }
        })

        setCustomizations(initialSelections)
      }
    }
  }, [product])

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
        <Button onClick={() => router.push("/")} variant="outline">
          Voltar para a loja
        </Button>
      </div>
    )
  }

  const handleCustomizationChange = (type: string, value: string | string[]) => {
    const newCustomizations = { ...customizations, [type]: value }
    setCustomizations(newCustomizations)

    // Calcular o preço total com base nas seleções
    if (product.customizationOptions) {
      let additionalPrice = 0

      product.customizationOptions.forEach((option) => {
        if (option.multiple) {
          // Para opções múltiplas (checkboxes)
          const selectedValues = (newCustomizations[option.type] as string[]) || []
          selectedValues.forEach((selectedId) => {
            const selectedOption = option.options.find((opt) => opt.id === selectedId)
            if (selectedOption) {
              additionalPrice += selectedOption.price
            }
          })
        } else {
          // Para opções únicas (radio buttons)
          const selectedId = newCustomizations[option.type] as string
          if (selectedId) {
            const selectedOption = option.options.find((opt) => opt.id === selectedId)
            if (selectedOption) {
              additionalPrice += selectedOption.price
            }
          }
        }
      })

      setTotalPrice(product.price + additionalPrice)
    }
  }

  const handleAddToCart = () => {
    // Verificar se todas as opções obrigatórias foram selecionadas
    const missingRequired = product.customizationOptions?.filter(
      (option) =>
        option.required &&
        (!customizations[option.type] ||
          (Array.isArray(customizations[option.type]) && (customizations[option.type] as string[]).length === 0)),
    )

    if (missingRequired && missingRequired.length > 0) {
      toast.error("Por favor, complete todas as opções obrigatórias", {
        description: `Faltam: ${missingRequired.map((opt) => opt.label).join(", ")}`,
        duration: 3000,
      })
      return
    }

    toast.success("Produto adicionado", {
      description: `${product.name} foi adicionado à sua sacola com personalização.`,
      duration: 2000,
    })

    // Aqui você pode adicionar a lógica para salvar a personalização
    router.push("/")
  }

  // Função para renderizar as opções de personalização
  const renderCustomizationOptions = () => {
    if (!product.customizationOptions) return null

    return product.customizationOptions.map((option) => (
      <div key={option.type} className="mb-0">
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
                  </label>
                  <RadioGroupItem value={item.id} id={`${option.type}-${item.id}`} className="text-rose-500" />
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="w-full divide-y divide-gray-100">
              {option.options.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 px-4 w-full">
                  <label htmlFor={`${option.type}-${item.id}`} className="font-medium text-gray-800">
                    {item.name}
                  </label>
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
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Imagem do produto */}
      <div className="relative h-80 w-full">
        <Image
          src={product.imageUrl || "/placeholder.svg?height=400&width=800"}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 rounded-full bg-white/80"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Button>
      </div>

      {/* Informações do produto */}
      <div className="py-4 px-4 bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-rose-800">{product.name}</h1>
            <p className="text-gray-600 text-sm mt-1">{product.description}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`${isFavorite(product.id) ? "text-rose-500" : "text-gray-400"}`}
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart className={`w-6 h-6 ${isFavorite(product.id) ? "fill-rose-500" : ""}`} />
          </Button>
        </div>

        <p className="text-rose-600 font-bold text-2xl mt-2">R$ {totalPrice.toFixed(2).replace(".", ",")}</p>
      </div>

      {/* Opções de personalização */}
      <div className="w-full">
        {renderCustomizationOptions()}

        {/* Mensagem personalizada */}
        <div>
          <div className="bg-rose-400 text-white py-3 px-4">
            <h3 className="font-medium">Mensagem personalizada (Opcional)</h3>
          </div>
          <div className="bg-white py-3 px-4">
            <Textarea
              placeholder="Ex: Feliz Aniversário Maria!"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="resize-none border-gray-200 w-full"
            />
          </div>
        </div>

        {/* Botão de adicionar à sacola */}
        <div className="p-4">
          <Button className="w-full bg-rose-500 hover:bg-rose-600 py-6 text-lg font-medium" onClick={handleAddToCart}>
            <ShoppingBag className="w-5 h-5 mr-2" />
            Adicionar à Sacola
          </Button>
        </div>
      </div>
    </div>
  )
}

// Componente CustomCheckbox para ter o mesmo estilo do RadioGroupItem
function CustomCheckbox({
  id,
  checked,
  onCheckedChange,
}: { id: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <div
      className={`h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer ${checked ? "bg-rose-500 border-rose-500" : ""}`}
      onClick={() => onCheckedChange(!checked)}
    >
      {checked && <div className="h-2.5 w-2.5 rounded-full bg-white"></div>}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
    </div>
  )
}

