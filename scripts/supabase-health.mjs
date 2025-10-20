#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const anon = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!url || !anon) {
  console.error('Missing env: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  process.exit(2)
}

const supabase = createClient(url, anon)

;(async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1)
    if (error) {
      console.error('Supabase query error:', error.message)
      process.exit(1)
    }
    console.log('Supabase reachable. Sample result length:', data?.length ?? 0)
    process.exit(0)
  } catch (e) {
    console.error('Supabase connectivity failed:', e.message)
    process.exit(1)
  }
})()
