import { useState } from 'react'

interface Props {
  onAddPoints: (studentId: number, points: number) => Promise<void>
  onBatchAddPoints: (studentIds: number[], points: number) => Promise<void>
  onHealAll: () => Promise<void>
  onSickRoll: () => Promise<void>
  students: Array<{ id: number; name: string; points: number }>
}

export default function AdminPanel({ onAddPoints, onBatchAddPoints, onHealAll, onSickRoll, students }: Props) {
  const [points, setPoints] = useState(10)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const toggleStudent = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleBatch = async () => {
    if (selectedIds.length === 0) return
    setLoading(true)
    await onBatchAddPoints(selectedIds, points)
    setSelectedIds([])
    setLoading(false)
  }

  return (
    <div style={{ padding: 16, background: '#1f2937', borderRadius: 12, color: '#f3f4f6', marginBottom: 16 }}>
      <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>🛠 后台管理</h3>

      {/* 批量加分 */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, marginBottom: 6, color: '#9ca3af' }}>批量加分</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>分值:</span>
          <input type="number" value={points} onChange={e => setPoints(Number(e.target.value))}
            style={{ width: 70, padding: '4px 8px', borderRadius: 6, border: '1px solid #4b5563', background: '#374151', color: '#fff', fontSize: 13 }} />
          <button onClick={handleBatch} disabled={loading || selectedIds.length === 0}
            style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: '#4caf50', color: '#fff', cursor: 'pointer', fontSize: 13 }}>
            {loading ? '处理中...' : `给 ${selectedIds.length} 人加分`}
          </button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxHeight: 120, overflowY: 'auto' }}>
          {students.map(s => (
            <label key={s.id} style={{ fontSize: 12, padding: '2px 8px', borderRadius: 12, cursor: 'pointer',
              background: selectedIds.includes(s.id) ? '#4caf50' : '#374151', color: selectedIds.includes(s.id) ? '#fff' : '#9ca3af' }}>
              <input type="checkbox" checked={selectedIds.includes(s.id)} onChange={() => toggleStudent(s.id)}
                style={{ display: 'none' }} />
              {s.name} ({s.points}分)
            </label>
          ))}
        </div>
      </div>

      {/* 快捷操作 */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => onSickRoll()} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#ff9800', color: '#fff', cursor: 'pointer', fontSize: 13 }}>
          🎲 随机生病
        </button>
        <button onClick={() => onHealAll()} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', cursor: 'pointer', fontSize: 13 }}>
          💊 全部治愈
        </button>
      </div>
    </div>
  )
}
