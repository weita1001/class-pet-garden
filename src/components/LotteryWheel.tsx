import { useState } from 'react'
import type { Item, LotteryTier } from '../types'
import { LOTTERY_TIER_CONFIG } from '../utils/constants'

interface Props {
  studentName: string
  studentPoints: number
  onDraw: (tier: LotteryTier) => Promise<{ error: any; item: Item | null }>
  onClose: () => void
}

export default function LotteryWheel({ studentName, studentPoints, onDraw, onClose }: Props) {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<Item | null>(null)
  const [error, setError] = useState('')

  const tiers: LotteryTier[] = ['bronze', 'silver', 'gold']

  const handleDraw = async (tier: LotteryTier) => {
    const config = LOTTERY_TIER_CONFIG[tier]
    if (studentPoints < config.cost) { setError(`积分不足！需要 ${config.cost} 分，当前 ${studentPoints} 分`); return }
    setError('')
    setSpinning(true)
    const { error: drawError, item } = await onDraw(tier)
    setSpinning(false)
    if (drawError) { setError(drawError.message || '抽奖失败') }
    else if (item) { setResult(item) }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 420, textAlign: 'center' }}>
        <h2>🎰 {studentName} 的抽奖</h2>
        <p style={{ color: '#999', fontSize: 14 }}>当前积分：⭐ {studentPoints}</p>
        {error && <div style={{ background: '#fce4ec', color: '#c62828', padding: 8, borderRadius: 8, marginBottom: 12, fontSize: 13 }}>{error}</div>}

        {!spinning && !result && (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '20px 0' }}>
            {tiers.map(tier => {
              const config = LOTTERY_TIER_CONFIG[tier]
              const canAfford = studentPoints >= config.cost
              return (
                <button key={tier} onClick={() => handleDraw(tier)} disabled={!canAfford} style={{
                  padding: 16, borderRadius: 12, textAlign: 'center',
                  background: canAfford ? '#fff' : '#f5f5f5',
                  border: `2px solid ${canAfford ? '#ff9800' : '#e0e0e0'}`,
                  cursor: canAfford ? 'pointer' : 'default', opacity: canAfford ? 1 : 0.5, flex: 1,
                }}>
                  <div style={{ fontSize: 28 }}>{config.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{config.label}</div>
                  <div style={{ fontSize: 12, color: '#ff9800' }}>消耗 {config.cost} 分</div>
                </button>
              )
            })}
          </div>
        )}

        {spinning && (
          <div style={{ padding: 32 }}>
            <div style={{ fontSize: 64, animation: 'spin 0.3s linear infinite' }}>🎰</div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#999', marginTop: 12 }}>抽奖中...</p>
          </div>
        )}

        {result && (
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 64 }}>{result.icon}</div>
            <h3 style={{ color: result.rarity === 'legendary' ? '#9c27b0' : result.rarity === 'rare' ? '#ff9800' : '#666' }}>
              {result.name}
            </h3>
            <p style={{ fontSize: 12, color: '#999' }}>稀有度：{result.rarity === 'legendary' ? '传说' : result.rarity === 'rare' ? '稀有' : '普通'}</p>
            <button onClick={() => setResult(null)} style={{ marginTop: 12, padding: '8px 24px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', marginRight: 8 }}>再抽一次</button>
          </div>
        )}

        <button onClick={onClose} style={{ marginTop: 12, padding: '8px 24px', background: 'transparent', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer' }}>关闭</button>
      </div>
    </div>
  )
}
