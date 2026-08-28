import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { mockStats, mockSalesChartData, mockOrders, mockProducts } from '../mock-data'

interface EcommerceDashboardProps {
  onNavigate?: (tab: string) => void
}

export function EcommerceDashboard({ onNavigate }: EcommerceDashboardProps) {
  const lowStockProducts = mockProducts.filter(
    (p) => p.status === 'low_stock' || p.status === 'out_of_stock'
  )

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
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Diproses</Badge>
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Dikirim</Badge>
      case 'delivered':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Selesai</Badge>
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Menunggu</Badge>
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Dibatalkan</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">E-Commerce Overview</h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan performa toko, penjualan, dan persediaan produk Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => onNavigate?.('products')}>
            <Package className="mr-2 h-4 w-4" /> Kelola Produk
          </Button>
          <Button variant="outline" onClick={() => onNavigate?.('orders')}>
            <ShoppingBag className="mr-2 h-4 w-4" /> Lihat Pesanan
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pendapatan
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats[0].value}</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {mockStats[0].change} <span className="text-muted-foreground font-normal ml-1">{mockStats[0].description}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pesanan
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <ShoppingBag className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats[1].value}</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {mockStats[1].change} <span className="text-muted-foreground font-normal ml-1">{mockStats[1].description}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produk Terjual
            </CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-full">
              <Package className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats[2].value}</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {mockStats[2].change} <span className="text-muted-foreground font-normal ml-1">{mockStats[2].description}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peringatan Stok
            </CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-full">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{mockStats[3].value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockStats[3].description}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section & Stock Alert */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Sales Chart */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Grafik Penjualan Bulanan</CardTitle>
            <CardDescription>
              Tren omzet dan pertumbuhan pesanan selama tahun 2026.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSalesChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)}Jt`}
                />
                <Tooltip
                  formatter={(value: any) => [formatRupiah(Number(value)), 'Omset']}
                  labelFormatter={(label) => `Bulan: ${label}`}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Low Stock Widget */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Stok Menipis
              </CardTitle>
              <Badge variant="secondary">{lowStockProducts.length}</Badge>
            </div>
            <CardDescription>Produk yang membutuhkan restok segera.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 rounded-md object-cover border"
                  />
                  <div className="truncate">
                    <p className="text-sm font-medium leading-none truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                  </div>
                </div>
                <Badge
                  variant={product.stock === 0 ? 'destructive' : 'outline'}
                  className={product.stock > 0 ? 'border-amber-500 text-amber-600 bg-amber-50' : ''}
                >
                  {product.stock === 0 ? 'Habis' : `${product.stock} tersisa`}
                </Badge>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => onNavigate?.('products')}
            >
              Lihat Semua Produk <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pesanan Terbaru</CardTitle>
            <CardDescription>Daftar transaksi pelanggan terkini di toko Anda.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate?.('orders')}>
            Semua Pesanan <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Pesanan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Total Transaksi</TableHead>
                <TableHead>Status Pembayaran</TableHead>
                <TableHead>Status Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.slice(0, 5).map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                  <TableCell className="font-semibold">{formatRupiah(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : order.paymentStatus === 'pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }
                    >
                      {order.paymentStatus === 'paid' ? 'Lunas' : order.paymentStatus === 'pending' ? 'Belum Bayar' : 'Gagal'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getOrderStatusBadge(order.orderStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
