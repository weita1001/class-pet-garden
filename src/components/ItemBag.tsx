import { useState, useEffect } from 'react'
import { getInventory, useItem } from '../services/db'
import type { InventorySlot, Item } from '../types'

interface Props {
  studentId: string
  studentName: string
  onClose: () => void
  onUseItem: (item: Item) => void
}

export default function ItemBag({ studentId, studentName, onClose, onUseItem }: Props) {
  const [slots, setSlots] = useState<(InventorySlot & { item: Item })[]>([])
  const [loading, setLoading] = useState(true)

  const loadSlots = async () => {
    const { data } = await getInventory(studentId)
    setSlots(data || [])
    setLoading(false)
  }

  useEffect(() => { loadSlots() }, [studentId])

  const handleUse = async (slot: InventorySlot & { item: Item }) => {
    if (slot.item.category === 'decoration') {
      onUseItem(slot.item); onClose(); return
    }
    if (slot.item.category === 'food') {
      onUseItem(slot.item)
      await useItem(slot.id, slot.quantity - 1)
      loadSlots(); return
    }
    if (slot.item.category === 'special') {
      onUseItem(slot.item)
      await useItem(slot.id, slot.quantity - 1)
      loadSlots(); onClose(); return
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 105 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: 380, maxHeight: '80vh', overflow: 'auto' }}>
        <h3>🎒 {studentName} 的背包</h3>
        {loading ? <p style={{ color: '#999' }}>加载中...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
            {slots.map(slot => (
              <div key={slot.id} onClick={() => handleUse(slot)} style={{
                padding: 8, borderRadius: 8, border: '1px solid #e0e0e0', textAlign: 'center', cursor: 'pointer', background: '#fafafa',
              }}>
                <div style={{ fontSize: 28 }}>{slot.item.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600 }}>{slot.item.name}</div>
                <div style={{ fontSize: 10, color: '#999' }}>×{slot.quantity}</div>
                <div style={{ fontSize: 9, color: '#2196f3' }}>点击使用</div>
              </div>
            ))}
            {slots.length === 0 && <p style={{ color: '#999', gridColumn: '1/-1', textAlign: 'center' }}>背包空空如也~</p>}
          </div>
        )}
        <button onClick={onClose} style={{ marginTop: 16, width: '100%', padding: 8, background: 'transparent', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer' }}>关闭</button>
      </div>
    </div>
  )
}
