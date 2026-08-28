import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Search, MoreHorizontal, Edit, Trash2, PackagePlus, Filter, Loader2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api-client'
import type { Product } from '../types'

export function EcommerceProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Pakaian & Fashion',
    price: '',
    stock: '',
    description: '',
    image: '',
  })

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await apiFetch<Product[]>('/api/products')
      setProducts(data)
    } catch (err: any) {
      toast.error('Gagal mengambil data produk: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const handleOpenAddDialog = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      sku: '',
      category: 'Pakaian & Fashion',
      price: '',
      stock: '',
      description: '',
      image: '',
    })
    setIsAddDialogOpen(true)
  }

  const handleOpenEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category || 'General',
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      image: product.image || '',
    })
    setIsAddDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const bodyData = new FormData()
    bodyData.append('file', file)

    try {
      setUploadingImage(true)
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: bodyData,
      })

      if (!response.ok) {
        const errText = await response.text()
        throw new Error(errText || 'Gagal mengunggah gambar.')
      }

      const data = await response.json()
      setFormData((prev) => ({ ...prev, image: data.url }))
      toast.success('Gambar berhasil diunggah!')
    } catch (err: any) {
      toast.error('Gagal mengunggah gambar: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price) return

    const priceNum = parseFloat(formData.price) || 0
    const stockNum = parseInt(formData.stock) || 0

    try {
      if (editingProduct) {
        // Update product API
        const updated = await apiFetch<Product>(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: formData.name,
            sku: formData.sku,
            category: formData.category,
            price: priceNum,
            stock: stockNum,
            description: formData.description,
            image: formData.image,
          }),
        })
        toast.success('Produk berhasil diperbarui!')
        setProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...updated } : p)))
      } else {
        // Create product API
        const created = await apiFetch<Product>('/api/products', {
          method: 'POST',
          body: JSON.stringify({
            name: formData.name,
            sku: formData.sku,
            category: formData.category,
            price: priceNum,
            stock: stockNum,
            description: formData.description,
            image: formData.image,
          }),
        })
        toast.success('Produk baru berhasil ditambahkan!')
        setProducts([created, ...products])
      }
      setIsAddDialogOpen(false)
    } catch (err: any) {
      toast.error('Gagal menyimpan produk: ' + err.message)
    }
  }

  const handleDeleteProduct = async (id: string | number) => {
    try {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE' })
      toast.success('Produk berhasil dihapus!')
      setProducts(products.filter((p) => p.id !== id))
    } catch (err: any) {
      toast.error('Gagal menghapus produk: ' + err.message)
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(products.map((p) => p.category || 'General')))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Katalog Produk</h1>
          <p className="text-sm text-muted-foreground">
            Kelola seluruh inventaris, daftar produk, harga, dan ketersediaan stok toko Anda.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Tambah Produk Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px]">
            <form onSubmit={handleSubmitProduct}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <PackagePlus className="h-5 w-5 text-primary" />{' '}
                  {editingProduct ? 'Edit Informasi Produk' : 'Tambah Produk Baru'}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct
                    ? 'Ubah data produk e-commerce di bawah ini.'
                    : 'Isi data informasi produk e-commerce baru di bawah ini.'}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Produk</Label>
                  <Input
                    id="name"
                    placeholder="Contoh: Kemeja Linen Casual"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU Produk</Label>
                    <Input
                      id="sku"
                      placeholder="SKU-1234"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => setFormData({ ...formData, category: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pakaian & Fashion">Pakaian & Fashion</SelectItem>
                        <SelectItem value="Elektronik">Elektronik</SelectItem>
                        <SelectItem value="Aksesoris">Aksesoris</SelectItem>
                        <SelectItem value="Perabotan">Perabotan</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Harga (Rp)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="150000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Jumlah Stok</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="25"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">Gambar Produk</Label>
                  <div className="flex items-center gap-3">
                    {formData.image ? (
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden border shrink-0">
                        <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground shrink-0 bg-muted/40">
                        <Upload className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <Input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                      {uploadingImage ? (
                        <p className="text-xs text-primary flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> Mengunggah gambar ke server...
                        </p>
                      ) : (
                        <p className="text-[11px] text-muted-foreground">
                          Format: PNG, JPG, JPEG, WEBP (Maks. 5MB)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="desc">Deskripsi Produk (Opsional)</Label>
                  <Textarea
                    id="desc"
                    placeholder="Tuliskan deskripsi singkat produk..."
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={uploadingImage}>
                  {editingProduct ? 'Simpan Perubahan' : 'Simpan Produk'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-semibold">
              Daftar Produk ({filteredProducts.length})
            </CardTitle>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-[260px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari produk atau SKU..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> Memuat data produk dari server...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Gambar</TableHead>
                  <TableHead>Nama Produk & SKU</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status Stok</TableHead>
                  <TableHead>Terjual</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Tidak ada produk yang sesuai dengan pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img
                          src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=60'}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover border"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold text-sm">{product.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{product.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{product.category || 'General'}</TableCell>
                      <TableCell className="font-semibold">{formatRupiah(product.price)}</TableCell>
                      <TableCell>
                        {product.stock > 5 ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            Stok ({product.stock})
                          </Badge>
                        ) : product.stock > 0 ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Menipis ({product.stock})
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Stok Habis</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-medium">{product.salesCount || 0} unit</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi Produk</DropdownMenuLabel>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleOpenEditDialog(product)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Informasi
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer text-red-600"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus Produk
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
