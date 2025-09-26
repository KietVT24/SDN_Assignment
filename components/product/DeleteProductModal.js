'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toaster'
import { Trash2 } from 'lucide-react'

export default function DeleteProductModal({ product }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { addToast } = useToast()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete product')
      }

      addToast({
        type: 'success',
        title: 'Success',
        description: 'Product deleted successfully!'
      })

      setIsOpen(false)
      router.push('/')
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        className="flex-1"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Product
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalHeader>
          <ModalTitle>Delete Product</ModalTitle>
          <ModalDescription>
            Are you sure you want to delete &quot;{product.name}&quot;? This action cannot be undone.
          </ModalDescription>
        </ModalHeader>
        <ModalContent>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Product:</strong> {product.name}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Price:</strong> ${product.price}
            </p>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Product'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
