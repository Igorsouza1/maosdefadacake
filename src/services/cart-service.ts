import type { Product } from "@/data/products"
import type { CartItemCustomization } from "@/context/cart-context"
import { toast } from "sonner"

interface AddToCartParams {
  product: Product
  customizations: Record<string, string | string[]>
  selectedFillings: {
    simple: string[]
    gourmet: string[]
  }
  customMessage: string
  quantity: number
  totalPrice: number
  hasFreeDelivery: boolean
  hasFreeTopper: boolean
  fillingLayers: number
  totalSelectedFillings: number
  addItem: (item: any) => void
}

export function addToCart({
  product,
  customizations,
  selectedFillings,
  customMessage,
  quantity,
  totalPrice,
  hasFreeDelivery,
  hasFreeTopper,
  fillingLayers,
  totalSelectedFillings,
  addItem,
}: AddToCartParams) {
  // Verificar se todas as opções obrigatórias foram selecionadas
  const missingRequired = product.customizationOptions?.filter((option) => {
    // Pular opções que dependem de outras seleções
    if (option.dependsOn) {
      const dependencyType = option.dependsOn.type
      const dependencyValue = option.dependsOn.value
      const currentValue = customizations[dependencyType] as string

      // Se a dependência não for satisfeita, não é obrigatório
      if (currentValue !== dependencyValue) {
        return false
      }
    }

    if (option.type === "simpleFilling" || option.type === "gourmetFilling") {
      // Verificar se pelo menos um recheio foi selecionado
      return totalSelectedFillings === 0
    }

    return (
      option.required &&
      (!customizations[option.type] ||
        (Array.isArray(customizations[option.type]) && (customizations[option.type] as string[]).length === 0))
    )
  })

  if (missingRequired && missingRequired.length > 0) {
    toast.error("Por favor, complete todas as opções obrigatórias", {
      description: `Faltam: ${missingRequired.map((opt) => opt.label).join(", ")}`,
      duration: 3000,
    })
    return false
  }

  // Verificar se todos os recheios foram selecionados apenas se o produto tiver recheios do tipo simpleFilling/gourmetFilling
  if (
    totalSelectedFillings < fillingLayers &&
    product.customizationOptions?.some((opt) => opt.type === "simpleFilling" || opt.type === "gourmetFilling")
  ) {
    toast.error(`Por favor, selecione ${fillingLayers} recheio(s)`, {
      description: `Você selecionou ${totalSelectedFillings} de ${fillingLayers} recheios`,
      duration: 3000,
    })
    return false
  }

  // Preparar as customizações para adicionar ao carrinho
  const cartCustomizations: CartItemCustomization[] = []

  // Adicionar customizações regulares
  if (product.customizationOptions) {
    product.customizationOptions.forEach((option) => {
      // Pular opções que dependem de outras seleções e não estão ativas
      if (option.dependsOn) {
        const dependencyType = option.dependsOn.type
        const dependencyValue = option.dependsOn.value
        const currentValue = customizations[dependencyType] as string

        // Se a dependência não for satisfeita, pular esta opção
        if (currentValue !== dependencyValue) {
          return
        }
      }

      if (option.type !== "simpleFilling" && option.type !== "gourmetFilling") {
        if (option.multiple) {
          // Para opções múltiplas (checkboxes)
          const selectedValues = (customizations[option.type] as string[]) || []
          selectedValues.forEach((selectedId) => {
            const selectedOption = option.options.find((opt) => opt.id === selectedId)
            if (selectedOption) {
              cartCustomizations.push({
                type: option.type,
                label: option.label,
                value: selectedOption.name,
                price: selectedOption.price,
              })
            }
          })
        } else {
          // Para opções únicas (radio buttons)
          const selectedId = customizations[option.type] as string
          if (selectedId) {
            const selectedOption = option.options.find((opt) => opt.id === selectedId)
            if (selectedOption) {
              cartCustomizations.push({
                type: option.type,
                label: option.label,
                value: selectedOption.name,
                price: selectedOption.price,
              })
            }
          }
        }
      }
    })
  }

  // Adicionar recheios simples
  const simpleFillingOption = product.customizationOptions?.find((opt) => opt.type === "simpleFilling")
  if (simpleFillingOption && selectedFillings.simple.length > 0) {
    selectedFillings.simple.forEach((fillingId) => {
      const filling = simpleFillingOption.options.find((opt) => opt.id === fillingId)
      if (filling) {
        cartCustomizations.push({
          type: "simpleFilling",
          label: simpleFillingOption.label,
          value: filling.name,
          price: filling.price,
        })
      }
    })
  }

  // Adicionar recheios gourmet
  const gourmetFillingOption = product.customizationOptions?.find((opt) => opt.type === "gourmetFilling")
  if (gourmetFillingOption && selectedFillings.gourmet.length > 0) {
    selectedFillings.gourmet.forEach((fillingId) => {
      const filling = gourmetFillingOption.options.find((opt) => opt.id === fillingId)
      if (filling) {
        cartCustomizations.push({
          type: "gourmetFilling",
          label: gourmetFillingOption.label,
          value: filling.name,
          price: filling.price,
        })
      }
    })
  }

  // Calcular o preço unitário correto
  const unitPrice = totalPrice / quantity

  // Adicionar o item ao carrinho
  addItem({
    product: {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl,
    },
    quantity: quantity,
    customizations: cartCustomizations,
    customMessage: customMessage || undefined,
    totalPrice: unitPrice,
    hasFreeDelivery: hasFreeDelivery,
    hasFreeTopper: hasFreeTopper,
  })

  return true
}

