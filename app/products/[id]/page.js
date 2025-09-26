import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { fetchProduct, deleteProduct } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ArrowLeft, Edit, Trash2, DollarSign } from 'lucide-react'
import DeleteProductModal from '@/components/product/DeleteProductModal'

export default async function ProductDetailPage({ params }) {
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
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg border">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-lg">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {product.gender}
              </span>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {product.season}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 text-2xl font-bold text-primary mb-4">
              <DollarSign className="h-6 w-6" />
              {product.price?.toLocaleString('vi-VN')}₫
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gender:</span>
                <span className="font-medium">{product.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Season:</span>
                <span className="font-medium">{product.season}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">{product.price?.toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              {product.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button asChild className="flex-1">
              <Link href={`/products/edit/${product._id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Link>
            </Button>
            <DeleteProductModal product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }) {
  try {
    const product = await fetchProduct(params.id)
    return {
      title: `${product.name} - Clothing Store`,
      description: product.description,
    }
  } catch (error) {
    return {
      title: 'Product Not Found - Clothing Store',
    }
  }
}
