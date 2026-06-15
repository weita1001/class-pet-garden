import { useState } from 'react'

interface ShopItem {
  id: string; name: string; icon: string; cost: number; description: string; category: string
}

const SHOP_ITEMS: ShopItem[] = [
  { id: 'food_bread', name: '面包', icon: '🍞', cost: 3, description: '饱食度+10', category: '食物' },
  { id: 'food_cake', name: '蛋糕', icon: '🍰', cost: 8, description: '饱食度+25', category: '食物' },
  { id: 'food_dessert', name: '甜点', icon: '🧁', cost: 5, description: '饱食+15 快乐+5', category: '食物' },
  { id: 'food_feast', name: '超级大餐', icon: '🍖', cost: 15, description: '饱食度+50', category: '食物' },
  { id: 'toy_ball', name: '皮球', icon: '⚽', cost: 5, description: '快乐值+15', category: '玩具' },
  { id: 'toy_yarn', name: '毛线球', icon: '🧶', cost: 6, description: '快乐值+20', category: '玩具' },
  { id: 'toy_bone', name: '骨头玩具', icon: '🦴', cost: 4, description: '快乐值+10', category: '玩具' },
  { id: 'special_heal', name: '治疗药', icon: '💚', cost: 10, description: '治愈生病', category: '药品' },
  { id: 'special_evolve', name: '进化药水', icon: '💊', cost: 30, description: '加速进化', category: '药品' },
]

interface Props {
  studentPoints: number
  studentId: string
  onBuy: (item: ShopItem) => Promise<{ error?: string }>
  onClose: () => void
}

export default function ShopModal({ studentPoints, studentId, onBuy, onClose }: Props) {
  const [buying, setBuying] = useState<string | null>(null)
  const [filter, setFilter] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const items = filter ? SHOP_ITEMS.filter(i => i.category === filter) : SHOP_ITEMS
  const categories = [...new Set(SHOP_ITEMS.map(i => i.category))]

  const handleBuy = async (item: ShopItem) => {
    if (studentPoints < item.cost) {
      setMsg('积分不足！')
      setTimeout(() => setMsg(''), 2000)
      return
    }
    setBuying(item.id)
    const result = await onBuy(item)
    if (result.error) {
      setMsg(result.error)
    } else {
      setMsg(`购买成功：${item.name}！`)
    }
    setBuying(null)
    setTimeout(() => setMsg(''), 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, maxWidth: 500, width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>🏪 宠物商城</h3>
          <span style={{ fontSize: 14, color: '#4caf50', fontWeight: 600 }}>💰 {studentPoints} 积分</span>
        </div>

        {msg && <div style={{ textAlign: 'center', padding: 8, marginBottom: 8, background: msg.includes('成功') ? '#e8f5e9' : '#fce4ec', borderRadius: 8, color: msg.includes('成功') ? '#2e7d32' : '#c62828', fontSize: 13 }}>{msg}</div>}

        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <button onClick={() => setFilter(null)} style={{ padding: '4px 12px', borderRadius: 14, border: 'none', fontSize: 12, cursor: 'pointer', background: filter === null ? '#4caf50' : '#eee', color: filter === null ? '#fff' : '#666' }}>全部</button>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ padding: '4px 12px', borderRadius: 14, border: 'none', fontSize: 12, cursor: 'pointer', background: filter === c ? '#4caf50' : '#eee', color: filter === c ? '#fff' : '#666' }}>{c}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
          {items.map(item => (
            <div key={item.id} style={{ padding: 12, borderRadius: 10, border: '1px solid #e0e0e0', textAlign: 'center' }}>
              <div style={{ fontSize: 32 }}>{item.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, margin: '4px 0' }}>{item.name}</div>
              <div style={{ fontSize: 11, color: '#999', marginBottom: 6 }}>{item.description}</div>
              <button onClick={() => handleBuy(item)} disabled={studentPoints < item.cost || buying !== null}
                style={{ padding: '4px 12px', borderRadius: 6, border: 'none', fontSize: 12, cursor: 'pointer',
                  background: studentPoints >= item.cost ? '#4caf50' : '#ccc', color: '#fff' }}>
                {buying === item.id ? '...' : `💰 ${item.cost}`}
              </button>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={{ marginTop: 12, width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14 }}>
          关闭
        </button>
      </div>
    </div>
  )
}
