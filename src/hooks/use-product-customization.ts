"use client"

import { useState, useEffect, useMemo } from "react"
import type { Product } from "@/data/products"
import { toast } from "sonner"

export function useProductCustomization(product: Product) {
  const [customizations, setCustomizations] = useState<Record<string, string | string[]>>({})
  const [selectedFillings, setSelectedFillings] = useState({
    simple: [] as string[],
    gourmet: [] as string[],
  })
  const [customMessage, setCustomMessage] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)

  // Determinar o número total de camadas de recheio permitidas
  const fillingLayers = useMemo(() => {
    if (!product?.customizationOptions) return 1

    const fillingLayersOption = product.customizationOptions.find((opt) => opt.type === "fillingLayers")
    if (!fillingLayersOption) return 1

    const selectedLayerId = customizations["fillingLayers"] as string
    if (!selectedLayerId) return 1

    // Extrair o número da string "X Camadas"
    return selectedLayerId === "one" ? 1 : 2
  }, [product, customizations])

  // Total de recheios selecionados
  const totalSelectedFillings = useMemo(() => {
    return selectedFillings.simple.length + selectedFillings.gourmet.length
  }, [selectedFillings])

  // Recheios restantes que podem ser selecionados
  const remainingFillings = useMemo(() => {
    return Math.max(0, fillingLayers - totalSelectedFillings)
  }, [fillingLayers, totalSelectedFillings])

  // Verificar se o formulário é válido
  const isFormValid = useMemo(() => {
    if (!product?.customizationOptions) return true

    // Verificar se todos os recheios foram selecionados
    if (
      totalSelectedFillings < fillingLayers &&
      product.customizationOptions.some((opt) => opt.type === "simpleFilling" || opt.type === "gourmetFilling")
    ) {
      return false
    }

    // Verificar outras opções obrigatórias
    const missingRequired = product.customizationOptions.filter((option) => {
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

      // Para todas as outras opções, incluindo "filling" do bolo vulcão
      return (
        option.required &&
        (!customizations[option.type] ||
          (Array.isArray(customizations[option.type]) && (customizations[option.type] as string[]).length === 0))
      )
    })

    return missingRequired.length === 0
  }, [product, customizations, totalSelectedFillings, fillingLayers])

  // Verificar se o produto tem entrega gratuita
  const hasFreeDelivery = useMemo(() => {
    // Bolo Aquário sempre tem entrega gratuita
    if (product?.id === "9") return true

    // Bolo de Andar tem entrega gratuita apenas para 3 andares
    if (product?.id === "4") {
      const selectedSize = customizations["cakeSize"] as string
      return selectedSize === "tresandares" // ID do tamanho de 3 andares
    }

    return false
  }, [product?.id, customizations])

  // Verificar se o produto tem topper gratuito
  const hasFreeTopper = useMemo(() => {
    // Bolo de Andar tem topper gratuito apenas para 3 andares
    if (product?.id === "4") {
      const selectedSize = customizations["cakeSize"] as string
      return selectedSize === "tresandares" // ID do tamanho de 3 andares
    }

    return false
  }, [product?.id, customizations])

  // Inicializar a quantidade com base na configuração do produto
  useEffect(() => {
    if (product?.quantityConfig) {
      setQuantity(product.quantityConfig.defaultQuantity || product.quantityConfig.minQuantity)
    } else {
      setQuantity(1)
    }
  }, [product])

  // Inicializar as customizações
  useEffect(() => {
    if (product) {
      if (product.customizationOptions) {
        const initialSelections: Record<string, string | string[]> = {}

        product.customizationOptions.forEach((option) => {
          if (
            option.required &&
            !option.multiple &&
            option.type !== "simpleFilling" &&
            option.type !== "gourmetFilling" &&
            !option.dependsOn // Não inicializar opções que dependem de outras
          ) {
            initialSelections[option.type] = option.options[0].id
          } else if (option.multiple && option.type !== "simpleFilling" && option.type !== "gourmetFilling") {
            initialSelections[option.type] = []
          }
        })

        setCustomizations(initialSelections)
      }
    }
  }, [product])

  // Calcular o preço total
  useEffect(() => {
    if (!product) return

    let totalItemPrice = 0

    // Tratamento especial para cupcakes (ID 8)
    if (product.id === "8") {
      const cakeTypeId = customizations["cakeType"] as string
      if (cakeTypeId) {
        const cakeTypeOption = product.customizationOptions?.find((opt) => opt.type === "cakeType")
        const selectedType = cakeTypeOption?.options.find((opt) => opt.id === cakeTypeId)
        // Use apenas o preço da opção selecionada
        totalItemPrice = selectedType?.price || product.price
      } else {
        totalItemPrice = product.price
      }

      // Multiplicar pelo quantidade e retornar imediatamente para evitar cálculos adicionais
      setTotalPrice(totalItemPrice * quantity)
      return
    }

    // Para produtos com opção de tamanho, o preço base vem do tamanho selecionado
    if (product.customizationOptions) {
      const sizeOption = product.customizationOptions.find((opt) => opt.type === "cakeSize")

      if (sizeOption) {
        // Se existe opção de tamanho, o preço base é determinado pelo tamanho selecionado
        const selectedSizeId = customizations["cakeSize"] as string
        if (selectedSizeId) {
          const selectedSize = sizeOption.options.find((opt) => opt.id === selectedSizeId)
          if (selectedSize) {
            totalItemPrice = selectedSize.price
          }
        } else {
          // Se nenhum tamanho foi selecionado ainda, use o preço do primeiro tamanho
          totalItemPrice = sizeOption.options[0].price
        }
      } else if (product.id === "11") {
        // Para docinhos (id 11), o preço vem da opção de quantidade
        const quantidadeOption = product.customizationOptions.find((opt) => opt.type === "quantidade")
        const selectedQuantidadeId = customizations["quantidade"] as string

        if (quantidadeOption && selectedQuantidadeId) {
          const selectedQuantidade = quantidadeOption.options.find((opt) => opt.id === selectedQuantidadeId)
          if (selectedQuantidade) {
            totalItemPrice = selectedQuantidade.price
          } else {
            totalItemPrice = product.price
          }
        } else {
          totalItemPrice = product.price
        }
      } else {
        // Para produtos sem opção de tamanho, use o preço base
        totalItemPrice = product.price
      }

      // Adicionar preço das outras customizações (exceto tamanho e quantidade)
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

        // Pulamos as opções de tamanho e quantidade, pois já foram tratadas acima
        if (
          option.type !== "cakeSize" &&
          option.type !== "quantidade" &&
          option.type !== "simpleFilling" &&
          option.type !== "gourmetFilling"
        ) {
          // Se for topper e o produto tem topper gratuito, não adicionar ao preço
          if (option.type === "topper" && hasFreeTopper) {
            return
          }

          if (option.multiple) {
            // Para opções múltiplas (checkboxes)
            const selectedValues = (customizations[option.type] as string[]) || []
            selectedValues.forEach((selectedId) => {
              const selectedOption = option.options.find((opt) => opt.id === selectedId)
              if (selectedOption) {
                totalItemPrice += selectedOption.price
              }
            })
          } else {
            // Para opções únicas (radio buttons)
            const selectedId = customizations[option.type] as string
            if (selectedId) {
              const selectedOption = option.options.find((opt) => opt.id === selectedId)
              if (selectedOption) {
                totalItemPrice += selectedOption.price
              }
            }
          }
        }
      })
    } else {
      // Se não há opções de customização, use o preço base do produto
      totalItemPrice = product.price
    }

    // Adicionar preço dos recheios simples
    const simpleFillingOption = product.customizationOptions?.find((opt) => opt.type === "simpleFilling")
    if (simpleFillingOption) {
      selectedFillings.simple.forEach((fillingId) => {
        const filling = simpleFillingOption.options.find((opt) => opt.id === fillingId)
        if (filling) {
          totalItemPrice += filling.price
        }
      })
    }

    // Adicionar preço dos recheios gourmet
    const gourmetFillingOption = product.customizationOptions?.find((opt) => opt.type === "gourmetFilling")
    if (gourmetFillingOption) {
      selectedFillings.gourmet.forEach((fillingId) => {
        const filling = gourmetFillingOption.options.find((opt) => opt.id === fillingId)
        if (filling) {
          totalItemPrice += filling.price
        }
      })
    }

    // Multiplicar pelo quantidade
    setTotalPrice(totalItemPrice * quantity)
  }, [product, customizations, selectedFillings, quantity, hasFreeTopper])

  const handleCustomizationChange = (type: string, value: string | string[]) => {
    // Se for uma mudança nas camadas de recheio, resetamos as seleções de recheio
    if (type === "fillingLayers") {
      setSelectedFillings({
        simple: [],
        gourmet: [],
      })
    }

    const newCustomizations = { ...customizations, [type]: value }
    setCustomizations(newCustomizations)
  }

  const handleFillingSelection = (fillingType: "simple" | "gourmet", fillingId: string, isSelected: boolean) => {
    if (isSelected) {
      // Se estamos tentando adicionar um recheio
      if (totalSelectedFillings >= fillingLayers) {
        // Já atingimos o limite de recheios
        toast.error(`Você já selecionou ${fillingLayers} recheio(s)`, {
          description: "Remova um recheio antes de adicionar outro",
          duration: 3000,
        })
        return false
      }

      // Adicionar o recheio
      setSelectedFillings((prev) => ({
        ...prev,
        [fillingType]: [...prev[fillingType], fillingId],
      }))
      return true
    } else {
      // Remover o recheio
      setSelectedFillings((prev) => ({
        ...prev,
        [fillingType]: prev[fillingType].filter((id) => id !== fillingId),
      }))
      return true
    }
  }

  return {
    customizations,
    selectedFillings,
    customMessage,
    quantity,
    totalPrice,
    fillingLayers,
    totalSelectedFillings,
    remainingFillings,
    isFormValid,
    hasFreeDelivery,
    hasFreeTopper,
    setCustomMessage,
    setQuantity,
    handleCustomizationChange,
    handleFillingSelection,
  }
}

