import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/publicClient';

export interface ProStatus {
  loading: boolean;
  isPro: boolean;
  expiresAt?: Date | null;
  profile?: any | null;
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

        const { data, error } = await (supabase as any)
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (error) throw error;

        const profile = (data ?? null) as any | null;
        const expiresAt = profile?.pro_expires_at ? new Date(profile.pro_expires_at) : null;
        const isProActive = Boolean(profile?.is_pro) && (!expiresAt || expiresAt.getTime() > Date.now());

        if (isMounted) setState({ loading: false, isPro: isProActive, expiresAt, profile });
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
