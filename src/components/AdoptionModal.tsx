import { useState } from 'react'
import type { PetType, Personality } from '../types'
import { PET_TYPE_POOL, PERSONALITY_EMOJI, PERSONALITY_LABEL, EGG_RARITY_LABEL, EGG_COLORS } from '../utils/constants'

const PERSONALITIES: Personality[] = ['active', 'lazy', 'foodie', 'shy']

interface Props {
  studentName: string
  onAdopt: (type: PetType, personality: Personality) => void
  onClose: () => void
}

export default function AdoptionModal({ studentName, onAdopt, onClose }: Props) {
  const [selectedEgg, setSelectedEgg] = useState<number | null>(null)
  const [hatching, setHatching] = useState(false)
  const [result, setResult] = useState<{ type: PetType; personality: Personality } | null>(null)

  const EGG_OPTIONS = [1, 2, 3]

  const handleHatch = () => {
    if (selectedEgg === null) return
    setHatching(true)
    const rarity = selectedEgg + 1
    const pool = PET_TYPE_POOL.filter(p => p.rarity <= rarity)
    const petType = pool[Math.floor(Math.random() * pool.length)].type
    const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)]
    setTimeout(() => setResult({ type: petType, personality }), 1500)
  }

  const handleConfirm = () => {
    if (result) onAdopt(result.type, result.personality)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 420, textAlign: 'center' }}>
        {!hatching && (
          <>
            <h2 style={{ margin: '0 0 4px' }}>🥚 领养宠物</h2>
            <p style={{ color: '#666', fontSize: 14 }}>为 <strong>{studentName}</strong> 选择一个蛋</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '24px 0' }}>
              {EGG_OPTIONS.map((rarity) => (
                <div key={rarity} onClick={() => setSelectedEgg(rarity - 1)} style={{
                  padding: 16, borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                  border: selectedEgg === rarity - 1 ? `3px solid ${EGG_COLORS[rarity]}` : '2px solid #e0e0e0',
                  background: selectedEgg === rarity - 1 ? '#fafafa' : '#fff',
                  transform: selectedEgg === rarity - 1 ? 'scale(1.05)' : 'none', transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: 40, filter: `hue-rotate(${(rarity - 1) * 30}deg)` }}>🥚</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>{EGG_RARITY_LABEL[rarity]}</div>
                </div>
              ))}
            </div>
            <button onClick={handleHatch} disabled={selectedEgg === null} style={{
              padding: '10px 32px', fontSize: 16, borderRadius: 12,
              background: selectedEgg !== null ? '#ff9800' : '#ccc', color: '#fff',
              border: 'none', cursor: selectedEgg !== null ? 'pointer' : 'default',
            }}>✨ 孵化！</button>
            <button onClick={onClose} style={{ marginLeft: 12, padding: '10px 24px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#999' }}>取消</button>
          </>
        )}
        {hatching && !result && (
          <div>
            <h2>孵化中...</h2>
            <div style={{ fontSize: 64, animation: 'bounce 0.5s infinite alternate' }}>🥚</div>
            <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }`}</style>
            <p style={{ color: '#999' }}>蛋在晃动...</p>
          </div>
        )}
        {result && (
          <div>
            <h2>🎉 孵化成功！</h2>
            <div style={{ fontSize: 64 }}>🐣</div>
            <p style={{ fontSize: 18, fontWeight: 600 }}>
              {studentName} 获得了<br />
              一只 <strong>{PERSONALITY_EMOJI[result.personality]} {PERSONALITY_LABEL[result.personality]}</strong> 型宠物！
            </p>
            <button onClick={handleConfirm} style={{
              padding: '10px 32px', fontSize: 16, borderRadius: 12, background: '#4caf50', color: '#fff',
              border: 'none', cursor: 'pointer', marginRight: 12,
            }}>确认领养</button>
            <button onClick={onClose} style={{ padding: '10px 24px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#999' }}>关闭</button>
          </div>
        )}
      </div>
    </div>
  )
}
