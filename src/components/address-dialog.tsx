"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
}

interface AddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialAddress?: Address
  onSave: (address: Address) => void
}

export function AddressDialog({ open, onOpenChange, initialAddress, onSave }: AddressDialogProps) {
  const [address, setAddress] = useState<Address>(
    initialAddress || {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
    },
  )

  // Atualizar o estado quando o endereço inicial mudar
  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress)
    }
  }, [initialAddress])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!address.street || !address.number || !address.neighborhood) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    onSave(address)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Endereço de Entrega</DialogTitle>
          <DialogDescription>Informe o endereço onde deseja receber seu pedido</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label htmlFor="street" className="text-sm font-medium">
                Rua <span className="text-rose-500">*</span>
              </label>
              <Input
                id="street"
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="Nome da rua"
                required
              />
            </div>
            <div>
              <label htmlFor="number" className="text-sm font-medium">
                Número <span className="text-rose-500">*</span>
              </label>
              <Input
                id="number"
                name="number"
                value={address.number}
                onChange={handleChange}
                placeholder="Nº"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="complement" className="text-sm font-medium">
              Complemento
            </label>
            <Input
              id="complement"
              name="complement"
              value={address.complement}
              onChange={handleChange}
              placeholder="Apto, bloco, referência..."
            />
          </div>

          <div>
            <label htmlFor="neighborhood" className="text-sm font-medium">
              Bairro <span className="text-rose-500">*</span>
            </label>
            <Input
              id="neighborhood"
              name="neighborhood"
              value={address.neighborhood}
              onChange={handleChange}
              placeholder="Bairro"
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-rose-500 hover:bg-rose-600">
              Salvar Endereço
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

