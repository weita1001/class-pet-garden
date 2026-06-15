import { supabase } from '../lib/supabase'
import type { Class, Student, Pet, PetWithStudent, Item, InventorySlot, PointsLog, LotteryPoolEntry, PetType, Personality } from '../types'

// ============ Auth ============
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  return supabase.auth.signOut()
}

export function getSession() {
  return supabase.auth.getSession()
}

export function onAuthChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => callback(session))
}

// ============ Classes ============
export async function getClasses() {
  const { data, error } = await supabase.from('classes').select('*').order('created_at')
  return { data: data as Class[] | null, error }
}

export async function createClass(name: string) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('classes').insert({ name, user_id: user!.id }).select().single()
  return { data: data as Class | null, error }
}

export async function deleteClass(id: string) {
  const { error } = await supabase.from('classes').delete().eq('id', id)
  return { error }
}

export async function renameClass(id: string, name: string) {
  const { error } = await supabase.from('classes').update({ name }).eq('id', id)
  return { error }
}

// ============ Students ============
export async function getStudents(classId: string) {
  const { data, error } = await supabase.from('students').select('*').eq('class_id', classId).order('name')
  return { data: data as Student[] | null, error }
}

export async function addStudent(classId: string, name: string) {
  const { data, error } = await supabase.from('students').insert({ class_id: classId, name }).select().single()
  return { data: data as Student | null, error }
}

export async function batchAddStudents(classId: string, names: string[]) {
  const rows = names.map(name => ({ class_id: classId, name }))
  const { error } = await supabase.from('students').insert(rows)
  return { error }
}

export async function deleteStudent(id: string) {
  const { error } = await supabase.from('students').delete().eq('id', id)
  return { error }
}

export async function updateStudentPoints(studentId: string, amount: number, reason: string) {
  const { data: student } = await supabase.from('students').select('points').eq('id', studentId).single()
  if (!student) return { error: new Error('学生不存在') }
  const newPoints = Math.max(0, (student.points || 0) + amount)
  const { error: updateError } = await supabase.from('students').update({ points: newPoints }).eq('id', studentId)
  if (updateError) return { error: updateError }
  const { error: logError } = await supabase.from('points_log').insert({ student_id: studentId, amount, reason })
  return { error: logError }
}

export async function getPointsLog(studentId: string) {
  const { data, error } = await supabase.from('points_log')
    .select('*').eq('student_id', studentId).order('created_at', { ascending: false }).limit(20)
  return { data: data as PointsLog[] | null, error }
}

// ============ Pets ============
export async function createPet(studentId: string, type: PetType, personality: Personality, design?: string | null) {
  const { data, error } = await supabase.from('pets').insert({
    student_id: studentId, type, personality, stage: 'egg',
    hunger: 100, happiness: 100, feed_count: 0, last_fed_at: new Date().toISOString(),
    design: design || null,
  }).select().single()
  return { data: data as Pet | null, error }
}

export async function updatePetType(petId: string, type: PetType, design?: string | null) {
  const updateData: any = { type }
  if (design) updateData.design = design
  const { error } = await supabase.from('pets').update(updateData).eq('id', petId)
  return { error }
}

export async function getPetsByClass(classId: string): Promise<{ data: PetWithStudent[] | null, error: any }> {
  const { data, error } = await supabase
    .from('pets')
    .select(`*, students!inner(id, name, points, class_id)`)
    .eq('students.class_id', classId)
    .order('created_at')
  if (error) return { data: null, error }
  const pets: PetWithStudent[] = (data || []).map((row: any) => ({
    id: row.id, student_id: row.student_id, type: row.type, personality: row.personality,
    stage: row.stage, hunger: row.hunger, happiness: row.happiness, feed_count: row.feed_count,
    last_fed_at: row.last_fed_at, created_at: row.created_at,
    design: row.design || null, sick: row.sick || false,
    student_name: row.students.name, student_points: row.students.points,
  }))
  return { data: pets, error: null }
}

export async function getPetByStudent(studentId: string) {
  const { data, error } = await supabase.from('pets').select('*').eq('student_id', studentId).single()
  return { data: data as Pet | null, error }
}

export async function feedPet(petId: string, hunger: number, happiness: number, feedCount: number, stage: string) {
  const { data, error } = await supabase.from('pets').update({
    hunger, happiness, feed_count: feedCount, stage, last_fed_at: new Date().toISOString(),
  }).eq('id', petId).select().single()
  return { data: data as Pet | null, error }
}

export async function applyDecoration(_petId: string, _itemId: string) {
  return { error: null }
}

// ============ Inventory ============
export async function getInventory(studentId: string) {
  const { data, error } = await supabase
    .from('inventory')
    .select(`*, item:items(*)`)
    .eq('student_id', studentId)
  return { data: data as (InventorySlot & { item: Item })[] | null, error }
}

export async function addItem(studentId: string, itemId: string) {
  const { data: existing } = await supabase.from('inventory')
    .select('*').eq('student_id', studentId).eq('item_id', itemId).single()
  if (existing) {
    const { error } = await supabase.from('inventory')
      .update({ quantity: existing.quantity + 1 }).eq('id', existing.id)
    return { error }
  } else {
    const { error } = await supabase.from('inventory')
      .insert({ student_id: studentId, item_id: itemId, quantity: 1 })
    return { error }
  }
}

export async function useItem(inventoryId: string, newQuantity: number) {
  if (newQuantity <= 0) {
    const { error } = await supabase.from('inventory').delete().eq('id', inventoryId)
    return { error }
  }
  const { error } = await supabase.from('inventory').update({ quantity: newQuantity }).eq('id', inventoryId)
  return { error }
}

// ============ Lottery ============
export async function getLotteryPool(tier: string) {
  const { data, error } = await supabase.from('lottery_pools').select('*, item:items(*)').eq('tier', tier)
  return { data: data as (LotteryPoolEntry & { item: Item })[] | null, error }
}

// ============ Items ============
export async function getAllItems() {
  const { data, error } = await supabase.from('items').select('*')
  return { data: data as Item[] | null, error }
}
