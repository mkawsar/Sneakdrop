import { Toaster } from 'react-hot-toast'
import { useUserStore } from './store/userStore'
import { useReservationExpiry } from './hooks/useReservationExpiry'
import { UsernamePrompt } from './components/UsernamePrompt'
import { Dashboard } from './components/Dashboard'

function App() {
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)
  useReservationExpiry()

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen px-4 py-4 max-w-6xl mx-auto">
        {user ? (
          <>
            <header className="flex items-center justify-between mb-4 text-sm text-gray-500 dark:text-gray-400">
              <span>
                Signed in as <strong className="text-gray-700 dark:text-gray-200">{user.username}</strong>
              </span>
              <button
                type="button"
                onClick={() => setUser(null)}
                className="px-2 py-1 text-sm bg-transparent border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded hover:text-gray-700 hover:border-gray-500 dark:hover:text-gray-200 dark:hover:border-gray-400 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </header>
            <Dashboard />
          </>
        ) : (
          <UsernamePrompt />
        )}
      </div>
    </>
  )
}

export default App
