import { useState } from 'react'
import { useUserStore } from '../store/userStore'

export function UsernamePrompt() {
  const [input, setInput] = useState('')
  const { getOrCreateUser, loading } = useUserStore()
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

  const errMsg = localError

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="m-0 text-xl font-medium text-black-500 dark:text-black-500">
        Enter your username
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap justify-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Username"
          disabled={loading}
          autoFocus
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-base min-w-[200px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '...' : 'Continue'}
        </button>
      </form>
      {errMsg && (
        <p className="m-0 text-sm text-red-600 dark:text-red-400">
          {errMsg}
        </p>
      )}
    </div>
  )
}
