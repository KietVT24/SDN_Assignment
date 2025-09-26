'use client'

import { createContext, useContext, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastContext = createContext()

export function ToasterProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, ...toast }
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
    
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-2 p-4 rounded-lg shadow-lg border bg-background text-foreground min-w-[300px]",
              toast.type === 'error' && "border-destructive bg-destructive/10",
              toast.type === 'success' && "border-green-500 bg-green-50 dark:bg-green-950"
            )}
          >
            <div className="flex-1">
              {toast.title && <div className="font-medium">{toast.title}</div>}
              {toast.description && <div className="text-sm text-muted-foreground">{toast.description}</div>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToasterProvider')
  }
  return context
}

export function Toaster() {
  return null // The actual toaster is rendered in ToasterProvider
}
