import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type ToothTreatment = {
  id: string
  patient_id: string
  tooth: string
  reason: string
  treatment_date: string
}

export function useToothTreatments(patientId?: string) {
  const [treatments, setTreatments] = useState<ToothTreatment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [patientId])

  async function load() {
    setLoading(true)

    let query = supabase
      .from('tooth_treatments')
      .select('*')
      .order('treatment_date', { ascending: false })

    if (patientId) query = query.eq('patient_id', patientId)

    const { data, error } = await query

    if (!error && data) setTreatments(data)
    setLoading(false)
  }

  async function addTreatment(input: Omit<ToothTreatment, 'id'>) {
    const { error } = await supabase
      .from('tooth_treatments')
      .insert(input)

    if (error) throw error
    await load()
  }

  async function deleteTreatment(id: string) {
    const { error } = await supabase
      .from('tooth_treatments')
      .delete()
      .eq('id', id)

    if (error) throw error
    await load()
  }

  return {
    treatments,
    loading,
    reload: load,
    addTreatment,
    deleteTreatment,
  }
}
