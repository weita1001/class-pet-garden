import { useState, useEffect } from 'react'
import type { PetWithStudent } from '../types'
import { PET_EMOJI, PERSONALITY_EMOJI, PERSONALITY_LABEL, STAGE_LABEL } from '../utils/constants'
import { getEffectiveStats } from '../utils/petLogic'

interface Props {
  pet: PetWithStudent
  onFeed: (itemId?: string) => Promise<{ error: any; evolved: boolean }>
  onPlay: (itemId?: string) => Promise<void>
  onAddPoints: (amount: number) => void
  onLottery: () => void
  onBag: () => void
  onShop: () => void
  onEvolve: (newType: string) => void
  inventory: Array<{ id: string; item_id: string; quantity: number; item?: { name: string; category: string; icon: string } }>
  onClose: () => void
}

export default function PetDetail({ pet, onFeed, onAddPoints, onLottery, onBag, onShop, onEvolve, onPlay, inventory, onClose }: Props) {
  const [feeding, setFeeding] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [evolvedMsg, setEvolvedMsg] = useState('')
  const [showPoints, setShowPoints] = useState(false)
  const [customPoints, setCustomPoints] = useState('')
  const [showEvolve, setShowEvolve] = useState(false)
  const [showFeedChoice, setShowFeedChoice] = useState(false)
  const [showPlayChoice, setShowPlayChoice] = useState(false)

  const foodItems = inventory.filter(i => i.item?.category === 'food' && i.quantity > 0)
  const toyItems = inventory.filter(i => i.item?.category === 'decoration' && i.quantity > 0)
  const [stats, setStats] = useState({ hunger: pet.hunger, happiness: pet.happiness })

  useEffect(() => {
    const update = () => {
      const s = getEffectiveStats({ hunger: pet.hunger, happiness: pet.happiness, last_fed_at: pet.last_fed_at })
      setStats(s)
    }
    update()
    const interval = setInterval(update, 15000)
    return () => clearInterval(interval)
  }, [pet.hunger, pet.happiness, pet.last_fed_at])

  const emoji = PET_EMOJI[pet.type]?.[pet.stage] || '🐾'
  const designUrl = (() => {
    if (!pet.design) return null
    try { const d = typeof pet.design === 'string' ? JSON.parse(pet.design) : pet.design; return d.image_path || null }
    catch { return null }
  })()

  const handleFeedItem = async (itemId: string) => {
    setFeeding(true)
    const { error, evolved } = await onFeed(itemId)
    setFeeding(false)
    setShowFeedChoice(false)
    if (!error && evolved) { setEvolvedMsg('🎉 进化了！'); setTimeout(() => setEvolvedMsg(''), 3000) }
  }

  const handlePlayItem = async (itemId: string) => {
    setPlaying(true)
    await onPlay(itemId)
    setPlaying(false)
    setShowPlayChoice(false)
    setEvolvedMsg('🎮 玩得开心！'); setTimeout(() => setEvolvedMsg(''), 2000)
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13 }}>🍞 饱食度</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{stats.hunger}/100</span>
            </div>
            <div style={{ background: '#eee', height: 10, borderRadius: 5, marginTop: 4 }}>
              <div style={{ width: `${stats.hunger}%`, height: '100%', background: stats.hunger < 30 ? '#f44336' : '#4caf50', borderRadius: 5, transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13 }}>😊 快乐值</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{stats.happiness}/100</span>
            </div>
            <div style={{ background: '#eee', height: 10, borderRadius: 5, marginTop: 4 }}>
              <div style={{ width: `${stats.happiness}%`, height: '100%', background: '#ff9800', borderRadius: 5, transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ fontSize: 13, color: '#666' }}>
            喂食次数：<strong>{pet.feed_count}</strong> &nbsp;|&nbsp; 积分：<strong>⭐{pet.student_points}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <button onClick={() => {
            if (foodItems.length > 0) setShowFeedChoice(!showFeedChoice)
          }} disabled={feeding || foodItems.length === 0} style={{
            flex: 1, padding: '10px 16px', background: feeding ? '#ccc' : foodItems.length > 0 ? '#4caf50' : '#ccc', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 14, cursor: foodItems.length > 0 && !feeding ? 'pointer' : 'default',
          }}>{feeding ? '喂食中...' : foodItems.length > 0 ? `🍞 喂食 (${foodItems.length})` : '🍞 无食物'}</button>
          <button onClick={() => {
            if (toyItems.length > 0) setShowPlayChoice(!showPlayChoice)
          }} disabled={playing || toyItems.length === 0} style={{
            flex: 1, padding: '10px 16px', background: playing ? '#ccc' : toyItems.length > 0 ? '#2196f3' : '#ccc', color: '#fff',
            border: 'none', borderRadius: 10, fontSize: 14, cursor: toyItems.length > 0 && !playing ? 'pointer' : 'default',
          }}>{playing ? '玩耍中...' : toyItems.length > 0 ? `🎮 玩耍 (${toyItems.length})` : '🎮 无玩具'}</button>
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
          <button onClick={() => setShowEvolve(!showEvolve)} style={{
            padding: '10px 16px', background: '#ce93d8', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer',
          }}>⭐ 进化</button>
        </div>

        {showFeedChoice && foodItems.length > 0 && (
          <div style={{ background: '#e8f5e9', borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>选择食物：</div>
            {foodItems.map(fi => (
              <button key={fi.id} onClick={() => handleFeedItem(fi.item_id)}
                style={{ display: 'block', width: '100%', padding: '8px 12px', marginBottom: 4, borderRadius: 8,
                  border: '1px solid #c8e6c9', background: '#fff', cursor: 'pointer', textAlign: 'left', fontSize: 13 }}>
                {fi.item?.icon || '🍎'} {fi.item?.name || '食物'} ×{fi.quantity} — 仅加饱食度
              </button>
            ))}
          </div>
        )}

        {showPlayChoice && toyItems.length > 0 && (
          <div style={{ background: '#e3f2fd', borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>选择玩具：</div>
            {toyItems.map(fi => (
              <button key={fi.id} onClick={() => handlePlayItem(fi.item_id)}
                style={{ display: 'block', width: '100%', padding: '8px 12px', marginBottom: 4, borderRadius: 8,
                  border: '1px solid #bbdefb', background: '#fff', cursor: 'pointer', textAlign: 'left', fontSize: 13 }}>
                {fi.item?.icon || '🎮'} {fi.item?.name || '玩具'} ×{fi.quantity} — 仅加快乐值
              </button>
            ))}
          </div>
        )}

        {showEvolve && (
          <div style={{ background: '#f3e5f5', borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>进化目标：</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[{key:'dragon',label:'🐉 龙'},{key:'unicorn',label:'🦄 独角兽'},{key:'fairy',label:'🧚 精灵'},{key:'slime',label:'🟢 史莱姆'}].map(t => (
                <button key={t.key} onClick={() => { onEvolve(t.key); setShowEvolve(false) }}
                  disabled={t.key === pet.type}
                  style={{ padding: '6px 4px', borderRadius: 8, border: t.key === pet.type ? '2px solid #4caf50' : '1px solid #ddd',
                    background: t.key === pet.type ? '#e8f5e9' : '#fff', cursor: t.key === pet.type ? 'default' : 'pointer', fontSize: 11 }}>
                  💎 {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

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
