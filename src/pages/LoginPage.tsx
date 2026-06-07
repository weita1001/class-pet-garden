import { useState } from 'react'

interface Props {
  onLogin: (email: string, password: string) => Promise<{ error: any }>
}

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await onLogin(email, password)
    if (error) setError(error.message || '登录失败')
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #e8f5e9, #fff3e0, #f3e5f5)',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff', padding: 40, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        width: 360, textAlign: 'center',
      }}>
        <div style={{ fontSize: 48 }}>🐾</div>
        <h2 style={{ margin: '8px 0 4px' }}>班级宠物园</h2>
        <p style={{ color: '#999', fontSize: 13, marginBottom: 24 }}>教师登录</p>

        {error && <div style={{ background: '#fce4ec', color: '#c62828', padding: 8, borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}

        <input type="email" placeholder="邮箱" value={email}
          onChange={e => setEmail(e.target.value)} required
          style={{ width: '100%', padding: 10, marginBottom: 12, border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
        <input type="password" placeholder="密码" value={password}
          onChange={e => setPassword(e.target.value)} required
          style={{ width: '100%', padding: 10, marginBottom: 20, border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
        <button type="submit" disabled={loading} style={{
          width: '100%', padding: 12, background: loading ? '#ccc' : '#4caf50', color: '#fff',
          border: 'none', borderRadius: 8, fontSize: 16, cursor: loading ? 'default' : 'pointer',
        }}>
          {loading ? '登录中...' : '登 录'}
        </button>
      </form>
    </div>
  )
}
