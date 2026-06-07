import { useState, useCallback } from 'react'
import { getLotteryPool, addItem, updateStudentPoints } from '../services/db'
import { weightedDraw } from '../utils/lotteryLogic'
import { LOTTERY_TIER_CONFIG } from '../utils/constants'
import type { Item, LotteryTier } from '../types'

export function useLottery() {
  const [drawing, setDrawing] = useState(false)
  const [result, setResult] = useState<Item | null>(null)

  const draw = useCallback(async (studentId: string, tier: LotteryTier) => {
    setDrawing(true)
    setResult(null)
    const config = LOTTERY_TIER_CONFIG[tier]
    const { error: pointsError } = await updateStudentPoints(studentId, -config.cost, `${config.label}抽奖`)
    if (pointsError) { setDrawing(false); return { error: pointsError, item: null } }
    const { data: pool, error: poolError } = await getLotteryPool(tier)
    if (poolError || !pool || pool.length === 0) { setDrawing(false); return { error: poolError, item: null } }
    const wonItem = weightedDraw(pool)
    const { error: invError } = await addItem(studentId, wonItem.id)
    await new Promise(r => setTimeout(r, 2000))
    setResult(wonItem)
    setDrawing(false)
    return { error: invError, item: wonItem }
  }, [])

  return { draw, drawing, result, resetResult: () => setResult(null) }
}
