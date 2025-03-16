"use client"

import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import Image from "next/image"

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

interface CartSheetProps {
  cart: CartItem[]
  onUpdateQuantity: (productId: string, newQuantity: number) => void
  onRemoveItem: (productId: string) => void
  onCheckout: () => void
}

export function CartSheet({ cart, onUpdateQuantity, onRemoveItem, onCheckout }: CartSheetProps) {
  const cartTotal = cart.reduce((total, item) => total + item.totalPrice * item.quantity, 0)
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0)

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
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-rose-800 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Sua Sacola
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
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
            <div className="mt-6 flex flex-col gap-4 flex-1 overflow-auto max-h-[70vh] pr-2">
              {cart.map((item) => (
                <div key={item.product.id} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-4 p-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 relative overflow-hidden">
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
                      <h4 className="font-medium text-rose-800">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">R$ {item.totalPrice.toFixed(2).replace(".", ",")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full border-gray-200"
                        onClick={() => {
                          onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full border-gray-200"
                        onClick={() => {
                          onUpdateQuantity(item.product.id, item.quantity + 1)
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-gray-400 hover:text-rose-500"
                        onClick={() => {
                          onRemoveItem(item.product.id)
                          toast.success("Item removido da sacola.")
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {item.customizations && item.customizations.length > 0 && (
                    <div className="bg-gray-50 p-3 text-sm">
                      <p className="font-medium text-gray-700 mb-1">Personalizações:</p>
                      <ul className="space-y-1">
                        {item.customizations.map((customization, index) => (
                          <li key={index} className="flex justify-between">
                            <span className="text-gray-600">{customization.label}:</span>
                            <span className="text-gray-800">{customization.value}</span>
                          </li>
                        ))}
                      </ul>

                      {item.customMessage && (
                        <div className="mt-2">
                          <p className="font-medium text-gray-700">Mensagem:</p>
                          <p className="text-gray-600 italic">"{item.customMessage}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4">
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Entrega</span>
                  <span>Grátis</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-rose-800">R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>

              <SheetFooter className="mt-6">
                <Button
                  className="w-full bg-rose-500 hover:bg-rose-600"
                  onClick={() => {
                    onCheckout()
                    toast.success("Pedido finalizado com sucesso!", {
                      description: "Aguarde a confirmação do pagamento.",
                    })
                  }}
                >
                  Finalizar Pedido
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

