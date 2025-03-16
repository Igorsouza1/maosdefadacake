"use client"

import { useState } from "react"
import { ShopHeader } from "@/components/shop-header"
import { ServiceButtons } from "@/components/service-buttons"
import { CategoryTabs } from "@/components/category-tabs"
import { ProductCard } from "@/components/product-card"
import { CartSheet } from "@/components/cart-sheet"
import { toast } from "sonner"
import { categories, getProductsByCategory } from "@/data/products"
import { useFavorites } from "@/hooks/use-favorites"
import { useRouter } from "next/navigation"

interface CartItemCustomization {
  type: string
  label: string
  value: string
  price: number
}

interface CartItem {
  product: {
    id: string
    name: string
    price: number
    category: string
    description?: string
    imageUrl?: string
  }
  quantity: number
  customizations?: CartItemCustomization[]
  customMessage?: string
  totalPrice: number
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [cart, setCart] = useState<CartItem[]>([])
  const { toggleFavorite, isFavorite } = useFavorites()
  const router = useRouter()

  const filteredProducts = getProductsByCategory(selectedCategory)

  // Remova esta função:
  // const handleAddToCart = (productId: string) => {
  //   // Redirecionar para a página de personalização do produto
  //   router.push(`/product/${productId}`)
  // }

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))

    toast.info("Item removido", {
      description: "O item foi removido da sua sacola.",
      duration: 2000,
    })
  }

  const handleCheckout = () => {
    toast.success("Pedido finalizado", {
      description: "Seu pedido foi enviado com sucesso!",
      duration: 3000,
      action: {
        label: "Acompanhar",
        onClick: () => console.log("Acompanhar pedido"),
      },
    })
  }

  const cartTotal = cart.reduce((total, item) => total + item.totalPrice * item.quantity, 0)
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <main className="pb-24 bg-gray-50 min-h-screen">
      <ShopHeader name="Mãos de Fada Cake" rating={5.0} imageUrl="/bolo-andar1.jpeg" logoUrl="/logo.jpg" />

      <ServiceButtons />

      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="px-4 mt-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            description={product.description}
            imageUrl={product.imageUrl}
            onAddToCart={() => {}} // Função vazia, já que estamos usando Link diretamente
            onToggleFavorite={() => toggleFavorite(product.id)}
            isFavorite={isFavorite(product.id)}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Total do Pedido</p>
          <p className="font-bold text-rose-800 text-lg">R$ {cartTotal.toFixed(2).replace(".", ",")}</p>
        </div>
        <CartSheet
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
        />
      </div>
    </main>
  )
}

