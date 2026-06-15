import { useState, useEffect } from 'react'
import type { PetWithStudent, PetStage } from '../types'
import { PET_EMOJI } from '../utils/constants'
import { computeEmotion, getEffectiveStats } from '../utils/petLogic'

interface Props {
  pet: PetWithStudent
  onClick: () => void
}

export default function PetCard({ pet, onClick }: Props) {
  const [stats, setStats] = useState({ hunger: pet.hunger, happiness: pet.happiness })

  useEffect(() => {
    const update = () => {
      const s = getEffectiveStats({ hunger: pet.hunger, happiness: pet.happiness, last_fed_at: pet.last_fed_at })
      setStats(s)
    }
    update()
    const interval = setInterval(update, 30000)
    return () => clearInterval(interval)
  }, [pet.hunger, pet.happiness, pet.last_fed_at])

  const isEgg = pet.stage === 'egg'
  const designUrl = (() => {
    if (!pet.design) return null
    try {
      const d = typeof pet.design === 'string' ? JSON.parse(pet.design) : pet.design
      return d.image_path || null
    } catch { return null }
  })()

  return (
    <div onClick={onClick} style={{
      background: '#fff', borderRadius: 12, padding: 12, textAlign: 'center',
      cursor: 'pointer', border: `2px solid ${isEgg ? '#ff9800' : '#e0e0e0'}`,
      transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)' }}>
      {designUrl ? (
        <img src={designUrl} alt={pet.type} style={{ width: 64, height: 64, imageRendering: 'pixelated', borderRadius: 8 }} />
      ) : (
        <div style={{ fontSize: 36, lineHeight: 1.2 }}>{PET_EMOJI[pet.type]?.[pet.stage as PetStage] || '🐾'}</div>
      )}
      <div style={{ marginTop: 4 }}>
        <div style={{ height: 4, background: '#eee', borderRadius: 2, marginBottom: 2 }}>
          <div style={{ height: 4, width: `${stats.hunger}%`, background: stats.hunger < 30 ? '#f44336' : '#4caf50', borderRadius: 2, transition: 'width 0.5s' }} />
        </div>
        <div style={{ height: 4, background: '#eee', borderRadius: 2 }}>
          <div style={{ height: 4, width: `${stats.happiness}%`, background: '#ff9800', borderRadius: 2, transition: 'width 0.5s' }} />
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{pet.student_name}</div>
      <div style={{ fontSize: 10, color: '#999' }}>⭐{pet.student_points}</div>
    </div>
  )
}
