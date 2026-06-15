import { useState, useEffect, useRef } from 'react'
import AnimatedCharacters from '../components/AnimatedCharacters'

const STORAGE_KEY = 'pet_garden_remember'

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      return { email: data.email || '', password: data.password || '', remember: true }
    }
  } catch {}
  return { email: '', password: '', remember: false }
}

interface Props {
  onLogin: (email: string, password: string) => Promise<{ error: any }>
}

export default function LoginPage({ onLogin }: Props) {
  const saved = loadSaved()
  const [email, setEmail] = useState(saved.email)
  const [password, setPassword] = useState(saved.password)
  const [remember, setRemember] = useState(saved.remember)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [pwdFocused, setPwdFocused] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onClick = () => {
      if (emailRef.current && document.activeElement !== emailRef.current) {
        setIsTyping(false)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await onLogin(email, password)
    if (error) {
      setError(error.message || '登录失败')
      setLoading(false)
      return
    }
    if (remember) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #f0fdf4 30%, #fff7ed 60%, #fdf2f8 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif', padding: 20,
    }}>
      <div style={{
        display: 'flex', background: '#fff', borderRadius: 20, overflow: 'hidden',
        width: 1200, maxWidth: '98vw', minHeight: 700,
        boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      }}>
        {/* 左侧角色 */}
        <div style={{
          flex: '0 0 580px',
          background: 'linear-gradient(180deg, #d1d5db 0%, #9ca3af 50%, #6b7280 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: '48px 24px 28px', position: 'relative', overflow: 'hidden', color: '#fff',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 700, zIndex: 2 }}>
            <span style={{ fontSize: 28 }}>🐾</span> 班级宠物园
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 2 }}>
            <AnimatedCharacters isTyping={isTyping} showPassword={showPwd} passwordLength={password.length} passwordFocused={pwdFocused} />
          </div>
          <div style={{ zIndex: 2 }} />
        </div>

        {/* 右侧表单 */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 52px', minWidth: 360 }}>
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 420 }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1a1a2e', marginBottom: 6 }}>班级宠物园</h1>
            <p style={{ color: '#9ca3af', fontSize: 15, marginBottom: 36 }}>教师登录 · 四个小家伙在偷看你输入呢</p>
            {error && <div style={{ background: '#fce4ec', color: '#c62828', padding: 10, borderRadius: 10, marginBottom: 20, fontSize: 13 }}>{error}</div>}
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>邮箱</label>
            <input ref={emailRef} type="email" placeholder="teacher@school.com" value={email}
              onChange={e => setEmail(e.target.value)} onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)}
              required autoComplete="off"
              style={{ width: '100%', padding: '16px 18px', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 16, outline: 'none', marginBottom: 24, boxSizing: 'border-box', fontFamily: 'inherit' }} />
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>密码</label>
            <div style={{ position: 'relative', marginBottom: 8 }}>
              <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} onFocus={() => setPwdFocused(true)} onBlur={() => setPwdFocused(false)}
                required autoComplete="off"
                style={{ width: '100%', padding: '16px 48px 16px 18px', border: '2px solid #e5e7eb', borderRadius: 12, fontSize: 16, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, opacity: 0.4, padding: 4 }}>
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, marginTop: 12, cursor: 'pointer', fontSize: 13, color: '#888' }}>
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} style={{ width: 15, height: 15, accentColor: '#4caf50', cursor: 'pointer' }} />
              记住密码
            </label>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: 18, background: loading ? '#ccc' : '#4caf50', color: '#fff', border: 'none', borderRadius: 12, fontSize: 17, fontWeight: 600, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', marginTop: 28 }}>
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
