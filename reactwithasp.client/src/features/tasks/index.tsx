import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TasksDialogs } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksProvider, useTasks } from './components/tasks-provider'
import { TasksTable } from './components/tasks-table'
import { Loader2 } from 'lucide-react'

function TasksContent() {
  const { tasksList, loading } = useTasks()

  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tasks</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        {loading ? (
          <div className='flex items-center justify-center py-12 text-muted-foreground gap-2'>
            <Loader2 className='h-5 w-5 animate-spin' /> Loading tasks from server...
          </div>
        ) : (
          <TasksTable data={tasksList} />
        )}
      </Main>

      <TasksDialogs />
    </>
  )
}

export function Tasks() {
  return (
    <TasksProvider>
      <TasksContent />
    </TasksProvider>
  )
}
