import { useState, useMemo } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { mockProducts } from './mock-data'
import type { Product } from './types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import {
  Store,
  Search,
  ShoppingCart,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ShieldCheck,
  Star,
  Tag,
  CheckCircle,
  Sparkles,
} from 'lucide-react'

interface PublicStorefrontProps {
  onNavigateToLogin: () => void
  onNavigateToRegister: () => void
  onNavigateToAdmin?: () => void
}

interface CartItem {
  product: Product
  quantity: number
}

export function PublicStorefront({
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToAdmin,
}: PublicStorefrontProps) {
  const { auth } = useAuthStore()
  const user = auth.user
  const isAdmin = user?.role?.includes('admin') || user?.role?.includes('superadmin')

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
  const [cart, setCart] = useState<CartItem[]>([])
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  // Categories list
  const categories = useMemo<string[]>(() => {
    const cats = ['Semua', ...Array.from(new Set(mockProducts.map((p: Product) => p.category)))]
    return cats
  }, [])

  // Filtered products based on search and category
  const filteredProducts = useMemo<Product[]>(() => {
    return mockProducts.filter((product: Product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === 'Semua' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  // Cart helper functions
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }, [cart])

  const handleCheckout = () => {
    if (cart.length === 0) return
    setCheckoutSuccess(true)
    setCart([])
    setTimeout(() => setCheckoutSuccess(false), 4000)
  }

  const handleLogout = () => {
    auth.reset()
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navbar Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-lg leading-tight block text-slate-900">
                Toko Serba Ada
              </span>
              <span className="text-xs text-slate-500 block">Belanja Online Serba Hemat</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari produk favorit Anda..."
                className="pl-9 bg-slate-100/70 border-slate-200 focus:bg-white transition-all text-sm rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {/* Cart Sheet Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative rounded-lg border-slate-200">
                  <ShoppingCart className="h-5 w-5 text-slate-700" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[11px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-sm">
                      {totalCartCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-blue-600" /> Keranjang Belanja
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {checkoutSuccess ? (
                    <div className="p-6 text-center bg-emerald-50 rounded-xl border border-emerald-200">
                      <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                      <h4 className="font-bold text-emerald-800 text-lg">Pesanan Berhasil!</h4>
                      <p className="text-emerald-600 text-sm mt-1">
                        Terima kasih telah berbelanja di Toko Serba Ada. Pesanan Anda sedang diproses.
                      </p>
                    </div>
                  ) : cart.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-40" />
                      <p className="text-sm font-medium">Keranjang belanja Anda masih kosong</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-800 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-blue-600 font-bold mt-0.5">
                            Rp {item.product.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="h-6 w-6 rounded bg-slate-200 hover:bg-slate-300 font-bold text-xs flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="h-6 w-6 rounded bg-slate-200 hover:bg-slate-300 font-bold text-xs flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-xs text-red-500 hover:underline ml-1"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {cart.length > 0 && (
                  <SheetFooter className="border-t pt-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center w-full text-base font-bold">
                      <span>Total Pembayaran:</span>
                      <span className="text-blue-600">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <Button onClick={handleCheckout} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5">
                      Proses Checkout
                    </Button>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>

            {/* Auth Dropdown or Login Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2.5">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                      {user.email ? user.email[0].toUpperCase() : 'U'}
                    </div>
                    <div className="text-left hidden md:block">
                      <p className="text-xs font-semibold truncate max-w-[120px]">{user.email}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{user.role?.[0] || 'User'}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && onNavigateToAdmin && (
                    <DropdownMenuItem
                      onClick={onNavigateToAdmin}
                      className="cursor-pointer font-medium text-blue-600"
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" /> Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" /> Profil Pelanggan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" /> Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNavigateToLogin}
                  className="text-slate-700 hover:bg-slate-100 text-sm font-medium"
                >
                  <LogIn className="h-4 w-4 mr-1.5" /> Masuk
                </Button>
                <Button
                  size="sm"
                  onClick={onNavigateToRegister}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
                >
                  <UserPlus className="h-4 w-4 mr-1.5" /> Daftar
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4 text-center md:text-left">
            <Badge className="bg-white/20 text-white hover:bg-white/30 border-none px-3 py-1 text-xs font-semibold tracking-wide uppercase inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Promo Spesial Minggu Ini
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Belanja Kebutuhan Anda Lebih Praktis & Terpercaya
            </h1>
            <p className="text-blue-100 text-sm sm:text-base">
              Temukan ribuan produk berkualitas dari elektronik, fashion, hingga bahan pokok dengan diskon spesial hingga 50%!
            </p>
            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <Button
                onClick={() => setSelectedCategory('Semua')}
                className="bg-white text-blue-700 hover:bg-slate-100 font-bold px-5 shadow"
              >
                Mulai Belanja Now
              </Button>
              {!user && (
                <Button
                  onClick={onNavigateToRegister}
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 font-medium"
                >
                  Dapatkan Kupon Diskon
                </Button>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl max-w-xs">
            <div className="text-center space-y-3">
              <Tag className="h-12 w-12 text-amber-300 mx-auto animate-bounce" />
              <h3 className="font-bold text-lg">Voucher Pengguna Baru</h3>
              <p className="text-xs text-blue-100">Gunakan kode PROMO100 untuk diskon Rp 50.000 pertama!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Category filter & Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((category) => {
            const isActive = selectedCategory === category
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>

        {/* Product Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Katalog Produk {selectedCategory !== 'Semua' && `- ${selectedCategory}`}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Menampilkan {filteredProducts.length} produk
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-base font-semibold text-slate-600">Produk tidak ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian lain atau pilih kategori berbeda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-white border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                >
                  <CardHeader className="p-0 relative">
                    <div className="h-44 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <Store className="h-12 w-12 text-slate-300" />
                      )}
                      <Badge className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] backdrop-blur">
                        {product.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 flex-1 space-y-2">
                    <CardTitle className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
                      {product.name}
                    </CardTitle>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {product.description || 'Produk kualitas terjamin dengan garansi resmi toko.'}
                    </p>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold pt-1">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>4.8</span>
                      <span className="text-slate-400 font-normal ml-1">(120 ulasan)</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t border-slate-100 mt-auto flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Harga</p>
                      <p className="text-base font-extrabold text-blue-600">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm"
                    >
                      + Keranjang
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-blue-400" />
            <span className="font-semibold text-slate-200">Toko Serba Ada E-Commerce</span>
          </div>
          <p>© 2026 Toko Serba Ada. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
