export interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  image: string
  description?: string
  salesCount: number
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  date: string
  totalAmount: number
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded'
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  shippingAddress: string
}

export interface Customer {
  id: string
  name: string
  email: string
  avatar: string
  phone: string
  totalOrders: number
  totalSpent: number
  joinedDate: string
  status: 'active' | 'inactive'
}

export interface DiscountCoupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minPurchase: number
  usageLimit: number
  usedCount: number
  expiryDate: string
  status: 'active' | 'expired' | 'scheduled'
}

export interface EcommerceStat {
  title: string
  value: string
  change: string
  isPositive: boolean
  description: string
}
