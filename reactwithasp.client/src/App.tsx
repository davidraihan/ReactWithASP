import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { EcommerceAdminLayout } from '@/features/ecommerce/ecommerce-admin-layout'
import { PublicStorefront } from '@/features/ecommerce/public-storefront'
import { LoginForm } from '@/components/LoginForm'
import { RegisterForm } from '@/components/RegisterForm'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

export type ViewMode = 'public' | 'admin' | 'login' | 'register'

export default function App() {
  const { auth } = useAuthStore()
  const user = auth.user
  const isAdmin = user?.role?.includes('admin') || user?.role?.includes('superadmin')

  // Derive initial view mode from URL search param or auth state
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const view = params.get('view') as ViewMode
      if (view && ['public', 'admin', 'login', 'register'].includes(view)) {
        return view
      }
    }
    // Default: If user is logged in as admin, default to admin view, else public view
    return isAdmin ? 'admin' : 'public'
  })

  // Synchronize view mode with URL search params (History API)
  const navigateToView = (mode: ViewMode) => {
    // Guard check for admin view
    if (mode === 'admin') {
      if (!user) {
        toast.error('Silakan login terlebih dahulu untuk mengakses Admin Dashboard.')
        setViewMode('login')
        updateUrl('login')
        return
      }
      if (!isAdmin) {
        toast.error('Akses ditolak: Akun Anda tidak memiliki hak akses Admin.')
        setViewMode('public')
        updateUrl('public')
        return
      }
    }

    setViewMode(mode)
    updateUrl(mode)
  }

  const updateUrl = (mode: ViewMode) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (mode === 'public') {
        url.searchParams.delete('view')
      } else {
        url.searchParams.set('view', mode)
      }
      window.history.pushState({}, '', url.toString())
    }
  }

  // Handle browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const view = (params.get('view') as ViewMode) || (isAdmin ? 'admin' : 'public')
      setViewMode(view)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isAdmin])

  // Handle login success callback
  const handleLoginSuccess = (data: { accessToken: string; accessExpiresAt: string; refreshToken: string; user?: any }) => {
    const loggedInUser = data.user || auth.user
    const loggedInIsAdmin =
      loggedInUser?.role?.includes('admin') ||
      loggedInUser?.role?.includes('superadmin') ||
      loggedInUser?.email?.toLowerCase().includes('admin')

    // Update store state
    if (data.user) {
      auth.setUser(data.user)
    }
    if (data.accessToken) {
      auth.setAccessToken(data.accessToken)
    }

    if (loggedInIsAdmin) {
      toast.success('Login Berhasil! Dialihkan ke Dashboard Admin.')
      navigateToView('admin')
    } else {
      toast.success('Login Berhasil! Dialihkan ke Halaman Publik.')
      navigateToView('public')
    }
  }

  // Handle register success callback
  const handleRegisterSuccess = (email: string) => {
    const isAdminEmail = email.toLowerCase().includes('admin')
    const userRole = isAdminEmail ? ['admin'] : ['user']

    // Update store state with newly registered user
    auth.setUser({
      accountNo: isAdminEmail ? 'ADM001' : 'ACC001',
      email,
      role: userRole,
      exp: Date.now() + 86400000,
    })

    if (isAdminEmail) {
      toast.success(`Registrasi Admin berhasil untuk ${email}!`)
      navigateToView('admin')
    } else {
      toast.success(`Registrasi akun berhasil untuk ${email}!`)
      navigateToView('public')
    }
  }

  // Render view conditionally based on viewMode
  const renderContent = () => {
    switch (viewMode) {
      case 'admin':
        if (!user || !isAdmin) {
          return (
            <PublicStorefront
              onNavigateToLogin={() => navigateToView('login')}
              onNavigateToRegister={() => navigateToView('register')}
              onNavigateToAdmin={() => navigateToView('admin')}
            />
          )
        }
        return <EcommerceAdminLayout />

      case 'login':
        return (
          <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
            <button
              onClick={() => navigateToView('public')}
              className="mb-4 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Kembali ke Halaman Toko
            </button>
            <LoginForm
              onSuccess={handleLoginSuccess}
              onSwitchToRegister={() => navigateToView('register')}
            />
          </div>
        )

      case 'register':
        return (
          <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
            <button
              onClick={() => navigateToView('public')}
              className="mb-4 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Kembali ke Halaman Toko
            </button>
            <RegisterForm
              onSwitchToLogin={() => navigateToView('login')}
              onRegisterSuccess={handleRegisterSuccess}
            />
          </div>
        )

      case 'public':
      default:
        return (
          <PublicStorefront
            onNavigateToLogin={() => navigateToView('login')}
            onNavigateToRegister={() => navigateToView('register')}
            onNavigateToAdmin={() => navigateToView('admin')}
          />
        )
    }
  }

  return (
    <>
      {renderContent()}
      <Toaster position="top-right" duration={4000} />
    </>
  )
}