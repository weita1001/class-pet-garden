import { useState } from 'react'
import type { PetWithStudent } from '../types'
import { PET_EMOJI, PERSONALITY_EMOJI, PERSONALITY_LABEL, STAGE_LABEL } from '../utils/constants'

interface Props {
  pet: PetWithStudent
  onFeed: () => Promise<{ error: any; evolved: boolean }>
  onAddPoints: (amount: number) => void
  onLottery: () => void
  onBag: () => void
  onShop: () => void
  onClose: () => void
}

export default function PetDetail({ pet, onFeed, onAddPoints, onLottery, onBag, onShop, onClose }: Props) {
  const [feeding, setFeeding] = useState(false)
  const [evolvedMsg, setEvolvedMsg] = useState('')
  const [showPoints, setShowPoints] = useState(false)
  const [customPoints, setCustomPoints] = useState('')

  const emoji = PET_EMOJI[pet.type]?.[pet.stage] || '🐾'
  const designUrl = (() => {
    if (!pet.design) return null
    try { const d = typeof pet.design === 'string' ? JSON.parse(pet.design) : pet.design; return d.image_path || null }
    catch { return null }
  })()

  const handleFeed = async () => {
    setFeeding(true)
    const { error, evolved } = await onFeed()
    setFeeding(false)
    if (!error && evolved) { setEvolvedMsg('🎉 进化了！'); setTimeout(() => setEvolvedMsg(''), 3000) }
  }

  const QUICK_POINTS_BUTTONS = [
    { label: '🙋 +1', amount: 1 }, { label: '📝 +3', amount: 3 },
    { label: '🤝 +5', amount: 5 }, { label: '🌟 +5', amount: 5 }, { label: '🎯 +10', amount: 10 },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 400, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          {designUrl ? (
            <img src={designUrl} alt={pet.type} style={{ width: 100, height: 100, imageRendering: 'pixelated', borderRadius: 12 }} />
          ) : (
            <div style={{ fontSize: 72 }}>{emoji}</div>
          )}
          {evolvedMsg && <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff9800', animation: 'pulse 0.5s' }}>{evolvedMsg}</div>}
          <h3 style={{ margin: '4px 0' }}>{pet.student_name} 的宠物</h3>
          <div style={{ fontSize: 13, color: '#666' }}>
            {PERSONALITY_EMOJI[pet.personality]} {PERSONALITY_LABEL[pet.personality]} · {STAGE_LABEL[pet.stage]}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 13 }}>🍞 饱食度</span>
            <div style={{ background: '#eee', height: 10, borderRadius: 5, marginTop: 4 }}>
              <div style={{ width: `${pet.hunger}%`, height: '100%', background: pet.hunger < 30 ? '#f44336' : '#4caf50', borderRadius: 5, transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 13 }}>😊 快乐值</span>
            <div style={{ background: '#eee', height: 10, borderRadius: 5, marginTop: 4 }}>
              <div style={{ width: `${pet.happiness}%`, height: '100%', background: '#ff9800', borderRadius: 5, transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#666' }}>
            喂食次数：<strong>{pet.feed_count}</strong> &nbsp;|&nbsp; 积分：<strong>⭐{pet.student_points}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={handleFeed} disabled={feeding} style={{
            flex: 1, padding: '10px 16px', background: feeding ? '#ccc' : '#4caf50', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 14, cursor: feeding ? 'default' : 'pointer',
          }}>{feeding ? '🍞 喂食中...' : '🍞 喂食'}</button>
          <button onClick={() => setShowPoints(!showPoints)} style={{
            padding: '10px 16px', background: '#2196f3', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer',
          }}>💰 加分</button>
          <button onClick={onLottery} style={{
            padding: '10px 16px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer',
          }}>🎰 抽奖</button>
          <button onClick={onBag} style={{
            padding: '10px 16px', background: '#9c27b0', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer',
          }}>🎒 背包</button>
          <button onClick={onShop} style={{
            padding: '10px 16px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer',
          }}>🏪 商城</button>
        </div>

        {showPoints && (
          <div style={{ background: '#f5f5f5', borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {QUICK_POINTS_BUTTONS.map(qp => (
                <button key={qp.label} onClick={() => onAddPoints(qp.amount)} style={{
                  padding: '6px 12px', border: '1px solid #ddd', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 12,
                }}>{qp.label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <input type="number" placeholder="自定义分数" value={customPoints}
                onChange={e => setCustomPoints(e.target.value)}
                style={{ width: 80, padding: '6px 8px', border: '1px solid #ddd', borderRadius: 8, fontSize: 13 }} />
              <button onClick={() => { if (customPoints) { onAddPoints(parseInt(customPoints)); setCustomPoints('') } }}
                style={{ padding: '6px 12px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>确认</button>
            </div>
          </div>
        )}

        <button onClick={onClose} style={{ width: '100%', padding: 8, background: 'transparent', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer' }}>关闭</button>
      </div>
    </div>
  )
}
