import type { PetWithStudent } from '../types'
import { PET_EMOJI } from '../utils/constants'

function getDesignUrl(pet: PetWithStudent) {
  if (!pet.design) return null
  try { const d = typeof pet.design === 'string' ? JSON.parse(pet.design) : pet.design; return d.image_path || null }
  catch { return null }
}

interface Props {
  pets: PetWithStudent[]
  onSelect?: (pet: PetWithStudent) => void
}

export default function PetCollection({ pets, onSelect }: Props) {
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 18 }}>📖 宠物图鉴 ({pets.length}只)</h3>
      {pets.length === 0 ? (
        <div style={{ color: '#999', textAlign: 'center', padding: 40 }}>还没有宠物，快去领养吧！</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10 }}>
          {pets.map(pet => {
            const url = getDesignUrl(pet)
            return (
              <div key={pet.id} onClick={() => onSelect?.(pet)}
                style={{ textAlign: 'center', cursor: 'pointer', padding: 10, borderRadius: 10,
                  border: '1px solid #e0e0e0', background: '#fff', fontSize: 12 }}>
                {url ? (
                  <img src={url} alt={pet.type} style={{ width: 56, height: 56, imageRendering: 'pixelated', borderRadius: 8 }} />
                ) : (
                  <div style={{ fontSize: 40 }}>{PET_EMOJI[pet.type]?.[pet.stage] || '🐣'}</div>
                )}
                <div style={{ fontWeight: 600, marginTop: 4 }}>{pet.student_name}</div>
                <div style={{ color: '#999', fontSize: 10 }}>{pet.type}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
