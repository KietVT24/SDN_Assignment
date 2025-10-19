"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toaster";
import { Trash2 } from "lucide-react";

/**
 * DeleteProductModal
 *
 * Props:
 * - product: product object (should contain ._id (or .id), .name, .price, ...)
 * - open: optional boolean (controlled mode)
 * - onClose: optional callback (controlled mode)
 * - onConfirm: optional callback to perform deletion externally (if provided, component will call it instead of fetching)
 * - productName: optional string to display (fallbacks to product.name)
 * - redirectTo: after successful delete, where to navigate (default '/')
 * - showTrigger: whether to render the "Delete" Button trigger (default true). If using controlled mode + parent trigger, set false.
 * - triggerLabel: label for trigger button (default 'Delete Product')
 * - triggerProps: extra props to pass to the trigger Button
 */
export default function DeleteProductModal({
  product,
  open: controlledOpen,
  onClose: controlledOnClose,
  onConfirm: controlledOnConfirm,
  productName: controlledName,
  redirectTo = "/",
  showTrigger = true,
  triggerLabel = "Delete Product",
  triggerProps = {},
}) {
  const isControlled = controlledOpen !== undefined;
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toastApi = useToast();

  // unify open state
  const visible = isControlled ? controlledOpen : isOpen;
  const close = () => {
    if (isControlled) {
      if (typeof controlledOnClose === "function") controlledOnClose();
    } else {
      setIsOpen(false);
    }
  };

  const showToast = (opts) => {
    // support multiple toast API shapes
    if (!toastApi) {
      // fallback console
      console[opts.type === "error" ? "error" : "log"](opts.title, opts.description);
      return;
    }
    if (typeof toastApi.addToast === "function") {
      toastApi.addToast(opts);
    } else if (typeof toastApi.toast === "function") {
      toastApi.toast(opts);
    } else if (typeof toastApi.push === "function") {
      toastApi.push(opts);
    } else {
      // last fallback
      console[opts.type === "error" ? "error" : "log"](opts.title, opts.description);
    }
  };

  const id = product?._id || product?.id;
  const displayName = controlledName || product?.name || "this product";
  const displayPrice = product?.price != null ? Number(product.price).toFixed(2) : null;

  async function handleDelete() {
    // If parent gave an onConfirm, call it and let parent handle everything.
    if (typeof controlledOnConfirm === "function") {
      try {
        setLoading(true);
        await controlledOnConfirm(product);
        showToast({ type: "success", title: "Deleted", description: `${displayName} deleted.` });
        close();
      } catch (err) {
        showToast({ type: "error", title: "Error", description: err?.message || "Failed to delete" });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Otherwise, perform API delete here
    if (!id) {
      showToast({ type: "error", title: "Error", description: "Product id missing" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({ success: res.ok }));
      if (!res.ok || json.success === false) {
        throw new Error(json.error || `Delete failed (${res.status})`);
      }

      showToast({ type: "success", title: "Deleted", description: `${displayName} deleted successfully.` });
      close();
      // redirect after short delay to allow toast show (optional)
      try {
        router.push(redirectTo);
      } catch (e) {
        // ignore router errors
      }
    } catch (err) {
      showToast({ type: "error", title: "Error", description: err?.message || "Failed to delete product" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* optional trigger button (self-contained usage) */}
      {showTrigger && (
        <Button
          variant="destructive"
          className="flex-1"
          onClick={() => {
            if (!isControlled) setIsOpen(true);
            else if (typeof controlledOnClose === "function" && controlledOpen === false) {
              // if parent passed open=false and onClose, we can't open; assume parent controls opening.
            } else if (isControlled && typeof controlledOnClose !== "function") {
              // controlled without onClose: nothing to do
            }
          }}
          {...triggerProps}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {triggerLabel}
        </Button>
      )}

      {/* Render modal only when visible */}
      {visible && (
        <Modal isOpen={true} onClose={close}>
          <ModalHeader>
            <ModalTitle>Xóa sản phẩm</ModalTitle>
            <ModalDescription>
              Bạn có chắc muốn xóa <strong>{displayName}</strong>? Hành động này không thể hoàn tác.
            </ModalDescription>
          </ModalHeader>

          <ModalContent>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Product:</strong> {displayName}
              </p>
              {displayPrice !== null && (
                <p className="text-sm text-muted-foreground">
                  <strong>Price:</strong> ${displayPrice}
                </p>
              )}
            </div>
          </ModalContent>

          <ModalFooter>
            <Button variant="outline" onClick={close} disabled={loading}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Xóa"}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </>
  );
}



// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from '@/components/ui/Modal'
// import { Button } from '@/components/ui/Button'
// import { useToast } from '@/components/ui/Toaster'
// import { Trash2 } from 'lucide-react'

// export default function DeleteProductModal({ product }) {
//   const [isOpen, setIsOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()
//   const { addToast } = useToast()

//   const handleDelete = async () => {
//     setLoading(true)
//     try {
//       const response = await fetch(`/api/products/${product._id}`, {
//         method: 'DELETE',
//       })

//       const data = await response.json()
      
//       if (!data.success) {
//         throw new Error(data.error || 'Failed to delete product')
//       }

//       addToast({
//         type: 'success',
//         title: 'Success',
//         description: 'Product deleted successfully!'
//       })

//       setIsOpen(false)
//       router.push('/')
//     } catch (error) {
//       addToast({
//         type: 'error',
//         title: 'Error',
//         description: error.message
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       <Button
//         variant="destructive"
//         className="flex-1"
//         onClick={() => setIsOpen(true)}
//       >
//         <Trash2 className="h-4 w-4 mr-2" />
//         Delete Product
//       </Button>

//       <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
//         <ModalHeader>
//           <ModalTitle>Delete Product</ModalTitle>
//           <ModalDescription>
//             Are you sure you want to delete &quot;{product.name}&quot;? This action cannot be undone.
//           </ModalDescription>
//         </ModalHeader>
//         <ModalContent>
//           <div className="bg-muted p-4 rounded-lg">
//             <p className="text-sm text-muted-foreground">
//               <strong>Product:</strong> {product.name}
//             </p>
//             <p className="text-sm text-muted-foreground">
//               <strong>Price:</strong> ${product.price}
//             </p>
//           </div>
//         </ModalContent>
//         <ModalFooter>
//           <Button
//             variant="outline"
//             onClick={() => setIsOpen(false)}
//             disabled={loading}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="destructive"
//             onClick={handleDelete}
//             disabled={loading}
//           >
//             {loading ? 'Deleting...' : 'Delete Product'}
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </>
//   )
// }
