"use client"

import { ShoppingBag, Minus, Plus, Trash2, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { CartItem } from "@/context/cart-context"
import { useRouter } from "next/navigation"

interface CartSheetProps {
  cart: CartItem[]
  onUpdateQuantity: (productId: string, newQuantity: number) => void
  onRemoveItem: (productId: string) => void
  onCheckout: () => void
}

export function CartSheet({ cart, onUpdateQuantity, onRemoveItem, onCheckout }: CartSheetProps) {
  const router = useRouter()
  const cartTotal = cart.reduce((total, item) => total + item.totalPrice * item.quantity, 0)
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0)

  // Verificar se algum item tem entrega gratuita
  const hasFreeDelivery = cart.some((item) => item.hasFreeDelivery)
  // Calcular a taxa de entrega (0 se algum item tiver entrega gratuita)
  const deliveryFee = cartTotal > 0 && !hasFreeDelivery ? 20 : 0

  // Agrupar itens por ID do produto e customizações
  const groupedCart: CartItem[] = []
  cart.forEach((item) => {
    const existingItemIndex = groupedCart.findIndex(
      (groupedItem) =>
        groupedItem.product.id === item.product.id &&
        JSON.stringify(groupedItem.customizations) === JSON.stringify(item.customizations) &&
        groupedItem.customMessage === item.customMessage,
    )

    if (existingItemIndex !== -1) {
      groupedCart[existingItemIndex].quantity += item.quantity
    } else {
      groupedCart.push({ ...item })
    }
  })

  const handleContinue = () => {
    // Fechar o sheet e navegar para a página de checkout
    document.body.click() // Hack para fechar o sheet
    router.push("/checkout")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-rose-500 hover:bg-rose-600 rounded-full px-6">
          <ShoppingBag className="w-4 h-4 mr-2" />
          Ver Sacola
          {itemCount > 0 && (
            <span className="ml-2 bg-white text-rose-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="text-rose-600 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Itens Adicionados
            </SheetTitle>
          </SheetHeader>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 p-4">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500">Sua sacola está vazia</p>
              <SheetClose asChild>
                <Button variant="outline" className="mt-4 border-rose-200 text-rose-500 hover:bg-rose-50">
                  Continuar Comprando
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto">
                <div className="divide-y divide-gray-100">
                  {groupedCart.map((item, index) => (
                    <div key={`${item.product.id}-${index}`} className="p-4">
                      <div className="flex gap-3">
                        <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 relative overflow-hidden">
                          {item.product.imageUrl && (
                            <Image
                              src={item.product.imageUrl || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-rose-600 text-lg">{item.product.name}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {item.product.description?.substring(0, 30)}...
                          </p>
                          <p className="font-semibold mt-1">R$ {item.totalPrice.toFixed(2).replace(".", ",")}</p>

                          {/* Mostrar badge de entrega gratuita se aplicável */}
                          {item.hasFreeDelivery && (
                            <Badge className="mt-1 bg-rose-500 text-white px-2 py-0.5 text-xs flex items-center gap-1 w-fit">
                              <Truck className="w-3 h-3" />
                              <span>Entrega Grátis</span>
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Customizações com bullets coloridos */}
                      {item.customizations && item.customizations.length > 0 && (
                        <div className="mt-2">
                          <ul className="space-y-1">
                            {item.customizations.map((customization, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-700">
                                <span className="w-2 h-2 bg-rose-500 rounded-full mr-2"></span>
                                {customization.label === "Escolha a Massa" ? (
                                  <span>Massa {customization.value}</span>
                                ) : customization.label === "Quantidade de Recheio" ? (
                                  <span>{customization.value}</span>
                                ) : (
                                  <span>{customization.value}</span>
                                )}
                              </li>
                            ))}
                          </ul>

                          {item.customMessage && (
                            <div className="mt-2 text-sm text-gray-700">
                              <span className="w-2 h-2 bg-rose-500 rounded-full mr-2 inline-block"></span>
                              <span className="italic">"{item.customMessage}"</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Controles de quantidade */}
                      <div className="flex justify-end items-center mt-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => onRemoveItem(item.product.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center ml-4 bg-rose-100 rounded-full overflow-hidden">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-rose-600 hover:bg-rose-200"
                            onClick={() => {
                              if (item.quantity > 1) {
                                onUpdateQuantity(item.product.id, item.quantity - 1)
                              }
                            }}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-rose-600 hover:bg-rose-200"
                            onClick={() => {
                              onUpdateQuantity(item.product.id, item.quantity + 1)
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo dos valores */}
              <div className="border-t border-gray-100">
                <div className="p-4">
                  <h3 className="text-rose-600 font-medium mb-3">Resumo dos valores</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taxa de Entrega</span>
                      <div className="flex items-center gap-2">
                        {hasFreeDelivery ? (
                          <Badge className="bg-rose-500 text-white px-2 py-0.5 text-xs">Grátis</Badge>
                        ) : (
                          <span className="font-medium">R$ {deliveryFee.toFixed(2).replace(".", ",")}</span>
                        )}
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span className="text-rose-700">R$ {(cartTotal + deliveryFee).toFixed(2).replace(".", ",")}</span>
                    </div>
                  </div>
                </div>

                {/* Barra de total e botão de continuar */}
                <div className="bg-rose-700 text-white p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-90">Total do Pedido</p>
                    <p className="font-bold text-xl">R$ {(cartTotal + deliveryFee).toFixed(2).replace(".", ",")}</p>
                  </div>
                  <Button className="bg-white text-rose-700 hover:bg-gray-100 px-6" onClick={handleContinue}>
                    Continuar
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

