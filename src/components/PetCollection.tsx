import { PET_EMOJI } from '../utils/constants'
import type { Pet } from '../types'

interface Props {
  pets: Pet[]
  onSelect?: (pet: Pet) => void
}

export default function PetCollection({ pets, onSelect }: Props) {
  const typeOrder = ['cat', 'dog', 'rabbit', 'hamster', 'chick', 'pig', 'dragon', 'unicorn', 'fairy', 'slime']
  const grouped: Record<string, Pet[]> = {}
  pets.forEach(p => {
    if (!grouped[p.type]) grouped[p.type] = []
    grouped[p.type].push(p)
  })

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 18 }}>📖 宠物图鉴</h3>
      {typeOrder.map(type => {
        const list = grouped[type]
        if (!list || list.length === 0) return null
        return (
          <div key={type} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              {PET_EMOJI[type]?.adult || '🐾'} {type} × {list.length}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {list.map(pet => (
                <div key={pet.id} onClick={() => onSelect?.(pet)}
                  style={{ width: 60, textAlign: 'center', cursor: 'pointer', padding: 6, borderRadius: 8,
                    border: '1px solid #e0e0e0', background: '#fff', fontSize: 12 }}>
                  <div style={{ fontSize: 24 }}>{PET_EMOJI[pet.type]?.[pet.stage] || '🐣'}</div>
                  <div style={{ color: '#666', marginTop: 2 }}>{pet.student_name}</div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
      {pets.length === 0 && <div style={{ color: '#999', textAlign: 'center', padding: 40 }}>还没有宠物，快去领养吧！</div>}
    </div>
  )
}
