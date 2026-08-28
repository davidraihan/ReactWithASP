import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  Store,
  HelpCircle,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin E-Commerce',
    email: 'admin@tokoserbaada.id',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Toko Serba Ada',
      logo: Store,
      plan: 'E-Commerce Pro',
    },
  ],
  navGroups: [
    {
      title: 'E-Commerce Utama',
      items: [
        {
          title: 'Dashboard Overview',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Katalog Produk',
          url: '/products',
          icon: Package,
          badge: '6',
        },
        {
          title: 'Manajemen Pesanan',
          url: '/orders',
          icon: ShoppingBag,
          badge: '5',
        },
        {
          title: 'Data Pelanggan',
          url: '/customers',
          icon: Users,
        },
        {
          title: 'Kupon & Diskon',
          url: '/discounts',
          icon: Tag,
          badge: '3',
        },
      ],
    },
    {
      title: 'Pengaturan & Lainnya',
      items: [
        {
          title: 'Pengaturan Toko',
          url: '/settings',
          icon: Settings,
        },
        {
          title: 'Pusat Bantuan',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
