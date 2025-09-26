import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { fetchProduct } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import ProductForm from '@/components/product/ProductForm'

export default async function EditProductPage({ params }) {
  let product
  try {
    product = await fetchProduct(params.id)
  } catch (error) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-6">
        <Link href={`/products/${product._id}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Product
        </Link>
      </Button>

      <ProductForm 
        initial={product} 
        method="PUT" 
        action={`/api/products/${product._id}`}
      />
    </div>
  )
}

export async function generateMetadata({ params }) {
  try {
    const product = await fetchProduct(params.id)
    return {
      title: `Edit ${product.name} - Clothing Store`,
      description: `Edit product: ${product.name}`,
    }
  } catch (error) {
    return {
      title: 'Product Not Found - Clothing Store',
    }
  }
}
