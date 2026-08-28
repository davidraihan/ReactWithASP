import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Users, UserCheck, ShoppingCart, DollarSign } from 'lucide-react'
import { mockCustomers } from '../mock-data'

export function EcommerceCustomers() {
  const [customers] = useState(mockCustomers)
  const [searchQuery, setSearchQuery] = useState('')

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  )

  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpent, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Pelanggan</h1>
          <p className="text-sm text-muted-foreground">
            Daftar pembeli terdaftar, total riwayat belanja, dan performa loyalitas pelanggan.
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length} Orang</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pelanggan Aktif</CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {customers.filter((c) => c.status === 'active').length} Orang
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Nilai Belanja Pelanggan</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(totalSpentAll)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-base font-semibold">Daftar Pelanggan</CardTitle>
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari nama, email, atau telepon..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Profil</TableHead>
                <TableHead>Nama Pelanggan</TableHead>
                <TableHead>Kontak & Email</TableHead>
                <TableHead>Tanggal Bergabung</TableHead>
                <TableHead>Jumlah Pesanan</TableHead>
                <TableHead>Total Belanja</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Pelanggan tidak ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((cust) => (
                  <TableRow key={cust.id}>
                    <TableCell>
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={cust.avatar} alt={cust.name} />
                        <AvatarFallback>{cust.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-semibold text-sm">{cust.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{cust.email}</div>
                      <div className="text-xs text-muted-foreground font-mono">{cust.phone}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{cust.joinedDate}</TableCell>
                    <TableCell className="text-sm font-medium flex items-center gap-1.5 pt-4">
                      <ShoppingCart className="h-3.5 w-3.5 text-muted-foreground" /> {cust.totalOrders} order
                    </TableCell>
                    <TableCell className="font-bold">{formatRupiah(cust.totalSpent)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          cust.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-zinc-100 text-zinc-600'
                        }
                      >
                        {cust.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
