"use client"

import { useState } from "react"
import { ShopHeader } from "@/components/shop-header"
import { ServiceButtons } from "@/components/service-buttons"
import { CategoryTabs } from "@/components/category-tabs"
import { ProductCard } from "@/components/product-card"
import { CartSheet } from "@/components/cart-sheet"
import { categories, getProductsByCategory } from "@/data/products"
import { useFavorites } from "@/hooks/use-favorites"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const { toggleFavorite, isFavorite } = useFavorites()
  const { items, updateQuantity, removeItem, totalPrice } = useCart()
  const router = useRouter()

  const filteredProducts = getProductsByCategory(selectedCategory)
  const cartItemCount = items.reduce((count, item) => count + item.quantity, 0)

  const handleCheckout = () => {
    // Implementar lógica de checkout
  }

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
          <p className="font-bold text-rose-800 text-lg">R$ {totalPrice.toFixed(2).replace(".", ",")}</p>
        </div>
        <CartSheet
          cart={items}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={handleCheckout}
        />
      </div>
    </main>
  )
}

