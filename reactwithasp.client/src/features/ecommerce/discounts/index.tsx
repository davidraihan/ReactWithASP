import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Ticket, Plus, Tag, Calendar} from 'lucide-react'
import { mockDiscounts } from '../mock-data'
import type { DiscountCoupon } from '../types'

export function EcommerceDiscounts() {
  const [coupons, setCoupons] = useState<DiscountCoupon[]>(mockDiscounts)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minPurchase: '',
    usageLimit: '',
    expiryDate: '',
  })

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCoupon.code || !newCoupon.value) return

    const created: DiscountCoupon = {
      id: `disc-${Date.now()}`,
      code: newCoupon.code.toUpperCase(),
      type: newCoupon.type as 'percentage' | 'fixed',
      value: parseInt(newCoupon.value) || 0,
      minPurchase: parseInt(newCoupon.minPurchase) || 0,
      usageLimit: parseInt(newCoupon.usageLimit) || 100,
      usedCount: 0,
      expiryDate: newCoupon.expiryDate || '31 Des 2026',
      status: 'active',
    }

    setCoupons([created, ...coupons])
    setNewCoupon({ code: '', type: 'percentage', value: '', minPurchase: '', usageLimit: '', expiryDate: '' })
    setIsAddOpen(false)
  }

  const toggleCouponStatus = (id: string) => {
    setCoupons(
      coupons.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'active' ? 'expired' : 'active' }
          : c
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kupon & Promo Diskon</h1>
          <p className="text-sm text-muted-foreground">
            Kelola kode voucher diskon dan penawaran khusus untuk meningkatkan penjualan toko.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Buat Kupon Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <form onSubmit={handleAddCoupon}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" /> Buat Kupon Diskon Baru
                </DialogTitle>
                <DialogDescription>
                  Masukkan rincian kode voucher dan batasan penggunaannya.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Kode Kupon / Voucher</Label>
                  <Input
                    id="code"
                    placeholder="Contoh: PROMO10K / GAJIAN"
                    className="uppercase font-mono"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipe Diskon</Label>
                    <Select
                      value={newCoupon.type}
                      onValueChange={(val) => setNewCoupon({ ...newCoupon, type: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Persentase (%)</SelectItem>
                        <SelectItem value="fixed">Potongan Tetap (Rp)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="val">Nilai Diskon</Label>
                    <Input
                      id="val"
                      type="number"
                      placeholder={newCoupon.type === 'percentage' ? '15' : '50000'}
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="min">Min. Belanja (Rp)</Label>
                    <Input
                      id="min"
                      type="number"
                      placeholder="100000"
                      value={newCoupon.minPurchase}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="limit">Batas Penggunaan</Label>
                    <Input
                      id="limit"
                      type="number"
                      placeholder="500"
                      value={newCoupon.usageLimit}
                      onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="expiry">Tanggal Kadaluarsa</Label>
                  <Input
                    id="expiry"
                    placeholder="31 Des 2026"
                    value={newCoupon.expiryDate}
                    onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">Simpan Kupon</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Coupons Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kode Promo Aktif ({coupons.length})</CardTitle>
          <CardDescription>Kode promo yang dapat digunakan pembeli saat checkout.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode Promo</TableHead>
                <TableHead>Nilai Diskon</TableHead>
                <TableHead>Min. Belanja</TableHead>
                <TableHead>Penggunaan</TableHead>
                <TableHead>Berlaku Sampai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-bold text-primary flex items-center gap-2">
                    <Tag className="h-4 w-4" /> {coupon.code}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {coupon.type === 'percentage' ? `${coupon.value}%` : formatRupiah(coupon.value)}
                  </TableCell>
                  <TableCell className="text-sm">{formatRupiah(coupon.minPurchase)}</TableCell>
                  <TableCell className="text-sm">
                    {coupon.usedCount} / {coupon.usageLimit} voucher
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground flex items-center gap-1.5 pt-4">
                    <Calendar className="h-3.5 w-3.5" /> {coupon.expiryDate}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        coupon.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-zinc-100 text-zinc-600'
                      }
                    >
                      {coupon.status === 'active' ? 'Aktif' : 'Kadaluarsa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCouponStatus(coupon.id)}
                    >
                      {coupon.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
