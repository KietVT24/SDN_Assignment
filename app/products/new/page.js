import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ProductForm from '@/components/product/ProductForm'

export const metadata = {
  title: 'Add New Product - Clothing Store',
  description: 'Add a new product to the clothing store',
}

export default function NewProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      {/* <Button asChild variant="ghost" className="mb-6">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </Button> */}
<Button
  asChild
  variant="outline"
  className="group mb-6 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
>
  <Link href="/" className="flex items-center">
    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
    Back to Home
  </Link>
</Button>

      <ProductForm />
    </div>
  )
}
