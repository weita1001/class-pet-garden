import { useState } from 'react'
import type { Class } from '../types'

interface Props {
  classes: Class[]
  activeId: string | null
  onSelect: (id: string) => void
  onCreate: (name: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
}

export default function ClassSwitcher({ classes, activeId, onSelect, onCreate, onDelete, onRename }: Props) {
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleCreate = () => {
    if (newName.trim()) { onCreate(newName.trim()); setNewName('') }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#fafafa', flexWrap: 'wrap' }}>
      <span style={{ fontWeight: 600, fontSize: 14 }}>🏫 班级：</span>
      {classes.map(c => (
        editingId === c.id ? (
          <form key={c.id} onSubmit={e => { e.preventDefault(); onRename(c.id, editName); setEditingId(null) }} style={{ display: 'inline-flex', gap: 4 }}>
            <input value={editName} onChange={e => setEditName(e.target.value)} autoFocus
              style={{ width: 80, padding: '2px 6px', fontSize: 13, border: '1px solid #ccc', borderRadius: 4 }} />
            <button type="submit" style={{ fontSize: 11, cursor: 'pointer' }}>✓</button>
          </form>
        ) : (
          <div key={c.id} style={{
            padding: '4px 12px', borderRadius: 20, fontSize: 13, cursor: 'pointer',
            background: activeId === c.id ? '#4caf50' : '#fff',
            color: activeId === c.id ? '#fff' : '#333', border: activeId === c.id ? 'none' : '1px solid #ddd',
          }}>
            <span onClick={() => onSelect(c.id)}>{c.name}</span>
            <span style={{ marginLeft: 6, fontSize: 10, color: '#999', cursor: 'pointer' }}
              onClick={() => { setEditingId(c.id); setEditName(c.name) }}>✎</span>
            <span style={{ marginLeft: 4, fontSize: 10, color: '#f44336', cursor: 'pointer' }}
              onClick={() => { if (confirm('删除班级？')) onDelete(c.id) }}>✕</span>
          </div>
        )
      ))}
      <form onSubmit={e => { e.preventDefault(); handleCreate() }} style={{ display: 'inline-flex', gap: 4 }}>
        <input placeholder="新建班级" value={newName} onChange={e => setNewName(e.target.value)}
          style={{ width: 80, padding: '4px 8px', fontSize: 13, border: '1px dashed #ccc', borderRadius: 8 }} />
        <button type="submit" style={{ fontSize: 13, background: '#4caf50', color: '#fff', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>+</button>
      </form>
    </div>
  )
}
