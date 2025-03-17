"use client"

import { useState } from "react"
import { ShopHeader } from "@/components/shop-header"
import { ServiceButtons } from "@/components/service-buttons"
import { ProductCard } from "@/components/product-card"
import { CartSheet } from "@/components/cart-sheet"
import { categories, getProductsByCategory } from "@/data/products"
import { useFavorites } from "@/hooks/use-favorites"
import { useCart } from "@/context/cart-context"
import { Input } from "@/components/ui/input"
import { Heart, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const { toggleFavorite, isFavorite, favorites } = useFavorites()
  const { items, updateQuantity, removeItem, totalPrice } = useCart()

  // Estados para controlar a visualização de favoritos e pesquisa
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrar produtos com base na categoria, favoritos e pesquisa
  const filteredProducts = getProductsByCategory(selectedCategory)
    .filter((product) => {
      // Filtrar por favoritos se necessário
      if (showOnlyFavorites) {
        return favorites.includes(product.id)
      }
      return true
    })
    .filter((product) => {
      // Filtrar por pesquisa se houver uma consulta
      if (searchQuery.trim() === "") return true

      return (
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })


  // Alternar visualização de favoritos
  const toggleFavoritesView = () => {
    setShowOnlyFavorites(!showOnlyFavorites)
    // Se estiver ativando a visualização de favoritos, desative a pesquisa
    if (!showOnlyFavorites) {
      setShowSearch(false)
      setSearchQuery("")
    }
  }

  // Alternar visualização da pesquisa
  const toggleSearch = () => {
    setShowSearch(!showSearch)
    // Se estiver fechando a pesquisa, limpe a consulta
    if (showSearch) {
      setSearchQuery("")
    }
    // Se estiver ativando a pesquisa, desative a visualização de favoritos
    if (!showSearch) {
      setShowOnlyFavorites(false)
    }
  }

  return (
    <main className="pb-24 bg-gray-50 min-h-screen">
      <ShopHeader name="Mãos de Fada Cake" rating={5.0} imageUrl="/bolo-andar1.jpeg" logoUrl="/logo.jpg" />

      <ServiceButtons />

      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-rose-800">Menu</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`${showOnlyFavorites ? "bg-rose-100 text-rose-600" : "text-rose-500"} hover:text-rose-600 hover:bg-rose-50`}
              onClick={toggleFavoritesView}
            >
              <Heart className={`w-5 h-5 ${showOnlyFavorites ? "fill-rose-500" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`${showSearch ? "bg-rose-100 text-rose-600" : "text-rose-500"} hover:text-rose-600 hover:bg-rose-50`}
              onClick={toggleSearch}
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Barra de pesquisa */}
        {showSearch && (
          <div className="mb-4 relative">
            <Input
              type="text"
              placeholder="Pesquisar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400"
                onClick={() => setSearchQuery("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Mostrar abas de categoria apenas se não estiver mostrando apenas favoritos */}
        {!showOnlyFavorites && !searchQuery && (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="w-full bg-rose-50 p-1 h-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm text-rose-500 py-2"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Título para a visualização de favoritos */}
        {showOnlyFavorites && (
          <div className="mt-4 mb-2">
            <h3 className="text-lg font-medium text-rose-700 flex items-center">
              <Heart className="w-4 h-4 mr-2 fill-rose-500" />
              Meus Favoritos
            </h3>
          </div>
        )}

        {/* Título para resultados da pesquisa */}
        {searchQuery && (
          <div className="mt-4 mb-2">
            <h3 className="text-lg font-medium text-rose-700">Resultados para &quot;{searchQuery}&quot;</h3>
          </div>
        )}
      </div>

      <div className="px-4 mt-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {showOnlyFavorites
                ? "Você ainda não tem produtos favoritos."
                : searchQuery
                  ? "Nenhum produto encontrado para sua pesquisa."
                  : "Nenhum produto disponível nesta categoria."}
            </p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Total do Pedido</p>
          <p className="font-bold text-rose-800 text-lg">R$ {totalPrice.toFixed(2).replace(".", ",")}</p>
        </div>
        <CartSheet cart={items} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} onCheckout={() => {}} />
      </div>
    </main>
  )
}

