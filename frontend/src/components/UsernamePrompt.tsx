import { useState } from 'react'
import { useUserStore } from '../store/userStore'

export function UsernamePrompt() {
  const [input, setInput] = useState('')
  const { getOrCreateUser, loading, error, setUser } = useUserStore()
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const username = input.trim()
    if (!username) {
      setLocalError('Enter a username')
      return
    }
    setLocalError(null)
    try {
      await getOrCreateUser(username)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to sign in')
    }
  }

  return (
    <div className="username-prompt">
      <h2>Enter your username</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Username"
          disabled={loading}
          autoFocus
        />
        <button type="submit" disabled={loading}>
          {loading ? '...' : 'Continue'}
        </button>
      </form>
      {(localError ?? error) && (
        <p className="error">{localError ?? error}</p>
      )}
    </div>
  )
}
