import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SupabaseStatusIndicator() {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    setStatus('checking');
    try {
      // Test auth connection
      const { error: authError } = await supabase.auth.getSession();
      if (authError) throw authError;

      // Test database connection with a simple query
      const { error: dbError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      
      if (dbError && dbError.code !== 'PGRST116') { // PGRST116 is "table not found", which is ok
        throw dbError;
      }

      setStatus('healthy');
      setLastChecked(new Date());
    } catch (error) {
      console.error('Supabase connection check failed:', error);
      setStatus('unhealthy');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkConnection();
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span data-translatable>Backend Durumu</span>
          {status === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          {status === 'healthy' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          {status === 'unhealthy' && <XCircle className="w-4 h-4 text-red-500" />}
        </CardTitle>
        <CardDescription>
          <span data-translatable>Bağlantı ve kimlik doğrulama durumu</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            <span data-translatable>Durum</span>:
          </span>
          <Badge 
            variant={status === 'healthy' ? 'default' : status === 'unhealthy' ? 'destructive' : 'secondary'}
            className="ml-2"
          >
            {status === 'checking' && <span data-translatable>Kontrol ediliyor</span>}
            {status === 'healthy' && <span data-translatable>Çevrimiçi</span>}
            {status === 'unhealthy' && <span data-translatable>Bağlantı sorunu</span>}
          </Badge>
        </div>
        
        {lastChecked && (
          <div className="text-xs text-muted-foreground">
            <span data-translatable>Son kontrol</span>: {lastChecked.toLocaleTimeString('tr-TR')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
