"use client"

import { useParams, useRouter } from "next/navigation"
import { getProductById } from "@/data/products"
import { useFavorites } from "@/hooks/use-favorites"
import { useCart } from "@/context/cart-context"
import { OrderFooter } from "@/components/order-footer"
import { ProductImage } from "@/components/product/product-image"
import { ProductHeader } from "@/components/product/product-header"
import { ProductQuantitySection } from "@/components/product/product-quantity-section"
import { ProductCustomization } from "@/components/product/product-customization"
import { ProductCustomMessage } from "@/components/product/product-custom-message"
import { useProductCustomization } from "@/hooks/use-product-customization"
import { addToCart } from "@/services/cart-service"
import { useMemo } from "react"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addItem } = useCart()

  const productId = params.id as string
  const product = getProductById(productId)

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
        <button onClick={() => router.push("/")} className="px-4 py-2 bg-rose-500 text-white rounded">
          Voltar para a loja
        </button>
      </div>
    )
  }

  // Ensure useProductCustomization is always called
  const customizationHookResult = useProductCustomization(product)

  const {
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
  } = useMemo(() => {
    return customizationHookResult
  }, [customizationHookResult])

  const handleAddToCart = () => {
    const success = addToCart({
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
    })

    if (success) {
      // Redirecionar para a página inicial
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Imagem do produto */}
      <ProductImage
        imageUrl={product.imageUrl}
        name={product.name}
        hasFreeDelivery={hasFreeDelivery}
        hasFreeTopper={hasFreeTopper}
        onBack={() => router.push("/")}
      />

      {/* Informações do produto */}
      <ProductHeader
        product={product}
        isFavorite={isFavorite(product.id)}
        onToggleFavorite={() => toggleFavorite(product.id)}
      />

      {/* Bloco de seleção de quantidade (apenas para produtos com quantityConfig) */}
      {product.quantityConfig && (
        <ProductQuantitySection
          quantityConfig={product.quantityConfig}
          category={product.category}
          setQuantity={setQuantity}
        />
      )}

      {/* Opções de personalização */}
      <div className="w-full">
        {product.customizationOptions?.map((option) => {
          // Verificar se a opção depende de outra seleção
          if (option.dependsOn) {
            const dependencyType = option.dependsOn.type
            const dependencyValue = option.dependsOn.value
            const currentValue = customizations[dependencyType] as string

            // Se a dependência não for satisfeita, não mostrar esta opção
            if (currentValue !== dependencyValue) {
              return null
            }
          }

          return (
            <ProductCustomization
              key={option.type}
              option={option}
              customizations={customizations}
              selectedFillings={selectedFillings}
              remainingFillings={remainingFillings}
              totalSelectedFillings={totalSelectedFillings}
              fillingLayers={fillingLayers}
              hasFreeTopper={hasFreeTopper}
              handleCustomizationChange={handleCustomizationChange}
              handleFillingSelection={handleFillingSelection}
            />
          )
        })}

        {/* Mensagem personalizada */}
        <ProductCustomMessage customMessage={customMessage} setCustomMessage={setCustomMessage} />
      </div>

      {/* Barra de rodapé com o total e botão de adicionar à sacola */}
      <OrderFooter totalPrice={totalPrice} onAddToCart={handleAddToCart} isDisabled={!isFormValid} />
    </div>
  )
}

