import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'
import { useUserStore } from './store/userStore'

const mockSetUser = vi.fn()
vi.mock('./store/userStore', () => ({
  useUserStore: vi.fn(),
}))
vi.mock('./hooks/useReservationExpiry', () => ({ useReservationExpiry: () => {} }))
vi.mock('./components/Dashboard', () => ({ Dashboard: () => <div>Dashboard</div> }))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows username prompt when user is not signed in', () => {
    const store = {
      user: null,
      loading: false,
      setUser: mockSetUser,
      getOrCreateUser: vi.fn(),
    }
    vi.mocked(useUserStore).mockImplementation((selector?: (s: typeof store) => unknown) =>
      typeof selector === 'function' ? selector(store) : store
    )
    render(<App />)
    expect(screen.getByText(/Enter your username/i)).toBeInTheDocument()
  })

  it('shows dashboard and header when user is signed in', () => {
    const store = {
      user: { id: 1, username: 'alice' },
      loading: false,
      setUser: mockSetUser,
      getOrCreateUser: vi.fn(),
    }
    vi.mocked(useUserStore).mockImplementation((selector?: (s: typeof store) => unknown) =>
      typeof selector === 'function' ? selector(store) : store
    )
    render(<App />)
    expect(screen.getByText(/Signed in as/)).toBeInTheDocument()
    expect(screen.getByText('alice')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign out/i })).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('Sign out button calls setUser with null', () => {
    const store = {
      user: { id: 1, username: 'bob' },
      loading: false,
      setUser: mockSetUser,
      getOrCreateUser: vi.fn(),
    }
    vi.mocked(useUserStore).mockImplementation((selector?: (s: typeof store) => unknown) =>
      typeof selector === 'function' ? selector(store) : store
    )
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Sign out/i }))
    expect(mockSetUser).toHaveBeenCalledWith(null)
  })
})
