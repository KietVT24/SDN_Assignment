'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"
import { X } from "lucide-react"

const Modal = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      <div className={cn(
        "relative bg-background rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto",
        className
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        {children}
      </div>
    </div>
  )
}

const ModalHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
)

const ModalTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
)

const ModalDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)

const ModalContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
)

const ModalFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0", className)} {...props} />
)

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter }
