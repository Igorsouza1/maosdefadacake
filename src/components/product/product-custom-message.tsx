import { Textarea } from "@/components/ui/textarea"

interface ProductCustomMessageProps {
  customMessage: string
  setCustomMessage: (message: string) => void
}

export function ProductCustomMessage({ 
  customMessage, 
  setCustomMessage 
}: ProductCustomMessageProps) {
  return (
    <div>
      <div className="bg-rose-400 text-white py-3 px-4">
        <h3 className="font-medium">Observação</h3>
      </div>
      <div className="bg-white py-3 px-4">
        <Textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          className="resize-none border-gray-200 w-full"
        />
      </div>
    </div>
  )
}
