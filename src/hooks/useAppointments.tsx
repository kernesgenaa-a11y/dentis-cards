import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type Appointment = {
  id: string
  patient_id: string
  visit_date: string
  notes: string | null
}

export function useAppointments(patientId?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [patientId])

  async function load() {
    setLoading(true)

    let query = supabase
      .from('appointments')
      .select('*')
      .order('visit_date', { ascending: false })

    if (patientId) query = query.eq('patient_id', patientId)

    const { data, error } = await query

    if (!error && data) setAppointments(data)
    setLoading(false)
  }

  async function addAppointment(input: Omit<Appointment, 'id'>) {
    const { error } = await supabase
      .from('appointments')
      .insert(input)

    if (error) throw error
    await load()
  }

  async function deleteAppointment(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    if (error) throw error
    await load()
  }

  return {
    appointments,
    loading,
    reload: load,
    addAppointment,
    deleteAppointment,
  }
}
