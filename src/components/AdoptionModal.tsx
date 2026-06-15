import { useState } from 'react'
import { getAllTemplates, randomTemplateAvoidDup } from '../utils/templates'

const COMMON_TYPES = ['cat', 'dog', 'rabbit', 'hamster', 'chick', 'pig']

interface Props {
  usedPaths: string[]
  onAdopt: (type: string, design: string) => void
  onClose: () => void
}

export default function AdoptionModal({ usedPaths, onAdopt, onClose }: Props) {
  const [mode, setMode] = useState<'choose' | 'hatching' | 'result'>('choose')
  const [selected, setSelected] = useState<{ type: string; path: string } | null>(null)

  const allTemplates = getAllTemplates()
  const commonTemplates = allTemplates.filter(t => COMMON_TYPES.includes(t.type))

  const handleRandomHatch = () => {
    setMode('hatching')
    setTimeout(() => {
      const tpl = randomTemplateAvoidDup('any', usedPaths)
      if (tpl) {
        setSelected(tpl)
        setMode('result')
      } else {
        // 所有造型都用过了，随机选一个
        const fallback = commonTemplates[Math.floor(Math.random() * commonTemplates.length)]
        setSelected(fallback)
        setMode('result')
      }
    }, 1500)
  }

  const handleConfirm = () => {
    if (!selected) return
    onAdopt(selected.type, selected.path)
    onClose()
  }

  if (mode === 'hatching') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 60 }}>🥚</div>
          <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }`}</style>
          <div style={{ fontSize: 18, fontWeight: 600, marginTop: 16 }}>孵化中...</div>
        </div>
      </div>
    )
  }

  if (mode === 'result' && selected) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 32, textAlign: 'center', maxWidth: 360 }}>
          <div style={{ fontSize: 48 }}>🎉</div>
          <img src={selected.path} alt="" style={{ width: 80, height: 80, imageRendering: 'pixelated', borderRadius: 12, margin: '12px 0' }} />
          <div style={{ fontSize: 14, color: '#666' }}>种类: <strong>{selected.type}</strong></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'center' }}>
            <button onClick={() => { setMode('choose'); setSelected(null) }} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14 }}>重来</button>
            <button onClick={handleConfirm} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#4caf50', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>确认领养</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, maxWidth: 500, width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>🐣 领养宠物</h3>
        <p style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>
          随机孵化（普通种类）：猫 · 狗 · 兔子 · 仓鼠 · 小鸡 · 小猪<br/>
          <span style={{ color: '#ce93d8' }}>龙 · 独角兽 · 精灵 · 史莱姆 只能通过进化获得</span>
        </p>

        <button onClick={handleRandomHatch} style={{
          width: '100%', padding: 16, background: 'linear-gradient(135deg, #ff9800, #f44336)', color: '#fff',
          border: 'none', borderRadius: 12, fontSize: 18, fontWeight: 600, cursor: 'pointer', marginBottom: 16,
        }}>🥚 随机孵化</button>

        <div style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>可孵化种类（{commonTemplates.length}种造型）：</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {COMMON_TYPES.map(type => {
            const tpls = commonTemplates.filter(t => t.type === type)
            const unused = tpls.filter(t => !usedPaths.includes(t.path))
            return (
              <div key={type} style={{ padding: 8, borderRadius: 8, background: unused.length > 0 ? '#e8f5e9' : '#f5f5f5', textAlign: 'center', fontSize: 12 }}>
                {tpls[0] && <img src={tpls[0].path} alt="" style={{ width: 32, height: 32, imageRendering: 'pixelated' }} />}
                <div>{type}</div>
                <div style={{ fontSize: 10, color: unused.length > 0 ? '#4caf50' : '#999' }}>剩{unused.length}种</div>
              </div>
            )
          })}
        </div>

        <button onClick={onClose} style={{ marginTop: 16, width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14 }}>关闭</button>
      </div>
    </div>
  )
}
