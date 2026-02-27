import { Toaster } from 'react-hot-toast'
import { useUserStore } from './store/userStore'
import { useReservationExpiry } from './hooks/useReservationExpiry'
import { UsernamePrompt } from './components/UsernamePrompt'
import { Dashboard } from './components/Dashboard'
import './App.css'

function App() {
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)
  useReservationExpiry()

  return (
    <>
      <Toaster position="top-center" />
      <div className="app">
        {user ? (
          <>
            <header className="app-header">
              <span>Signed in as <strong>{user.username}</strong></span>
              <button type="button" className="btn-signout" onClick={() => setUser(null)}>
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
