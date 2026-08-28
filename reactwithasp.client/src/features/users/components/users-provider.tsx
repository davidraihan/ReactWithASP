import React, { useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type User } from '../data/schema'
import { apiFetch } from '@/lib/api-client'
import { toast } from 'sonner'

type UsersDialogType = 'invite' | 'add' | 'edit' | 'delete'

type UsersContextType = {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
  usersList: User[]
  loading: boolean
  loadUsers: () => Promise<void>
  createUser: (data: any) => Promise<void>
  updateUser: (id: string, data: any) => Promise<void>
  deleteUser: (id: string) => Promise<void>
}

const UsersContext = React.createContext<UsersContextType | null>(null)

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)
  const [usersList, setUsersList] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await apiFetch<any[]>('/api/users')
      const mapped: User[] = data.map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        username: u.username || u.email.split('@')[0],
        email: u.email,
        phoneNumber: u.phoneNumber,
        status: (u.status || 'active') as any,
        role: (u.role || 'user') as any,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
      }))
      setUsersList(mapped)
    } catch (err: any) {
      toast.error('Failed to load users: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const createUser = async (data: any) => {
    try {
      await apiFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      toast.success('User created successfully')
      await loadUsers()
    } catch (err: any) {
      toast.error('Failed to create user: ' + err.message)
    }
  }

  const updateUser = async (id: string, data: any) => {
    try {
      await apiFetch(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
      toast.success('User updated successfully')
      await loadUsers()
    } catch (err: any) {
      toast.error('Failed to update user: ' + err.message)
    }
  }

  const deleteUser = async (id: string) => {
    try {
      await apiFetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      toast.success('User deleted successfully')
      await loadUsers()
    } catch (err: any) {
      toast.error('Failed to delete user: ' + err.message)
    }
  }

  return (
    <UsersContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        usersList,
        loading,
        loadUsers,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UsersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersContext>')
  }

  return usersContext
}
