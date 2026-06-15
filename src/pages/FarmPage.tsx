import { useState, useEffect } from 'react'
import { useClasses } from '../hooks/useClasses'
import { useStudents } from '../hooks/useStudents'
import { usePets } from '../hooks/usePets'
import { useLottery } from '../hooks/useItems'
import { updateStudentPoints } from '../services/db'
import ClassSwitcher from '../components/ClassSwitcher'
import StudentList from '../components/StudentList'
import PetCard from '../components/PetCard'
import PetDetail from '../components/PetDetail'
import AdoptionModal from '../components/AdoptionModal'
import LotteryWheel from '../components/LotteryWheel'
import ItemBag from '../components/ItemBag'
import LuckyMoment from '../components/LuckyMoment'
import RacePage from './RacePage'
import AdminPanel from '../components/AdminPanel'
import PetCollection from '../components/PetCollection'
import ShopModal from '../components/ShopModal'
import type { PetWithStudent, PetType, Personality } from '../types'

export default function FarmPage() {
  const { classes, loading: classesLoading, add: addClass, remove: removeClass, rename: renameClass } = useClasses()
  const { students, loading: studentsLoading, load: loadStudents, addOne, batch, remove: removeStudent } = useStudents()
  const { pets, loading: petsLoading, load: loadPets, adopt, feed } = usePets()
  const { draw, resetResult } = useLottery()

  const [activeClassId, setActiveClassId] = useState<string | null>(null)
  const [selectedPet, setSelectedPet] = useState<PetWithStudent | null>(null)
  const [adoptingFor, setAdoptingFor] = useState<string | null>(null)
  const [lotteryStudentId, setLotteryStudentId] = useState<string | null>(null)
  const [bagStudentId, setBagStudentId] = useState<string | null>(null)
  const [showStudents, setShowStudents] = useState(false)
  const [showLucky, setShowLucky] = useState(false)
  const [showRace, setShowRace] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showCollection, setShowCollection] = useState(false)
  const [showShop, setShowShop] = useState(false)

  useEffect(() => {
    if (!classesLoading && classes.length > 0 && !activeClassId) {
      setActiveClassId(classes[0].id)
    }
  }, [classes, classesLoading, activeClassId])

  useEffect(() => {
    if (activeClassId) {
      loadStudents(activeClassId)
      loadPets(activeClassId)
    }
  }, [activeClassId, loadStudents, loadPets])

  const handleFeed = async () => {
    if (!selectedPet) return { error: new Error('no pet'), evolved: false }
    return feed(selectedPet).then(r => {
      if (activeClassId) loadPets(activeClassId)
      return r
    })
  }

  const handleAdopt = async (type: string, design: string) => {
    if (!adoptingFor || !activeClassId) return
    await adopt(adoptingFor, type as PetType, 'active', design)
    setAdoptingFor(null)
    loadPets(activeClassId)
  }

  const handleAddPoints = async (amount: number) => {
    if (!selectedPet) return
    await updateStudentPoints(selectedPet.student_id, amount, '课堂奖励')
    if (activeClassId) {
      loadStudents(activeClassId)
      loadPets(activeClassId)
    }
  }

  const refreshAll = () => {
    if (activeClassId) {
      loadStudents(activeClassId)
      loadPets(activeClassId)
    }
  }

  const handleLuckyEvent = (petId: string, event: { effect: string }) => {
    if (event.effect === 'birthday_bonus') {
      updateStudentPoints(petId, 3, '宠物生日庆祝')
    }
    refreshAll()
  }

  const studentsWithoutPets = students.filter(s => !pets.find(p => p.student_id === s.id))

  if (showRace) {
    return <RacePage pets={pets} onBack={() => setShowRace(false)} />
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 1200, margin: '0 auto' }}>
      <ClassSwitcher classes={classes} activeId={activeClassId} onSelect={setActiveClassId}
        onCreate={addClass} onDelete={removeClass} onRename={renameClass} />

      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>🏫 宠物农场</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowStudents(!showStudents)} style={{
              padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', fontSize: 13,
            }}>{showStudents ? '隐藏学生' : '📋 管理学生'}</button>
            <button onClick={() => setShowLucky(true)} style={{
              padding: '8px 16px', background: '#9c27b0', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13,
            }}>🎲 幸运时刻</button>
            <button onClick={() => setShowRace(true)} disabled={pets.length < 2} style={{
              padding: '8px 16px', background: pets.length >= 2 ? '#ff5722' : '#ccc', color: '#fff', border: 'none', borderRadius: 8,
              cursor: pets.length >= 2 ? 'pointer' : 'default', fontSize: 13,
            }}>🏃 宠物赛跑</button>
            <button onClick={() => setShowAdmin(!showAdmin)} style={{
              padding: '8px 16px', background: showAdmin ? '#1f2937' : '#fff', color: showAdmin ? '#fff' : '#333', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', fontSize: 13,
            }}>🛠 后台</button>
            <button onClick={() => setShowCollection(!showCollection)} style={{
              padding: '8px 16px', background: showCollection ? '#2196f3' : '#fff', color: showCollection ? '#fff' : '#333', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', fontSize: 13,
            }}>📖 图鉴</button>
          </div>
        </div>

        {showStudents && activeClassId && (
          <StudentList students={students} loading={studentsLoading}
            onAdd={name => addOne(activeClassId, name)}
            onBatchAdd={names => batch(activeClassId, names)}
            onDelete={id => { removeStudent(activeClassId, id); loadPets(activeClassId) }} />
        )}
        {showAdmin && (
          <AdminPanel
            students={students}
            onAddPoints={async (id, pts) => { await updateStudentPoints(id, pts, '后台加分'); refreshAll() }}
            onBatchAddPoints={async (ids, pts) => { await Promise.all(ids.map(id => updateStudentPoints(id, pts, '批量加分'))); refreshAll() }}
            onHealAll={async () => { alert('治愈功能: 已触发'); refreshAll() }}
            onSickRoll={async () => { alert('随机生病已触发'); refreshAll() }}
          />
        )}
        {showCollection && (
          <PetCollection />
        )}

        {studentsWithoutPets.length > 0 && (
          <div style={{ marginBottom: 20, padding: 12, background: '#fff8e1', borderRadius: 10 }}>
            <span style={{ fontSize: 13, color: '#666' }}>未领养的学生：</span>
            {studentsWithoutPets.map(s => (
              <span key={s.id} onClick={() => setAdoptingFor(s.id)} style={{
                display: 'inline-block', margin: '4px 6px', padding: '4px 12px',
                background: '#fff', border: '1px dashed #ff9800', borderRadius: 20,
                fontSize: 12, cursor: 'pointer', color: '#ff9800',
              }}>🥚 {s.name} — 点击领养</span>
            ))}
          </div>
        )}

        {petsLoading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>加载宠物中...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
            {pets.map(pet => (
              <PetCard key={pet.id} pet={pet} onClick={() => setSelectedPet(pet)} />
            ))}
            {pets.length === 0 && studentsWithoutPets.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: '#999' }}>请先添加学生，然后领养宠物</div>
            )}
          </div>
        )}
      </div>

      {selectedPet && (
        <PetDetail pet={selectedPet} onFeed={handleFeed} onAddPoints={handleAddPoints}
          onLottery={() => setLotteryStudentId(selectedPet.student_id)}
          onBag={() => setBagStudentId(selectedPet.student_id)}
          onShop={() => setShowShop(true)}
          onClose={() => setSelectedPet(null)} />
      )}

      {adoptingFor && (
        <AdoptionModal
          usedPaths={pets.map(p => {
            try { return JSON.parse(p.design || '{}').image_path || '' } catch { return '' }
          }).filter(Boolean)}
          onAdopt={handleAdopt} onClose={() => setAdoptingFor(null)} />
      )}

      {lotteryStudentId && (
        <LotteryWheel
          studentName={students.find(s => s.id === lotteryStudentId)?.name || ''}
          studentPoints={students.find(s => s.id === lotteryStudentId)?.points || 0}
          onDraw={async (tier) => { const result = await draw(lotteryStudentId, tier); refreshAll(); return result }}
          onClose={() => { setLotteryStudentId(null); resetResult() }} />
      )}

      {bagStudentId && (
        <ItemBag studentId={bagStudentId}
          studentName={students.find(s => s.id === bagStudentId)?.name || ''}
          onClose={() => setBagStudentId(null)}
          onUseItem={(item) => { if (item.category === 'food') handleFeed(); refreshAll() }} />
      )}

      {showShop && selectedPet && (
        <ShopModal
          studentId={selectedPet.student_id}
          studentPoints={students.find(s => s.id === selectedPet.student_id)?.points || 0}
          onBuy={async (item) => { refreshAll(); return {} }}
          onClose={() => setShowShop(false)}
        />
      )}

      {showLucky && (
        <LuckyMoment pets={pets} onEvent={handleLuckyEvent} onClose={() => setShowLucky(false)} />
      )}
    </div>
  )
}
