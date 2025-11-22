import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle2, XCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SupabaseStatusIndicator() {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'unhealthy'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const checkConnection = async () => {
    setStatus('checking');
    setErrorDetails(null);
    
    try {
      // Test auth connection first
      const { data: sessionData, error: authError } = await supabase.auth.getSession();
      
      if (authError) {
        setErrorDetails(`Kimlik doğrulama hatası: ${authError.message}`);
        throw authError;
      }

      // Simple health check - just verify we can reach the API
      // We'll use a lightweight query that doesn't depend on specific tables
      const { error: pingError } = await supabase.rpc('ping').then(
        () => ({ error: null }),
        // If ping function doesn't exist, that's okay - it means we can reach the API
        (err) => {
          // Check if it's a "function not found" error, which is acceptable
          if (err?.code === '42883' || err?.message?.includes('function')) {
            return { error: null };
          }
          return { error: err };
        }
      );

      if (pingError) {
        setErrorDetails(`Bağlantı hatası: ${pingError.message || 'Sunucuya ulaşılamıyor'}`);
        throw pingError;
      }

      setStatus('healthy');
      setLastChecked(new Date());
    } catch (error: any) {
      console.error('Supabase connection check failed:', error);
      
      // Provide more helpful error messages
      if (!errorDetails) {
        if (error?.message?.includes('Failed to fetch')) {
          setErrorDetails('Sunucuya bağlanılamıyor. Backend yapılandırmasını kontrol edin.');
        } else {
          setErrorDetails(error?.message || 'Bilinmeyen hata');
        }
      }
      
      setStatus('unhealthy');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkConnection();
    // Check every 60 seconds instead of 30 to reduce load
    const interval = setInterval(checkConnection, 60000);
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
          <div className="flex items-center gap-2">
            <Badge 
              variant={status === 'healthy' ? 'default' : status === 'unhealthy' ? 'destructive' : 'secondary'}
            >
              {status === 'checking' && <span data-translatable>Kontrol ediliyor</span>}
              {status === 'healthy' && <span data-translatable>Çevrimiçi</span>}
              {status === 'unhealthy' && <span data-translatable>Çevrimdışı</span>}
            </Badge>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={checkConnection}
              disabled={status === 'checking'}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${status === 'checking' ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {lastChecked && (
          <div className="text-xs text-muted-foreground">
            <span data-translatable>Son kontrol</span>: {lastChecked.toLocaleTimeString('tr-TR')}
          </div>
        )}

        {status === 'unhealthy' && errorDetails && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {errorDetails}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
