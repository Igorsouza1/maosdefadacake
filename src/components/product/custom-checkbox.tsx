interface CustomCheckboxProps {
    id: string
    checked: boolean
    disabled?: boolean
    onCheckedChange: (checked: boolean) => boolean | void
  }
  
  export function CustomCheckbox({
    id,
    checked,
    disabled = false,
    onCheckedChange,
  }: CustomCheckboxProps) {
    return (
      <div
        className={`h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center ${
          checked ? "bg-rose-500 border-rose-500" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={(e) => {
          e.stopPropagation() // Impedir propagação do evento
          if (!disabled || checked) {
            onCheckedChange(!checked)
          }
        }}
      >
        {checked && <div className="h-2.5 w-2.5 rounded-full bg-white"></div>}
        <input
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          onChange={(e) => {
            e.stopPropagation() // Impedir propagação do evento
            if (!disabled || checked) {
              onCheckedChange(e.target.checked)
            }
          }}
          className="sr-only"
        />
      </div>
    )
  }
  