'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toaster'
import { Upload, X } from 'lucide-react'

export default function ProductForm({ 
  initial = null, 
  onSaved, 
  method = 'POST', 
  action = '/api/products' 
}) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price?.toString() || '',
    imageUrl: initial?.image || '',
    category: initial?.category || '',
    gender: initial?.gender || '',
    season: initial?.season || '',
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const isValidUrl = (value) => {
    if (!value) return true
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (form.imageUrl && !isValidUrl(form.imageUrl)) {
        throw new Error('Image URL must be a valid http/https link')
      }
      let res
      if (file) {
        const fd = new FormData()
        fd.append('name', form.name)
        fd.append('description', form.description)
        fd.append('price', String(Number(form.price)))
        fd.append('category', form.category)
        fd.append('gender', form.gender)
        fd.append('season', form.season)
        fd.append('image', file)
        if (form.imageUrl) {
          fd.append('imageUrl', form.imageUrl)
        }
        res = await fetch(action, { method, body: fd })
      } else {
        res = await fetch(action, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: form.name, 
            description: form.description, 
            price: Number(form.price), 
            category: form.category,
            gender: form.gender,
            season: form.season,
            image: form.imageUrl 
          }),
        })
      }
      
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'Failed to save product')
      
      addToast({
        type: 'success',
        title: 'Success',
        description: 'Product saved successfully!'
      })
      
      if (onSaved) onSaved(json.data)
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Error',
        description: err.message
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setForm(prev => ({ ...prev, imageUrl: '' })) // Clear URL when file is selected
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initial ? 'Edit Product' : 'Add New Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="Enter product name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (VND)</Label>
            <Input
              id="price"
              type="number"
              step="1000"
              min="0"
              placeholder="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="">Select category</option>
              <option value="T-Shirt">T-Shirt</option>
              <option value="Hoodie">Hoodie</option>
              <option value="Jacket">Jacket</option>
              <option value="Jeans">Jeans</option>
              <option value="Dress">Dress</option>
              <option value="Skirt">Skirt</option>
              <option value="Shoes">Shoes</option>
              <option value="Accessory">Accessory</option>
            </Select>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              id="gender"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              required
            >
              <option value="">Select gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </Select>
          </div>

          {/* Season */}
          <div className="space-y-2">
            <Label htmlFor="season">Season</Label>
            <Select
              id="season"
              value={form.season}
              onChange={(e) => setForm({ ...form, season: e.target.value })}
              required
            >
              <option value="">Select season</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Autumn">Autumn</option>
              <option value="Winter">Winter</option>
            </Select>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <Label>Product Image</Label>
            
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="image-file" className="cursor-pointer">
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </Label>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {file && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="text-sm flex-1">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                disabled={!!file}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : (initial ? 'Update Product' : 'Create Product')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
