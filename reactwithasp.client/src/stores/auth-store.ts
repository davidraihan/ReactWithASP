import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN_KEY = 'accessToken'
const AUTH_USER_KEY = 'authUser'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

const getInitialUser = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem(AUTH_USER_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) {
    console.error('Failed to parse auth user from localStorage', e)
  }
  return null
}

const getInitialToken = (): string => {
  const localToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (localToken) return localToken
  const cookieToken = getCookie('thisisjustarandomstring')
  if (cookieToken) {
    try { return JSON.parse(cookieToken) } catch { return cookieToken }
  }
  return ''
}

export const useAuthStore = create<AuthState>()((set) => {
  return {
    auth: {
      user: getInitialUser(),
      setUser: (user) =>
        set((state) => {
          if (user) {
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
          } else {
            localStorage.removeItem(AUTH_USER_KEY)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: getInitialToken(),
      setAccessToken: (accessToken) =>
        set((state) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
          setCookie('thisisjustarandomstring', JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          removeCookie('thisisjustarandomstring')
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          localStorage.removeItem(AUTH_USER_KEY)
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          removeCookie('thisisjustarandomstring')
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})
