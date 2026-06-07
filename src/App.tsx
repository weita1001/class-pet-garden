import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import FarmPage from './pages/FarmPage'

function App() {
  const { session, loading, login, logout } = useAuth()

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'system-ui' }}>加载中...</div>
  }

  if (!session) {
    return <LoginPage onLogin={login} />
  }

  return (
    <div>
      <div style={{ padding: '8px 16px', background: '#f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
        <span>🐾 班级宠物园</span>
        <button onClick={logout} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999' }}>退出</button>
      </div>
      <FarmPage />
    </div>
  )
}

export default App
