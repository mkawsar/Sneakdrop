import { useEffect } from 'react'
import { socket } from '../lib/socket'
import type { StockUpdatedEvent } from '../types'

export function useSocketStock(onStockUpdated: (e: StockUpdatedEvent) => void) {
  useEffect(() => {
    socket.on('stockUpdated', onStockUpdated)
    return () => {
      socket.off('stockUpdated', onStockUpdated)
    }
  }, [onStockUpdated])
}
