import type { LotteryPoolEntry, Item } from '../types'

export function weightedDraw(pool: (LotteryPoolEntry & { item: Item })[]): Item {
  const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0)
  let random = Math.random() * totalWeight
  for (const entry of pool) {
    random -= entry.weight
    if (random <= 0) return entry.item
  }
  return pool[pool.length - 1].item
}
