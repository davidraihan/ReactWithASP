import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search, Eye, ShoppingBag, Truck, CheckCircle2, Clock, XCircle, MapPin, Mail, User } from 'lucide-react'
import { mockOrders } from '../mock-data'
import type { Order } from '../types'

export function EcommerceOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"><Clock className="h-3 w-3" /> Diproses</Badge>
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1"><Truck className="h-3 w-3" /> Dikirim</Badge>
      case 'delivered':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Selesai</Badge>
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"><Clock className="h-3 w-3" /> Menunggu</Badge>
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"><XCircle className="h-3 w-3" /> Dibatalkan</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === 'all' || ord.orderStatus === activeTab
    return matchesSearch && matchesTab
  })

  const updateOrderStatus = (orderId: string, newStatus: Order['orderStatus']) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o)))
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Pesanan</h1>
          <p className="text-sm text-muted-foreground">
            Pantau dan proses pesanan masuk dari pembeli secara praktis.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full md:w-auto">
                <TabsTrigger value="all">Semua ({orders.length})</TabsTrigger>
                <TabsTrigger value="pending">Menunggu</TabsTrigger>
                <TabsTrigger value="processing">Diproses</TabsTrigger>
                <TabsTrigger value="shipped">Dikirim</TabsTrigger>
                <TabsTrigger value="delivered">Selesai</TabsTrigger>
                <TabsTrigger value="cancelled">Dibatalkan</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-[280px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari No. Order atau Pelanggan..."
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
                <TableHead>No. Order</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Tanggal Transaksi</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Total Tagihan</TableHead>
                <TableHead>Pembayaran</TableHead>
                <TableHead>Status Order</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Tidak ada pesanan ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-semibold font-mono">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                    <TableCell className="text-sm">{order.items.length} Barang</TableCell>
                    <TableCell className="font-bold">{formatRupiah(order.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }
                      >
                        {order.paymentStatus === 'paid' ? 'Lunas' : 'Belum Bayar'}
                      </Badge>
                    </TableCell>
                    <TableCell>{getOrderStatusBadge(order.orderStatus)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="h-8"
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" /> Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2 font-mono">
                  <ShoppingBag className="h-5 w-5 text-primary" /> {selectedOrder.orderNumber}
                </DialogTitle>
                {getOrderStatusBadge(selectedOrder.orderStatus)}
              </div>
              <DialogDescription>
                Waktu Transaksi: {selectedOrder.date}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Customer Info Card */}
              <div className="p-3 bg-muted/40 rounded-lg text-sm space-y-1.5">
                <div className="flex items-center gap-2 font-medium">
                  <User className="h-4 w-4 text-muted-foreground" /> {selectedOrder.customerName}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" /> {selectedOrder.customerEmail}
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5" /> {selectedOrder.shippingAddress}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Rincian Barang</h4>
                <div className="border rounded-md divide-y">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center text-sm">
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-xs text-muted-foreground">{item.quantity} x {formatRupiah(item.unitPrice)}</div>
                      </div>
                      <div className="font-semibold">{formatRupiah(item.quantity * item.unitPrice)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="flex justify-between items-center border-t pt-3 font-semibold text-base">
                <span>Total Pembayaran</span>
                <span className="text-primary text-lg">{formatRupiah(selectedOrder.totalAmount)}</span>
              </div>

              {/* Quick Action Status Updater */}
              <div className="pt-2 border-t space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Ubah Status Pesanan</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={selectedOrder.orderStatus === 'processing' ? 'default' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                  >
                    Set Diproses
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedOrder.orderStatus === 'shipped' ? 'default' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                  >
                    Set Dikirim
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedOrder.orderStatus === 'delivered' ? 'default' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                  >
                    Set Selesai
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedOrder.orderStatus === 'cancelled' ? 'destructive' : 'outline'}
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                  >
                    Batalkan
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
