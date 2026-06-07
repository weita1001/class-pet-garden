import type { PetWithStudent, PetStage } from '../types'
import { PET_EMOJI, EMOTION_EMOJI, STAGE_LABEL } from '../utils/constants'
import { computeEmotion } from '../utils/petLogic'

interface Props {
  pet: PetWithStudent
  onClick: () => void
}

export default function PetCard({ pet, onClick }: Props) {
  const emotion = computeEmotion(pet.hunger, pet.happiness, pet.last_fed_at)
  const emoji = PET_EMOJI[pet.type]?.[pet.stage as PetStage] || '🐾'
  const isEgg = pet.stage === 'egg'

  return (
    <div onClick={onClick} style={{
      background: '#fff', borderRadius: 12, padding: 12, textAlign: 'center',
      cursor: 'pointer', border: `2px solid ${isEgg ? '#ff9800' : '#e0e0e0'}`,
      transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 36, lineHeight: 1.2 }}>{emoji}</div>
      <div style={{ fontSize: 20 }}>{EMOTION_EMOJI[emotion] || '😐'}</div>
      <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{pet.student_name}</div>
      <div style={{ fontSize: 10, color: '#999' }}>{STAGE_LABEL[pet.stage]}</div>
    </div>
  )
}
