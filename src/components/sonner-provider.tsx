"use client"

import { Toaster } from "sonner"

export function SonnerProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid #f3f4f6",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      }}
    />
  )
}

