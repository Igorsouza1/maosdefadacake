// src/app/api/submit-order/route.ts

import { google } from "googleapis"
import { NextResponse } from "next/server"

// Tipagem para os dados do pedido que esperamos receber do frontend
interface OrderItem {
  product: { name: string }
  quantity: number
  totalPrice: number
  customizations?: { label: string; value: string }[]
  customMessage?: string
}

interface Address {
  street: string
  number: string
  neighborhood: string
  complement?: string
}

interface OrderData {
  deliveryType: "delivery" | "pickup"
  date: string // Esperamos a data já formatada como string
  time: string
  address: Address | null
  items: OrderItem[]
  totalPrice: number
  deliveryFee: number
}

export async function POST(request: Request) {
  try {
    const orderData: OrderData = await request.json()

    // 1. Autenticação com o Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })

    // 2. Gerar um ID único para o pedido e a data atual
    const orderId = `PEDIDO-${Date.now()}`
    const orderTimestamp = new Date().toISOString()
    const orderStatus = "Novo"

    // 3. Formatar os dados para as linhas da planilha
    // Cada item do carrinho se tornará uma linha na planilha, agrupado pelo ID do Pedido
    const rows = orderData.items.map((item) => {
      // Formata as customizações em uma única string
      const customizationsText =
        item.customizations
          ?.map((cust) => `${cust.label}: ${cust.value}`)
          .join(" | ") || ""

      return [
        orderId,
        orderTimestamp,
        orderStatus,
        orderData.deliveryType === "delivery" ? "Entrega" : "Retirada",
        orderData.date,
        orderData.time,
        item.product.name,
        item.quantity,
        customizationsText,
        item.customMessage || "",
        (item.totalPrice / item.quantity).toFixed(2), // Valor unitário
        item.totalPrice.toFixed(2),
        orderData.address?.street || "",
        orderData.address?.number || "",
        orderData.address?.neighborhood || "",
        orderData.address?.complement || "",
        (orderData.totalPrice + orderData.deliveryFee).toFixed(2), // Total do Pedido
      ]
    })

    // 4. Enviar os dados para a planilha
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
      range: "A1", // A API vai encontrar a próxima linha vazia automaticamente
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: rows,
      },
    })

    return NextResponse.json({ success: true, message: "Pedido enviado para a planilha." })
  } catch (error) {
    console.error("Erro ao enviar para o Google Sheets:", error)
    // Em caso de erro, retorne uma resposta com status 500
    return new NextResponse(
      JSON.stringify({ success: false, message: "Erro interno do servidor." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}