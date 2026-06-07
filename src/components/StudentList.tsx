import { useState } from 'react'
import type { Student } from '../types'

interface Props {
  students: Student[]
  loading: boolean
  onAdd: (name: string) => void
  onBatchAdd: (names: string[]) => void
  onDelete: (id: string) => void
}

export default function StudentList({ students, loading, onAdd, onBatchAdd, onDelete }: Props) {
  const [name, setName] = useState('')
  const [batchText, setBatchText] = useState('')
  const [showBatch, setShowBatch] = useState(false)

  const handleAdd = () => { if (name.trim()) { onAdd(name.trim()); setName('') } }

  const handleBatch = () => {
    const names = batchText.split(/[\n,，、]/).map(s => s.trim()).filter(Boolean)
    if (names.length > 0) { onBatchAdd(names); setBatchText(''); setShowBatch(false) }
  }

  if (loading) return <div style={{ padding: 16, color: '#999' }}>加载中...</div>

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <input placeholder="学生姓名" value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
        <button onClick={handleAdd} style={{ padding: '6px 16px', background: '#2196f3', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>添加</button>
        <button onClick={() => setShowBatch(!showBatch)} style={{ padding: '6px 12px', background: '#fff', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
          📋 批量导入
        </button>
      </div>
      {showBatch && (
        <div style={{ marginBottom: 12 }}>
          <textarea value={batchText} onChange={e => setBatchText(e.target.value)}
            placeholder="每行一个名字，或用逗号、顿号分隔&#10;例如：&#10;张三&#10;李四,王五、赵六"
            rows={5} style={{ width: '100%', maxWidth: 400, padding: 8, border: '1px solid #ddd', borderRadius: 8, fontSize: 13 }} />
          <button onClick={handleBatch} style={{ marginTop: 8, padding: '6px 16px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            导入 {batchText.split(/[\n,，、]/).filter(Boolean).length} 名学生
          </button>
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {students.map(s => (
          <div key={s.id} style={{ padding: '6px 12px', background: '#f5f5f5', borderRadius: 20, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            {s.name}
            <span style={{ color: '#ff9800', fontWeight: 600 }}>⭐{s.points}</span>
            <span style={{ cursor: 'pointer', color: '#ccc', fontSize: 14 }} onClick={() => onDelete(s.id)}>✕</span>
          </div>
        ))}
        {students.length === 0 && <span style={{ color: '#999', fontSize: 13 }}>暂无学生，请添加</span>}
      </div>
    </div>
  )
}
