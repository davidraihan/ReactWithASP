import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import {
  SidebarProvider,
  SidebarInset,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  Store,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  User,
} from 'lucide-react'

// Import E-Commerce Feature Pages
import { EcommerceDashboard } from './dashboard'
import { EcommerceProducts } from './products'
import { EcommerceOrders } from './orders'
import { EcommerceCustomers } from './customers'
import { EcommerceDiscounts } from './discounts'
import { EcommerceSettings } from './settings'

export type ActiveTab = 'dashboard' | 'products' | 'orders' | 'customers' | 'discounts' | 'settings'

export function EcommerceAdminLayout() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab') as ActiveTab
      if (tab && ['dashboard', 'products', 'orders', 'customers', 'discounts', 'settings'].includes(tab)) {
        return tab
      }
    }
    return 'dashboard'
  })
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Sync tab change with browser history without page reload
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (tab === 'dashboard') {
        url.searchParams.delete('tab')
      } else {
        url.searchParams.set('tab', tab)
      }
      window.history.pushState({}, '', url.toString())
    }
  }

  // Handle browser Back/Forward buttons dynamically
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const tab = (params.get('tab') as ActiveTab) || 'dashboard'
      setActiveTab(tab)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Katalog Produk', icon: Package, badge: '6' },
    { id: 'orders', label: 'Manajemen Pesanan', icon: ShoppingBag, badge: '5' },
    { id: 'customers', label: 'Data Pelanggan', icon: Users },
    { id: 'discounts', label: 'Kupon & Diskon', icon: Tag, badge: '3' },
  ]

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <EcommerceDashboard onNavigate={(tab) => handleTabChange(tab as ActiveTab)} />
      case 'products':
        return <EcommerceProducts />
      case 'orders':
        return <EcommerceOrders />
      case 'customers':
        return <EcommerceCustomers />
      case 'discounts':
        return <EcommerceDiscounts />
      case 'settings':
        return <EcommerceSettings />
      default:
        return <EcommerceDashboard onNavigate={(tab) => handleTabChange(tab as ActiveTab)} />
    }
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        {/* Sidebar */}
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Store className="h-5 w-5" />
              </div>
              <div className="flex flex-col truncate">
                <span className="font-semibold text-sm leading-tight truncate">Toko Serba Ada</span>
                <span className="text-xs text-muted-foreground">Admin E-Commerce</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarGroup>
              <SidebarGroupLabel>Menu E-Commerce</SidebarGroupLabel>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => handleTabChange(item.id as ActiveTab)}
                        className="cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-semibold">
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="mt-auto">
              <SidebarGroupLabel>Pengaturan</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeTab === 'settings'}
                    onClick={() => handleTabChange('settings')}
                    className="cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    <span>Pengaturan Toko</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center justify-between rounded-lg p-2 text-left hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate text-xs">
                      <span className="font-medium truncate">Admin Toko</span>
                      <span className="text-muted-foreground truncate">admin@tokoserbaada.id</span>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleTabChange('settings')}>
                  <User className="mr-2 h-4 w-4" /> Profil Toko
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer font-medium text-blue-600"
                  onClick={() => {
                    const url = new URL(window.location.href)
                    url.searchParams.set('view', 'public')
                    window.history.pushState({}, '', url.toString())
                    window.dispatchEvent(new Event('popstate'))
                  }}
                >
                  <Store className="mr-2 h-4 w-4" /> Halaman Publik Toko
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600"
                  onClick={() => {
                    useAuthStore.getState().auth.reset()
                    const url = new URL(window.location.href)
                    url.searchParams.set('view', 'public')
                    window.history.pushState({}, '', url.toString())
                    window.dispatchEvent(new Event('popstate'))
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          {/* Top Navbar Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="relative hidden sm:block w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari pesanan, produk, atau pelanggan..."
                  className="pl-8 h-9 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold"
                onClick={() => {
                  const url = new URL(window.location.href)
                  url.searchParams.set('view', 'public')
                  window.history.pushState({}, '', url.toString())
                  window.dispatchEvent(new Event('popstate'))
                }}
              >
                <Store className="h-3.5 w-3.5" /> Liha Toko Publik
              </Button>

              <Button variant="ghost" size="icon" className="relative" title="Notifikasi Pesanan">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              </Button>

              <Button variant="ghost" size="icon" onClick={toggleDarkMode} title="Ganti Tema">
                {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
              </Button>

              <div className="h-6 w-px bg-border mx-1" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block text-sm font-medium">Admin Store</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleTabChange('settings')}>Pengaturan</DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => {
                      useAuthStore.getState().auth.reset()
                      const url = new URL(window.location.href)
                      url.searchParams.set('view', 'public')
                      window.history.pushState({}, '', url.toString())
                      window.dispatchEvent(new Event('popstate'))
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Body Container */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {renderActiveView()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
