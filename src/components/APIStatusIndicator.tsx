import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/safeClient';

interface APIStatus {
  name: string;
  status: 'checking' | 'active' | 'inactive' | 'error';
  description: string;
}

export function APIStatusIndicator() {
  const [apis, setApis] = useState<APIStatus[]>([
    { name: 'Lovable Cloud', status: 'checking', description: 'Backend ve veritabanı servisi' },
    { name: 'Google Auth', status: 'checking', description: 'Google ile giriş' },
    { name: 'Stripe', status: 'checking', description: 'Ödeme sistemi' },
    { name: 'Lovable AI', status: 'checking', description: 'AI özellikleri' },
  ]);

  useEffect(() => {
    checkAPIs();
  }, []);

  const checkAPIs = async () => {
    const updatedApis: APIStatus[] = [];

    // Check Lovable Cloud (Supabase)
    try {
      const { error } = await supabase.auth.getSession();
      updatedApis.push({
        name: 'Lovable Cloud',
        status: error ? 'error' : 'active',
        description: 'Backend ve veritabanı servisi'
      });
    } catch {
      updatedApis.push({
        name: 'Lovable Cloud',
        status: 'error',
        description: 'Backend ve veritabanı servisi'
      });
    }

    // Check Google Auth
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const hasGoogleProvider = session?.user?.app_metadata?.provider === 'google';
      updatedApis.push({
        name: 'Google Auth',
        status: hasGoogleProvider ? 'active' : 'inactive',
        description: 'Google ile giriş'
      });
    } catch {
      updatedApis.push({
        name: 'Google Auth',
        status: 'inactive',
        description: 'Google ile giriş'
      });
    }

    // Check Stripe (try to invoke function to see if configured)
    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: { test: true }
      });
      const isConfigured = data?.status === 'configured';
      updatedApis.push({
        name: 'Stripe',
        status: isConfigured ? 'active' : 'inactive',
        description: 'Ödeme sistemi'
      });
    } catch {
      updatedApis.push({
        name: 'Stripe',
        status: 'inactive',
        description: 'Ödeme sistemi'
      });
    }

    // Check Lovable AI (check if edge function exists and is configured)
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { test: true }
      });
      const isConfigured = data?.status === 'configured';
      updatedApis.push({
        name: 'Lovable AI',
        status: isConfigured ? 'active' : 'inactive',
        description: 'AI özellikleri'
      });
    } catch {
      updatedApis.push({
        name: 'Lovable AI',
        status: 'inactive',
        description: 'AI özellikleri'
      });
    }

    setApis(updatedApis);
  };

  const getStatusColor = (status: APIStatus['status']) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'inactive': return 'text-gray-400';
      case 'error': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: APIStatus['status']) => {
    switch (status) {
      case 'checking': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'active': return <CheckCircle2 className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: APIStatus['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: APIStatus['status']) => {
    switch (status) {
      case 'checking': return 'Kontrol ediliyor';
      case 'active': return 'Aktif';
      case 'inactive': return 'Devre dışı';
      case 'error': return 'Hata';
    }
  };

  return (
    <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="w-5 h-5" />
          <span data-translatable>API Durumu</span>
        </CardTitle>
        <CardDescription>
          <span data-translatable>Bağlı servislerin durumu</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {apis.map((api) => (
            <div key={api.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={getStatusColor(api.status)}>
                  {getStatusIcon(api.status)}
                </div>
                <div>
                  <div className="font-medium text-sm" data-translatable>{api.name}</div>
                  <div className="text-xs text-muted-foreground" data-translatable>{api.description}</div>
                </div>
              </div>
              <Badge variant={getStatusBadge(api.status)}>
                <span data-translatable>{getStatusText(api.status)}</span>
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
