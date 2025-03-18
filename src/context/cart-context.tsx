"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { toast } from "sonner"

export interface CartItemCustomization {
  type: string
  label: string
  value: string
  price: number
}

export interface CartItem {
  product: {
    id: string
    name: string
    price: number
    category: string
    description?: string
    imageUrl?: string
  }
  quantity: number
  customizations: CartItemCustomization[]
  customMessage?: string
  totalPrice: number
  hasFreeDelivery?: boolean
  hasFreeTopper?: boolean
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (productId: string, newQuantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Carregar carrinho do localStorage quando o componente montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart")
      if (storedCart) {
        try {
          setItems(JSON.parse(storedCart))
        } catch (error) {
          console.error("Erro ao carregar carrinho:", error)
        }
      }
    }
  }, [])

  // Salvar carrinho no localStorage quando mudar
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items])

  // Adicionar item ao carrinho
  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // Verificar se o produto já existe no carrinho com as mesmas customizações
      const existingItemIndex = prevItems.findIndex((item) => {
        // Verificar se é o mesmo produto
        if (item.product.id !== newItem.product.id) return false

        // Verificar se tem a mesma mensagem personalizada
        if (item.customMessage !== newItem.customMessage) return false

        // Verificar se tem as mesmas customizações
        if (item.customizations.length !== newItem.customizations.length) return false

        // Comparar cada customização
        const sortedExistingCustomizations = [...item.customizations].sort(
          (a, b) => a.type.localeCompare(b.type) || a.value.localeCompare(b.value),
        )

        const sortedNewCustomizations = [...newItem.customizations].sort(
          (a, b) => a.type.localeCompare(b.type) || a.value.localeCompare(b.value),
        )

        for (let i = 0; i < sortedExistingCustomizations.length; i++) {
          if (
            sortedExistingCustomizations[i].type !== sortedNewCustomizations[i].type ||
            sortedExistingCustomizations[i].value !== sortedNewCustomizations[i].value
          ) {
            return false
          }
        }

        return true
      })

      if (existingItemIndex !== -1) {
        // Se o produto já existe, apenas incrementar a quantidade
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        return updatedItems
      } else {
        // Se o produto não existe, adicionar ao carrinho
        return [...prevItems, newItem]
      }
    })

    if (typeof window !== "undefined") {
      toast.success(`${newItem.product.name} adicionado à sacola`, {
        description: "Produto adicionado com sucesso!",
        duration: 3000,
      })
    }
  }

  // Atualizar quantidade de um item
  const updateQuantity = (productId: string, newQuantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item)),
    )
  }

  // Remover item do carrinho
  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  // Limpar carrinho
  const clearCart = () => {
    setItems([])
  }

  // Calcular total de itens
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  // Calcular preço total
  const totalPrice = items.reduce((total, item) => total + item.totalPrice * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

