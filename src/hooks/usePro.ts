import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export interface ProStatus {
  loading: boolean;
  isPro: boolean;
  expiresAt?: Date | null;
  profile?: Tables<'profiles'> | null;
}

export function usePro(): ProStatus {
  const [state, setState] = useState<ProStatus>({ loading: true, isPro: false });

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;
        const userId = sessionData.session?.user?.id;
        if (!userId) {
          if (isMounted) setState({ loading: false, isPro: false });
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (error) throw error;

        const profile = data as Tables<'profiles'> | null;
        // Pro status fields are not currently in the database schema
        // Defaulting to non-pro status
        const active = false;
        const expiresAt = null;

        if (isMounted) setState({ loading: false, isPro: active, expiresAt, profile });
      } catch (e) {
        console.error('Failed to load pro status', e);
        if (isMounted) setState({ loading: false, isPro: false });
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
