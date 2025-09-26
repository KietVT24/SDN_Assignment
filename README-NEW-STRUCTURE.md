# Modern Clothing Store - Next.js App Router

A modern, scalable e-commerce platform built with Next.js 14 App Router, Tailwind CSS, and shadcn/ui components.

## 🎨 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **App Router**: Next.js 14 App Router for better performance
- **Component Library**: Reusable UI components with shadcn/ui
- **Search & Pagination**: Server-side search and pagination
- **Image Upload**: Support for file uploads and Cloudinary integration
- **Toast Notifications**: Global success/error notifications
- **Delete Confirmation**: Modal-based delete confirmation
- **Responsive Design**: Mobile-first responsive layout

## 📁 Project Structure

```
clothing-store/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.js                # Root layout with Navbar/Footer
│   ├── page.js                  # Home page with hero + products
│   └── products/
│       ├── page.js              # Products listing page
│       ├── new/page.js          # Add new product
│       ├── [id]/page.js         # Product detail page
│       └── edit/[id]/page.js    # Edit product page
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Input.js
│   │   ├── Textarea.js
│   │   ├── Label.js
│   │   ├── Modal.js
│   │   └── Toaster.js
│   ├── layout/                  # Layout components
│   │   ├── Navbar.js
│   │   └── Footer.js
│   └── product/                 # Product-specific components
│       ├── ProductCard.js
│       ├── ProductForm.js
│       └── DeleteProductModal.js
├── lib/
│   ├── utils.js                 # Utility functions
│   └── api.js                   # API client functions
├── pages/                       # Legacy pages (can be removed)
├── models/                      # Database models
├── scripts/                     # Database seeding
└── styles.css                   # Legacy styles (can be removed)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB or PostgreSQL
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Seed the database** (optional):
   ```bash
   npm run seed
   ```

## 🎯 Key Components

### UI Components (`components/ui/`)

- **Button**: Variant-based button component
- **Card**: Flexible card container
- **Input/Textarea**: Form input components
- **Modal**: Reusable modal component
- **Toaster**: Global notification system

### Layout Components (`components/layout/`)

- **Navbar**: Responsive navigation with search
- **Footer**: Site footer with links

### Product Components (`components/product/`)

- **ProductCard**: Product display card
- **ProductForm**: Create/edit product form
- **DeleteProductModal**: Confirmation modal

## 🔧 API Integration

The app uses a centralized API client (`lib/api.js`) with functions:

- `fetchProducts({ page, limit, q })` - Get paginated products
- `fetchProduct(id)` - Get single product
- `createProduct(data)` - Create new product
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product

## 🎨 Styling

### Tailwind CSS Configuration

- **Colors**: Custom color palette with CSS variables
- **Components**: Pre-built component styles
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Ready for dark mode implementation

### Design System

- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale
- **Shadows**: Subtle elevation system
- **Animations**: Smooth transitions and hover effects

## 📱 Pages

### Home Page (`app/page.js`)
- Hero section with call-to-action
- Featured products grid
- Search functionality
- Pagination

### Products Page (`app/products/page.js`)
- All products listing
- Search and filter
- Pagination
- Add product button

### Product Detail (`app/products/[id]/page.js`)
- Product information
- Image display
- Edit/Delete actions
- Metadata generation

### Add/Edit Product (`app/products/new/page.js`, `app/products/edit/[id]/page.js`)
- Form validation
- Image upload
- Success/error handling

## 🔄 Migration from Pages Router

The new structure uses Next.js App Router. Key differences:

1. **File-based routing**: `app/` directory instead of `pages/`
2. **Server Components**: Default server-side rendering
3. **Client Components**: Explicit `'use client'` directive
4. **Layouts**: Nested layout system
5. **Loading/Error**: Built-in loading and error states

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Other Platforms

1. Build the app: `npm run build`
2. Start production: `npm start`
3. Set environment variables
4. Configure reverse proxy if needed

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier
- `npm run seed` - Seed database

### Code Style

- **ESLint**: Next.js recommended rules
- **Prettier**: Code formatting
- **Tailwind**: Utility-first CSS
- **Components**: Reusable and composable

## 🔮 Future Enhancements

- [ ] Dark mode toggle
- [ ] Advanced filtering (category, price range)
- [ ] Shopping cart functionality
- [ ] User authentication
- [ ] Order management
- [ ] Product reviews
- [ ] Image optimization
- [ ] SEO improvements
- [ ] Performance monitoring
- [ ] Analytics integration

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Note**: This is a modernized version of the original clothing store. The old `pages/` directory structure is preserved for reference but the new `app/` structure is the primary implementation.
