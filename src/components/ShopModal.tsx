import { useState } from 'react'

interface ShopItem {
  id: number; name: string; icon: string; cost: number; description: string
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 1, name: '🍎 苹果', icon: '🍎', cost: 5, description: '喂宠物 +10 饱食度' },
  { id: 2, name: '🍰 蛋糕', icon: '🍰', cost: 10, description: '喂宠物 +20 饱食度' },
  { id: 3, name: '🎮 玩具', icon: '🎮', cost: 8, description: '陪宠物玩 +15 快乐值' },
  { id: 4, name: '💊 药水', icon: '💊', cost: 15, description: '治愈生病' },
  { id: 5, name: '⭐ 进化石', icon: '⭐', cost: 30, description: '加速进化' },
  { id: 6, name: '🍀 幸运草', icon: '🍀', cost: 20, description: '增加快乐 +25' },
]

interface Props {
  studentPoints: number
  onBuy: (itemId: number) => Promise<{ error?: string }>
  onClose: () => void
}

export default function ShopModal({ studentPoints, onBuy, onClose }: Props) {
  const [buying, setBuying] = useState<number | null>(null)

  const handleBuy = async (item: ShopItem) => {
    if (studentPoints < item.cost) return
    setBuying(item.id)
    await onBuy(item.id)
    setBuying(null)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 480, width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>🏪 积分商店</h3>
          <span style={{ fontSize: 14, color: '#4caf50', fontWeight: 600 }}>💰 {studentPoints} 积分</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
          {SHOP_ITEMS.map(item => (
            <div key={item.id} style={{ padding: 12, borderRadius: 10, border: '1px solid #e0e0e0', textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, margin: '4px 0' }}>{item.name}</div>
              <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>{item.description}</div>
              <button onClick={() => handleBuy(item)} disabled={studentPoints < item.cost || buying !== null}
                style={{ padding: '4px 12px', borderRadius: 6, border: 'none', fontSize: 13, cursor: 'pointer',
                  background: studentPoints >= item.cost ? '#4caf50' : '#ccc', color: '#fff' }}>
                {buying === item.id ? '...' : `💰 ${item.cost}`}
              </button>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{ marginTop: 16, width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14 }}>
          关闭
        </button>
      </div>
    </div>
  )
}
