"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ChevronDown, MapPin, Store, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { AddressDialog, type Address } from "@/components/address-dialog"
import { Badge } from "@/components/ui/badge"

// ========================= CONSTANTES =========================
const DELIVERY_FEE = 20.0
const WHATSAPP_NUMBER = "5567996184308" // Apenas dígitos

// Horários disponíveis para entrega
const DELIVERY_HOURS = ["13:30", "17:30", "18:00", "19:00"]

// Horários disponíveis para retirada na loja
const PICKUP_HOURS = ["11:00", "12:00", "15:00", "18:00", "19:00"]

const ADDRESS_STORAGE_KEY = "user-delivery-address"

// ========================= HELPERS NOVOS =========================
function buildWhatsAppUrl(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "")
  const encoded = encodeURIComponent(text)
  return {
    waMe: `https://wa.me/${digits}?text=${encoded}`,
    waScheme: `whatsapp://send?phone=${digits}&text=${encoded}`,
    webWhats: `https://web.whatsapp.com/send?phone=${digits}&text=${encoded}`,
  }
}

// Abre o WhatsApp evitando bloqueios de pop-up
function openWhatsAppSafely(urls: { waMe: string; waScheme: string; webWhats: string }) {
  // Pré-abre uma aba sincronamente (mais difícil de ser bloqueada)
  const win = window.open("", "_blank")

  // 1) Tenta wa.me
  try {
    if (win) {
      win.location.href = urls.waMe
      return true
    } else {
      window.location.href = urls.waMe
      return true
    }
  } catch {}

  // 2) Tenta esquema nativo (bom em iOS/Android)
  try {
    if (win) {
      win.location.href = urls.waScheme
      return true
    } else {
      window.location.href = urls.waScheme
      return true
    }
  } catch {}

  // 3) Tenta Web WhatsApp (desktop)
  try {
    if (win) {
      win.location.href = urls.webWhats
      return true
    } else {
      window.location.href = urls.webWhats
      return true
    }
  } catch {}

  return false
}

// ========================= COMPONENTE =========================
export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string | undefined>(undefined)
  const [timeOpen, setTimeOpen] = useState(false)
  const [address, setAddress] = useState<Address | null>(null)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Verificar se algum produto tem entrega gratuita
  const hasFreeDelivery = useMemo(() => {
    return items.some((item) => item.hasFreeDelivery)
  }, [items])

  // Horários disponíveis com base no tipo de entrega
  const availableHours = useMemo(() => {
    return deliveryType === "delivery" ? DELIVERY_HOURS : PICKUP_HOURS
  }, [deliveryType])

  // Resetar o horário quando o tipo de entrega mudar
  useEffect(() => {
    setTime(undefined)
  }, [deliveryType])

  // Carregar endereço do localStorage quando o componente montar
  useEffect(() => {
    const storedAddress = localStorage.getItem(ADDRESS_STORAGE_KEY)
    if (storedAddress) {
      try {
        setAddress(JSON.parse(storedAddress))
      } catch (error) {
        console.error("Erro ao carregar endereço:", error)
      }
    }
  }, [])

  // Data mínima é amanhã (não permitir pedidos para o mesmo dia)
  const minDate = addDays(new Date(), 1)

  const handleSaveAddress = (newAddress: Address) => {
    setAddress(newAddress)
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(newAddress))
    toast.success("Endereço salvo com sucesso!")
  }

  // Calcular a taxa de entrega (0 se tiver entrega gratuita)
  const deliveryFee = useMemo(() => {
    if (deliveryType === "pickup" || hasFreeDelivery) {
      return 0
    }
    return DELIVERY_FEE
  }, [deliveryType, hasFreeDelivery])

  // >>> ALTERADO: não faz encodeURIComponent aqui; retorna texto puro com \n
  const formatWhatsAppMessage = () => {
    if (!date || !time) return ""

    const formattedDate = format(date, "dd/MM/yyyy", { locale: ptBR })

    let message = `*NOVO PEDIDO - MÃOS DE FADA CAKE*\n\n`
    message += `*Tipo de Entrega:* ${deliveryType === "delivery" ? "Entrega" : "Retirada na Loja"}\n`
    message += `*Data:* ${formattedDate}\n`
    message += `*Horário:* ${time}\n\n`

    if (deliveryType === "delivery" && address) {
      message += `*Endereço de Entrega:*\n`
      message += `${address.street}, ${address.number}\n`
      if (address.complement) {
        message += `${address.complement}\n`
      }
      message += `${address.neighborhood}\n\n`
    }

    message += `*ITENS DO PEDIDO:*\n\n`

    items.forEach((item, index) => {
      message += `*${index + 1}. ${item.product.name}*\n`
      message += `Quantidade: ${item.quantity}\n`
      message += `Valor unitário: R$ ${item.totalPrice.toFixed(2).replace(".", ",")}\n`

      if (item.customizations && item.customizations.length > 0) {
        message += `*Customizações:*\n`
        const customizationsByType: Record<string, string[]> = {}
        item.customizations.forEach((customization) => {
          if (!customizationsByType[customization.label]) {
            customizationsByType[customization.label] = []
          }
          customizationsByType[customization.label].push(customization.value)
        })
        Object.entries(customizationsByType).forEach(([label, values]) => {
          message += `- ${label}: ${values.join(", ")}\n`
        })
      }

      if (item.customMessage) {
        message += `*Mensagem:* "${item.customMessage}"\n`
      }
      if (item.hasFreeDelivery) {
        message += `*Entrega:* Grátis\n`
      }
      if (item.hasFreeTopper) {
        message += `*Topper:* Grátis\n`
      }
      message += `\n`
    })

    message += `*RESUMO DE VALORES:*\n`
    message += `Subtotal: R$ ${totalPrice.toFixed(2).replace(".", ",")}\n`
    message += `Taxa de entrega: ${
      deliveryFee === 0 ? "Grátis" : `R$ ${deliveryFee.toFixed(2).replace(".", ",")}`
    }\n`
    message += `*Total: R$ ${(totalPrice + deliveryFee).toFixed(2).replace(".", ",")}`

    return message
  }

  // >>> ALTERADO: abre WhatsApp antes do await (evita bloqueio) e tenta múltiplos esquemas
  const handleFinishOrder = async () => {
    if (!date) {
      toast.error("Por favor, selecione uma data para o pedido")
      return
    }
    if (!time) {
      toast.error("Por favor, selecione um horário para o pedido")
      return
    }
    if (deliveryType === "delivery" && !address) {
      toast.error("Por favor, adicione um endereço de entrega")
      return
    }

    setIsSubmitting(true)

    // 1) Monta mensagem antes de qualquer await
    const whatsappMessage = formatWhatsAppMessage()
    if (!whatsappMessage) {
      toast.error("Não foi possível montar a mensagem do WhatsApp. Verifique data e horário.")
      setIsSubmitting(false)
      return
    }

    const urls = buildWhatsAppUrl(WHATSAPP_NUMBER, whatsappMessage)

    // 2) Abre WhatsApp sincronamente (minimiza bloqueio de pop-up)
    const opened = openWhatsAppSafely(urls)

    // 3) Em paralelo, registra o pedido (não bloqueia o WhatsApp)
    try {
      const orderData = {
        deliveryType,
        date: format(date, "dd/MM/yyyy"),
        time,
        address,
        items,
        totalPrice,
        deliveryFee,
      }

      const response = await fetch("/api/submit-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Falha ao registrar o pedido na planilha.")
      }
    } catch (error) {
      console.error("Erro ao enviar pedido:", error)
      toast.error("Seu pedido abriu no WhatsApp, mas houve erro ao registrar na planilha.")
    }

    // 4) Feedback + limpeza
    toast.success("Pedido finalizado com sucesso!", {
      description: `Seu pedido será ${
        deliveryType === "delivery"
          ? `entregue em ${address?.street}, ${address?.number}`
          : "disponível para retirada na loja"
      } em ${format(date, "dd/MM/yyyy")} às ${time}.`,
      duration: 5000,
    })

    clearCart()
    setIsSubmitting(false)

    // 5) Fallback caso o pop-up tenha sido bloqueado
    if (!opened) {
      window.location.href = urls.waMe
    } else {
      setTimeout(() => router.push("/"), 300)
    }
  }

  if (items.length === 0) {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-lg mx-auto pt-6 px-4">
        {/* Cabeçalho */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-rose-800">Finalizar Pedido</h1>
          <p className="text-gray-500">Escolha como deseja receber seu pedido</p>
        </div>

        {/* Retirar na Loja / Endereço de Entrega */}
        <div className="mb-6">
          <h2 className="text-rose-600 font-medium mb-2">
            {deliveryType === "pickup" ? "Retirar na Loja" : "Endereço de Entrega"}
          </h2>
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              {deliveryType === "pickup" ? (
                <>
                  <Store className="text-rose-500 w-5 h-5" />
                  <div>
                    <p className="font-medium">R. Barão de Melgaço, 773 - Universitário, Corumbá - MS</p>
                  </div>
                </>
              ) : address ? (
                <>
                  <MapPin className="text-rose-500 w-5 h-5" />
                  <div>
                    <p className="font-medium">
                      {address.street}, {address.number}
                    </p>
                    <p className="text-sm text-gray-500">
                      {address.complement ? `${address.complement}, ` : ""}
                      {address.neighborhood}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">Nenhum endereço cadastrado</p>
              )}
            </div>
            {deliveryType === "delivery" && (
              <Button
                variant="outline"
                size="sm"
                className="text-rose-600 border-rose-200"
                onClick={() => setIsAddressDialogOpen(true)}
              >
                {address ? "Trocar" : "Adicionar"}
              </Button>
            )}
          </div>
        </div>

        {/* Opções de Entrega */}
        <div className="mb-6">
          <h2 className="text-rose-600 font-medium mb-2">Opções de Entrega</h2>
          <RadioGroup
            value={deliveryType}
            onValueChange={(value) => setDeliveryType(value as "delivery" | "pickup")}
            className="space-y-3"
          >
            <label
              className={cn(
                "flex justify-between items-center p-4 rounded-lg border cursor-pointer",
                deliveryType === "delivery" ? "border-rose-400" : "border-gray-200",
              )}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-rose-600">Entrega</p>
                  {hasFreeDelivery && (
                    <Badge className="bg-rose-500 text-white px-2 py-0.5 text-xs flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>Grátis</span>
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">Entrega no endereço informado</p>
              </div>
              <RadioGroupItem value="delivery" className="text-rose-500" />
            </label>

            <label
              className={cn(
                "flex justify-between items-center p-4 rounded-lg border cursor-pointer",
                deliveryType === "pickup" ? "border-rose-400" : "border-gray-200",
              )}
            >
              <div className="flex-1">
                <p className="font-medium text-rose-600">Retirada na Loja</p>
                <p className="text-sm text-gray-500">Retire seu pedido na loja</p>
              </div>
              <RadioGroupItem value="pickup" className="text-rose-500" />
            </label>
          </RadioGroup>
        </div>

        {/* Data e Hora */}
        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-rose-600 font-medium mb-2">Escolha a data do pedido</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-200 h-12",
                    !date && "text-gray-400",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  fromDate={minDate}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <h2 className="text-rose-600 font-medium mb-2">
              Hora de {deliveryType === "delivery" ? "Entrega" : "Retirada"}
            </h2>
            <Popover open={timeOpen} onOpenChange={setTimeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between border-gray-200 h-12",
                    time ? "text-rose-600 font-medium" : "text-gray-400 font-normal",
                  )}
                >
                  {time || "Selecione um horário"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 max-h-[300px] overflow-auto" align="start">
                <div className="grid grid-cols-2 gap-1 p-1">
                  {availableHours.map((hour) => (
                    <div
                      key={hour}
                      className={cn(
                        "p-3 cursor-pointer hover:bg-gray-50 text-center rounded-md",
                        time === hour && "bg-rose-50 text-rose-600 font-medium",
                      )}
                      onClick={() => {
                        setTime(hour)
                        setTimeOpen(false)
                      }}
                    >
                      {hour}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <p className="text-xs text-gray-500 mt-1">
              {deliveryType === "delivery"
                ? "Horários disponíveis para entrega."
                : "Horários disponíveis para retirada."}
            </p>
          </div>
        </div>

        {/* Resumo dos valores */}
        <div className="mb-6">
          <h2 className="text-rose-600 font-medium mb-2">Resumo dos valores</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de Entrega</span>
              <div className="flex items-center gap-2">
                {hasFreeDelivery && deliveryType === "delivery" && (
                  <Badge className="bg-rose-500 text-white px-2 py-0.5 text-xs">Grátis</Badge>
                )}
                <span className="font-medium">
                  {deliveryFee === 0 ? "Grátis" : `R$ ${deliveryFee.toFixed(2).replace(".", ",")}`}
                </span>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-rose-700">R$ {(totalPrice + deliveryFee).toFixed(2).replace(".", ",")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de total e botão de finalizar pedido */}
      <div className="fixed bottom-0 left-0 right-0 bg-rose-700 text-white p-4 flex justify-between items-center">
        <div>
          <p className="text-sm opacity-90">Total do Pedido</p>
          <p className="font-bold text-xl">R$ {(totalPrice + deliveryFee).toFixed(2).replace(".", ",")}</p>
        </div>
        <Button
          className="bg-white text-rose-700 hover:bg-gray-100 px-6"
          onClick={handleFinishOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Finalizar Pedido"}
        </Button>
      </div>

      {/* Dialog para adicionar/editar endereço */}
      <AddressDialog
        open={isAddressDialogOpen}
        onOpenChange={setIsAddressDialogOpen}
        initialAddress={address || undefined}
        onSave={handleSaveAddress}
      />
    </div>
  )
}
