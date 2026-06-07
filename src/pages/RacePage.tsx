import { useState } from 'react'
import type { PetWithStudent } from '../types'
import RaceTrack from '../components/RaceTrack'

interface Props {
  pets: PetWithStudent[]
  onBack: () => void
}

export default function RacePage({ pets, onBack }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [racing, setRacing] = useState(false)

  const togglePet = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < 6) next.add(id)
      return next
    })
  }

  const racers = pets.filter(p => selected.has(p.id))

  if (racing) {
    return (
      <RaceTrack racers={racers} onFinish={(results) => { console.log('Race results:', results) }}
        onClose={() => { setRacing(false); setSelected(new Set()) }} />
    )
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 18 }}>← 返回</button>
        <h2 style={{ margin: 0 }}>🏃 宠物赛跑</h2>
      </div>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>选择 3-6 只宠物参赛（已选 {selected.size}/6）</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
        {pets.map(pet => (
          <div key={pet.id} onClick={() => togglePet(pet.id)} style={{
            padding: 12, borderRadius: 12, textAlign: 'center', cursor: 'pointer',
            border: selected.has(pet.id) ? '3px solid #ff5722' : '2px solid #e0e0e0',
            background: selected.has(pet.id) ? '#fff3e0' : '#fff',
            transform: selected.has(pet.id) ? 'scale(1.05)' : 'none', transition: 'all 0.2s',
          }}>
            <div style={{ fontSize: 32 }}>🐾</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{pet.student_name}</div>
            {selected.has(pet.id) && <div style={{ fontSize: 11, color: '#ff5722' }}>✓ 已选</div>}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button onClick={() => setRacing(true)} disabled={selected.size < 2} style={{
          padding: '12px 40px', fontSize: 18, borderRadius: 12,
          background: selected.size >= 2 ? '#ff5722' : '#ccc', color: '#fff',
          border: 'none', cursor: selected.size >= 2 ? 'pointer' : 'default',
        }}>🚀 开始赛跑！（{selected.size} 只参赛）</button>
      </div>
    </div>
  )
}
