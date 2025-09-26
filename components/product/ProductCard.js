import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Eye, Edit, Trash2 } from 'lucide-react'

export default function ProductCard({ product, showActions = false, onEdit, onDelete }) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 shadow-md">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <span className="text-muted-foreground text-lg">📷</span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-medium bg-white/90 backdrop-blur-sm text-primary px-2 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            {product.gender}
          </span>
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
            {product.season}
          </span>
        </div>
        
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {product.price?.toLocaleString('vi-VN')}₫
          </span>
          <div className="text-xs text-muted-foreground">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            Còn hàng
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <div className="flex w-full gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors">
            <Link href={`/products/${product._id}`}>
              {/* <Eye className="h-4 w-4 mr-2" /> */}
              Xem chi tiết
            </Link>
          </Button>
          
          {showActions && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(product)}
                className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Sửa
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete?.(product)}
                className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
