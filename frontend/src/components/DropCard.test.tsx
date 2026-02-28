import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DropCard } from './DropCard'
import type { Drop } from '../types'

vi.mock('../store/userStore', () => ({
  useUserStore: (fn: (s: { user: null }) => unknown) => fn({ user: null } as never),
}))
vi.mock('../store/reservationStore', () => ({
  useReservationStore: (fn: (s: object) => unknown) =>
    fn({
      reservation: null,
      reserve: vi.fn(),
      purchase: vi.fn(),
      reserving: false,
      purchasing: false,
    } as never),
}))
vi.mock('../store/dropStore', () => ({
  useDropStore: (fn: (s: { setStock: () => void }) => unknown) =>
    fn({ setStock: vi.fn() } as never),
}))
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const mockDrop: Drop = {
  id: 1,
  name: 'Air Jordan 1',
  price_cents: 19900,
  total_stock: 100,
  available_stock: 50,
  starts_at: null,
  ends_at: null,
  latest_purchasers: [],
}

describe('DropCard', () => {
  it('renders drop name and price', () => {
    render(<DropCard drop={mockDrop} />)
    expect(screen.getByText('Air Jordan 1')).toBeInTheDocument()
    expect(screen.getByText('$199.00')).toBeInTheDocument()
  })

  it('renders stock count', () => {
    render(<DropCard drop={mockDrop} />)
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('shows Recent purchasers section', () => {
    render(<DropCard drop={mockDrop} />)
    expect(screen.getByText(/Recent purchasers:/)).toBeInTheDocument()
    expect(screen.getByText('No purchases yet.')).toBeInTheDocument()
  })
})
