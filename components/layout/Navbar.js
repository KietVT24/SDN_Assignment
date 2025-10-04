// components/layout/Navbar.js
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingBag, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { data: session } = useSession()

  const handleSearch = (e) => {
    e?.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      router.push(`/?q=${encodeURIComponent(q)}`)
    } else {
      router.push('/')
    }
  }

  const displayName = session?.user?.name
    ? session.user.name
    : session?.user?.email
    ? session.user.email.split('@')[0]
    : null

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Clothing Store</span>
          </Link>

          {/* Center: Nav links + (desktop) search */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop search (center area) */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[380px] max-w-[40vw]"
                  aria-label="Search products"
                />
              </div>
            </form>
          </div>

          {/* Right: Auth area + actions */}
          <div className="flex items-center space-x-4">

            {/* Auth links (desktop) */}
            {!session && (
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === '/auth/login' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === '/auth/register' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Logged-in user display */}
            {session && (
              <div className="hidden sm:flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  Xin chào, <span className="font-medium text-sm text-primary">{displayName}</span>
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile search icon */}
            <div className="sm:hidden">
              <button
                onClick={() => {
                  const el = document.getElementById('mobile-search-input')
                  if (el) el.focus()
                }}
                className="p-2 rounded-md hover:bg-muted/10 transition"
                aria-label="Open search"
              >
                <Search className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search + compact auth area */}
        <div className="sm:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="mobile-search-input"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Mobile search"
              />
            </div>
          </form>

          <div className="flex items-center justify-center gap-4 mt-3">
            {!session ? (
              <>
                <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
                  Login
                </Link>
                <Link href="/auth/register" className="text-sm text-muted-foreground hover:text-primary">
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-muted-foreground">
                  Xin chào, <span className="font-medium text-primary">{displayName}</span>
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// 'use client'

// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import { ShoppingBag, Search, Plus } from 'lucide-react'
// import { Button } from '@/components/ui/Button'
// import { Input } from '@/components/ui/Input'
// import { useState } from 'react'
// import { signOut, useSession } from 'next-auth/react'

// export default function Navbar() {
//   const pathname = usePathname()
//   const router = useRouter()
//   const [searchQuery, setSearchQuery] = useState('')
//   const { data: session } = useSession()

//   // ✅ Xử lý tìm kiếm sản phẩm
//   const handleSearch = (e) => {
//     e.preventDefault()
//     if (searchQuery.trim()) {
//       router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`)
//     } else {
//       router.push('/')
//     }
//   }

//   // ✅ Danh sách menu
//   const navItems = [
//     { href: '/', label: 'Home' },
//     { href: '/products', label: 'Products' },
//   ]

//   return (
//     <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           {/* 🔷 Logo */}
//           <Link href="/" className="flex items-center space-x-2">
//             <ShoppingBag className="h-6 w-6 text-primary" />
//             <span className="text-xl font-bold">Clothing Store</span>
//           </Link>

//           {/* 🔷 Navigation menu */}
//           <nav className="hidden md:flex items-center space-x-6">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`text-sm font-medium transition-colors hover:text-primary ${
//                   pathname === item.href
//                     ? 'text-primary'
//                     : 'text-muted-foreground'
//                 }`}
//               >
//                 {item.label}
//               </Link>
//             ))}

//             {/* 🔐 Auth links */}
//             {!session && (
//               <>
//                 <Link
//                   href="/auth/login"
//                   className={`text-sm font-medium transition-colors hover:text-primary ${
//                     pathname === '/auth/login'
//                       ? 'text-primary'
//                       : 'text-muted-foreground'
//                   }`}
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   href="/auth/register"
//                   className={`text-sm font-medium transition-colors hover:text-primary ${
//                     pathname === '/auth/register'
//                       ? 'text-primary'
//                       : 'text-muted-foreground'
//                   }`}
//                 >
//                   Register
//                 </Link>
//               </>
//             )}

//             {/* 👤 Khi đã đăng nhập */}
//             {session && (
//               <>
//                 <span className="text-sm text-muted-foreground">
//                   Xin chào, <span className="font-medium">{session.user?.email}</span>
//                 </span>
//                 <button
//                   onClick={() => signOut({ callbackUrl: '/' })}
//                   className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}
//           </nav>

//           {/* 🔎 Search & Actions */}
//           <div className="flex items-center space-x-4">
//             {/* Search */}
//             <form onSubmit={handleSearch} className="hidden sm:flex items-center">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <Input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 w-64"
//                 />
//               </div>
//             </form>

//             {/* Thêm sản phẩm (chỉ cho user đã đăng nhập) */}
//             {session && (
//               <Button asChild>
//                 <Link href="/products/new">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Product
//                 </Link>
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* 🔍 Search (mobile) */}
//         <div className="sm:hidden pb-4">
//           <form onSubmit={handleSearch}>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </form>
//         </div>
//       </div>
//     </header>
//   )
// }













