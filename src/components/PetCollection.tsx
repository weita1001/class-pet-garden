import { getAllTemplates } from '../utils/templates'
import type { PetTemplate } from '../utils/templates'
import { PET_EMOJI } from '../utils/constants'

const TYPE_LABELS: Record<string, string> = {
  cat: '🐱 猫', dog: '🐶 狗', rabbit: '🐰 兔子', hamster: '🐹 仓鼠', chick: '🐤 小鸡',
  pig: '🐷 小猪', dragon: '🐉 龙', unicorn: '🦄 独角兽', fairy: '🧚 精灵', slime: '🟢 史莱姆',
}

const RARITY: Record<string, string> = {
  dragon: '稀有·进化获得', unicorn: '稀有·进化获得', fairy: '稀有·进化获得', slime: '稀有·进化获得',
}

interface Props {
  onSelectTemplate?: (tpl: PetTemplate) => void
}

export default function PetCollection({ onSelectTemplate }: Props) {
  const all = getAllTemplates()
  const grouped: Record<string, PetTemplate[]> = {}
  all.forEach(t => {
    if (!grouped[t.type]) grouped[t.type] = []
    grouped[t.type].push(t)
  })

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 18 }}>📖 宠物图鉴 — 全部 {all.length} 种造型</h3>
      {Object.entries(grouped).map(([type, templates]) => (
        <div key={type} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            {TYPE_LABELS[type] || type} ×{templates.length}
            {RARITY[type] && <span style={{ fontSize: 11, color: '#ce93d8', marginLeft: 6 }}>{RARITY[type]}</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
            {templates.map(tpl => (
              <div key={tpl.path} onClick={() => onSelectTemplate?.(tpl)}
                style={{ textAlign: 'center', cursor: 'pointer', padding: 8, borderRadius: 10,
                  border: '1px solid #e0e0e0', background: '#fff', fontSize: 11 }}>
                <img src={tpl.path} alt={tpl.description} style={{ width: 48, height: 48, imageRendering: 'pixelated', borderRadius: 6 }} />
                <div style={{ color: '#999', fontSize: 10, marginTop: 2, lineHeight: 1.3 }}>{tpl.description}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
