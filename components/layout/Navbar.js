// components/layout/Navbar.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, ShoppingCart, Menu, X, Package, LogOut, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch cart count
  useEffect(() => {
    if (session) {
      fetchCartCount();
    } else {
      setCartItemCount(0);
    }
  }, [session, pathname]);

  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.success && data.data) {
        setCartItemCount(data.data.items.length);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ModernStore
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/products">
              <Button variant="ghost">Products</Button>
            </Link>

            {status === 'authenticated' ? (
              <>
                <Link href="/products/new">
                  <Button variant="ghost">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </Link>

                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount > 9 ? '9+' : cartItemCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <Link href="/orders">
                  <Button variant="ghost" size="icon">
                    <Package className="h-5 w-5" />
                  </Button>
                </Link>

                <div className="relative group">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{session.user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/orders">
                        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
                          <Package className="h-4 w-4 mr-2" />
                          My Orders
                        </button>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                  Products
                </button>
              </Link>

              {status === 'authenticated' ? (
                <>
                  <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-between">
                      <span className="flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Cart
                      </span>
                      {cartItemCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </button>
                  </Link>

                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      My Orders
                    </button>
                  </Link>

                  <Link href="/products/new" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Add Product
                    </button>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full text-left px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { ShoppingBag, Search } from "lucide-react";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { useState } from "react";
// import { signOut, useSession } from "next-auth/react";

// export default function Navbar() {
//   const pathname = usePathname() || "/";
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState("");
//   const { data: session } = useSession();

//   // Nếu đang ở /products thì redirect kết quả tìm kiếm về /products?q=...
//   // Ngược lại sử dụng home search /?q=... (giữ tính năng của cả hai file)
//   function handleSearchSubmit(e) {
//     e?.preventDefault();
//     const q = searchQuery.trim();
//     if (!q) {
//       // nếu rỗng, giữ hành vi giống phiên bản cũ: về homepage
//       router.push("/");
//       return;
//     }

//     if (pathname.startsWith("/products")) {
//       router.push(`/products?q=${encodeURIComponent(q)}`);
//     } else {
//       router.push(`/?q=${encodeURIComponent(q)}`);
//     }
//   }

//   const displayName = session?.user?.name
//     ? session.user.name
//     : session?.user?.email
//     ? session.user.email.split("@")[0]
//     : null;

//   const navItems = [
//     { href: "/", label: "Home" },
//     { href: "/products", label: "Products" },
//   ];

//   return (
//     <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           {/* Left: Logo */}
//           <Link href="/" className="flex items-center space-x-2">
//             <ShoppingBag className="h-6 w-6 text-primary" />
//             <span className="text-xl font-bold">Clothing Store</span>
//           </Link>

//           {/* Center: Nav links + desktop search */}
//           <div className="hidden md:flex items-center space-x-6">
//             <nav className="flex items-center space-x-6">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className={`text-sm font-medium transition-colors hover:text-primary ${
//                     pathname === item.href ? "text-primary" : "text-muted-foreground"
//                   }`}
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//             </nav>

//             {/* Desktop search (center area) */}
//             <form onSubmit={handleSearchSubmit} className="flex items-center">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <Input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 w-[380px] max-w-[40vw]"
//                   aria-label="Search products"
//                 />
//               </div>
//             </form>
//           </div>

//           {/* Right: Auth area + actions */}
//           <div className="flex items-center space-x-4">
//             {/* Cart icon */}
//             <Link href="/cart" aria-label="Cart" className="p-2 rounded-md hover:bg-muted/10 transition">
//               <ShoppingBag className="h-5 w-5" />
//             </Link>

//             {/* Auth links (desktop) */}
//             {!session && (
//               <div className="hidden sm:flex items-center space-x-3">
//                 <Link
//                   href="/auth/login"
//                   className={`text-sm font-medium transition-colors hover:text-primary ${
//                     pathname === "/auth/login" ? "text-primary" : "text-muted-foreground"
//                   }`}
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   href="/auth/register"
//                   className={`text-sm font-medium transition-colors hover:text-primary ${
//                     pathname === "/auth/register" ? "text-primary" : "text-muted-foreground"
//                   }`}
//                 >
//                   Register
//                 </Link>
//               </div>
//             )}

//             {/* Logged-in user display */}
//             {session && (
//               <div className="hidden sm:flex items-center space-x-3">
//                 <span className="text-sm text-muted-foreground">
//                   Xin chào,{" "}
//                   <span className="font-medium text-sm text-primary">
//                     {displayName}
//                   </span>
//                 </span>
//                 <button
//                   onClick={() => signOut({ callbackUrl: "/" })}
//                   className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}

//             {/* Mobile search icon */}
//             <div className="sm:hidden">
//               <button
//                 onClick={() => {
//                   const el = document.getElementById("mobile-search-input");
//                   if (el) el.focus();
//                 }}
//                 className="p-2 rounded-md hover:bg-muted/10 transition"
//                 aria-label="Open search"
//               >
//                 <Search className="h-5 w-5 text-muted-foreground" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile search + compact auth area */}
//         <div className="sm:hidden pb-4">
//           <form onSubmit={handleSearchSubmit}>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 id="mobile-search-input"
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//                 aria-label="Mobile search"
//               />
//             </div>
//           </form>

//           <div className="flex items-center justify-center gap-4 mt-3">
//             {!session ? (
//               <>
//                 <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary">
//                   Login
//                 </Link>
//                 <Link href="/auth/register" className="text-sm text-muted-foreground hover:text-primary">
//                   Register
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <span className="text-sm text-muted-foreground">
//                   Xin chào, <span className="font-medium text-primary">{displayName}</span>
//                 </span>
//                 <button
//                   onClick={() => signOut({ callbackUrl: "/" })}
//                   className="text-sm text-muted-foreground hover:text-primary"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }















