import React, { useCallback, useEffect, useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Task } from '../data/schema'
import { apiFetch } from '@/lib/api-client'
import { toast } from 'sonner'

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

type TasksContextType = {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Task | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>
  tasksList: Task[]
  loading: boolean
  loadTasks: () => Promise<void>
  createTask: (data: Partial<Task>) => Promise<void>
  updateTask: (id: string, data: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  bulkDeleteTasks: (ids: string[]) => Promise<void>
}

const TasksContext = React.createContext<TasksContextType | null>(null)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Task | null>(null)
  const [tasksList, setTasksList] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await apiFetch<any[]>('/api/tasks')
      // Map API task entity to UI schema
      const mapped: Task[] = data.map((item) => ({
        id: item.taskId || `TASK-${item.id}`,
        title: item.title,
        status: item.status,
        label: item.label,
        priority: item.priority,
        rawId: item.id,
      }))
      setTasksList(mapped)
    } catch (err: any) {
      toast.error('Failed to load tasks: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const createTask = async (data: Partial<Task>) => {
    try {
      await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      toast.success('Task created successfully')
      await loadTasks()
    } catch (err: any) {
      toast.error('Failed to create task: ' + err.message)
    }
  }

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      const taskItem = tasksList.find((t) => t.id === id)
      const numericId = (taskItem as any)?.rawId || id
      await apiFetch(`/api/tasks/${numericId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
      toast.success('Task updated successfully')
      await loadTasks()
    } catch (err: any) {
      toast.error('Failed to update task: ' + err.message)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const taskItem = tasksList.find((t) => t.id === id)
      const numericId = (taskItem as any)?.rawId || id
      await apiFetch(`/api/tasks/${numericId}`, {
        method: 'DELETE',
      })
      toast.success('Task deleted successfully')
      await loadTasks()
    } catch (err: any) {
      toast.error('Failed to delete task: ' + err.message)
    }
  }

  const bulkDeleteTasks = async (ids: string[]) => {
    try {
      const numericIds = ids.map((id) => {
        const item = tasksList.find((t) => t.id === id)
        return (item as any)?.rawId || parseInt(id)
      }).filter(Boolean)

      await apiFetch('/api/tasks/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids: numericIds }),
      })
      toast.success('Selected tasks deleted successfully')
      await loadTasks()
    } catch (err: any) {
      toast.error('Failed to delete tasks: ' + err.message)
    }
  }

  return (
    <TasksContext
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        tasksList,
        loading,
        loadTasks,
        createTask,
        updateTask,
        deleteTask,
        bulkDeleteTasks,
      }}
    >
      {children}
    </TasksContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
