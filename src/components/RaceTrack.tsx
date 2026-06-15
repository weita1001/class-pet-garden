import { useState, useEffect, useRef } from 'react'
import type { PetWithStudent, PetStage } from '../types'
import { PET_EMOJI } from '../utils/constants'

interface Racer {
  pet: PetWithStudent
  position: number
  finished: boolean
  rank: number | null
}

interface Props {
  racers: PetWithStudent[]
  onFinish: (results: { pet: PetWithStudent; rank: number }[]) => void
  onClose: () => void
}

export default function RaceTrack({ racers: inputRacers, onFinish, onClose }: Props) {
  const [racers, setRacers] = useState<Racer[]>(
    inputRacers.map(p => ({ pet: p, position: 0, finished: false, rank: null }))
  )
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const finishCount = useRef(0)
  const animationRef = useRef<number | null>(null)

  const speeds = useRef(inputRacers.map(() => 0.5 + Math.random() * 2))

  const startRace = () => {
    setStarted(true)
    const tick = () => {
      setRacers(prev => {
        const updated = prev.map((r, i) => {
          if (r.finished) return r
          const newPos = r.position + speeds.current[i] * 0.8
          if (newPos >= 85) {
            finishCount.current++
            return { ...r, position: 85, finished: true, rank: finishCount.current }
          }
          return { ...r, position: newPos }
        })
        if (updated.every(r => r.finished)) {
          setFinished(true)
          const results = updated.map(r => ({ pet: r.pet, rank: r.rank! })).sort((a, b) => a.rank - b.rank)
          setTimeout(() => onFinish(results), 1000)
          return updated
        }
        return updated
      })
      if (!finished) animationRef.current = requestAnimationFrame(tick)
    }
    animationRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => { return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current) } }, [])

  const sortedRacers = [...racers].sort((a, b) => {
    if (a.rank && b.rank) return a.rank - b.rank
    if (a.rank) return -1
    if (b.rank) return 1
    return b.position - a.position
  })

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 700, maxWidth: '95vw' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 4px' }}>🏃 宠物赛跑</h2>
        <p style={{ textAlign: 'center', color: '#999', fontSize: 13, marginBottom: 20 }}>
          {started ? (finished ? '🏆 比赛结束！' : '比赛进行中...') : `${racers.length} 只宠物准备就绪`}
        </p>

        <div style={{ position: 'relative', background: '#e8f5e9', borderRadius: 12, padding: '16px 24px', minHeight: inputRacers.length * 50 + 40 }}>
          <div style={{ position: 'absolute', right: 24, top: 16, bottom: 16, width: 4, background: 'repeating-linear-gradient(0deg, #000 0px, #000 8px, #fff 8px, #fff 16px)', zIndex: 2 }} />

          {sortedRacers.map(racer => {
            const emoji = PET_EMOJI[racer.pet.type]?.[racer.pet.stage as PetStage] || '🐾'
            const url = (() => {
              if (!racer.pet.design) return null
              try { const d = typeof racer.pet.design === 'string' ? JSON.parse(racer.pet.design) : racer.pet.design; return d.image_path || null }
              catch { return null }
            })()
            return (
              <div key={racer.pet.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, position: 'relative', height: 40 }}>
                <div style={{ width: 60, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{racer.pet.student_name}</div>
                <div style={{ flex: 1, position: 'relative', height: 30, background: '#f5f5f5', borderRadius: 15 }}>
                  <div style={{ position: 'absolute', left: `${racer.position}%`, top: -5, fontSize: 28, transition: started ? 'none' : 'left 0.3s', zIndex: 1 }}>
                    {url ? <img src={url} alt="" style={{ width: 32, height: 32, imageRendering: 'pixelated' }} /> : emoji}
                  </div>
                </div>
                {racer.rank && (
                  <div style={{ width: 40, fontSize: 20, textAlign: 'center', flexShrink: 0 }}>
                    {racer.rank === 1 ? '🥇' : racer.rank === 2 ? '🥈' : racer.rank === 3 ? '🥉' : `#${racer.rank}`}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {!started && (
            <button onClick={startRace} style={{ padding: '12px 40px', fontSize: 18, background: '#ff5722', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
              🚀 开始赛跑！
            </button>
          )}
          {finished && (
            <button onClick={onClose} style={{ padding: '12px 40px', fontSize: 16, background: '#4caf50', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
              返回农场
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
