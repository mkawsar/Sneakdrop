import { useEffect } from 'react'
import { socket } from '../lib/socket'
import type { PurchaseCompletedEvent } from '../types'

export function useSocketPurchase(onPurchase: (e: PurchaseCompletedEvent) => void) {
  useEffect(() => {
    socket.on('purchaseCompleted', onPurchase)
    return () => {
      socket.off('purchaseCompleted', onPurchase)
    }
  }, [onPurchase])
}
