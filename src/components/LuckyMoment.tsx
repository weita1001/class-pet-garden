import { useState } from 'react'
import type { PetWithStudent } from '../types'
import { RANDOM_EVENTS } from '../utils/constants'

interface Props {
  pets: PetWithStudent[]
  onEvent: (petId: string, event: typeof RANDOM_EVENTS[number]) => void
  onClose: () => void
}

export default function LuckyMoment({ pets, onEvent, onClose }: Props) {
  const [spinning, setSpinning] = useState(false)
  const [selected, setSelected] = useState<{ pet: PetWithStudent; event: typeof RANDOM_EVENTS[number] } | null>(null)

  const trigger = () => {
    if (pets.length === 0) return
    setSpinning(true)
    setSelected(null)
    const spinDuration = 2000 + Math.random() * 1000
    setTimeout(() => {
      const randomPet = pets[Math.floor(Math.random() * pets.length)]
      const randomEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]
      setSelected({ pet: randomPet, event: randomEvent })
      setSpinning(false)
      onEvent(randomPet.id, randomEvent)
    }, spinDuration)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 115 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 420, textAlign: 'center' }}>
        <h2>🎲 幸运时刻</h2>
        <p style={{ color: '#999', fontSize: 14 }}>
          {pets.length === 0 ? '当前班级没有宠物！' : `从 ${pets.length} 只宠物中随机抽取...`}
        </p>

        {spinning && (
          <div style={{ padding: 32 }}>
            <div style={{ fontSize: 64, animation: 'spin 0.2s linear infinite' }}>🎰</div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: '#999', marginTop: 12 }}>正在选择...</p>
          </div>
        )}

        {selected && (
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 24, fontWeight: 600 }}>🎉 {selected.pet.student_name} 的宠物！</div>
            <div style={{ fontSize: 56, margin: '8px 0' }}>{selected.event.icon}</div>
            <h3>{selected.event.title}</h3>
            <p style={{ color: '#666', fontSize: 13 }}>{selected.event.desc}</p>
          </div>
        )}

        {!spinning && !selected && (
          <button onClick={trigger} style={{
            padding: '16px 48px', fontSize: 20, background: '#9c27b0', color: '#fff',
            border: 'none', borderRadius: 16, cursor: 'pointer', margin: '20px 0',
          }}>✨ 触发幸运时刻</button>
        )}

        <button onClick={onClose} style={{ marginTop: 16, padding: '8px 24px', background: 'transparent', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer' }}>关闭</button>
      </div>
    </div>
  )
}
