import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type Patient = {
  id: string
  full_name: string
  phone: string
  birth_date: string | null
  leading_doctor: string | null
}

const CACHE_KEY = 'patients_cache'

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) setPatients(JSON.parse(cached))
  }, [])

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    setLoading(true)
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else if (data) {
      setPatients(data)
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    }

    setLoading(false)
  }

  async function addPatient(input: Omit<Patient, 'id'>) {
    const { error } = await supabase
      .from('patients')
      .insert(input)

    if (error) throw error
    await refresh()
  }

  async function updatePatient(id: string, input: Partial<Patient>) {
    const { error } = await supabase
      .from('patients')
      .update(input)
      .eq('id', id)

    if (error) throw error
    await refresh()
  }

  async function deletePatient(id: string) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)

    if (error) throw error
    await refresh()
  }

  return {
    patients,
    loading,
    error,
    refresh,
    addPatient,
    updatePatient,
    deletePatient,
  }
}
