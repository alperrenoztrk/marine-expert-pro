import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Authentication işlemi gerçekleştiriliyor...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔐 Auth callback başlatıldı');
        console.log('Current URL:', window.location.href);
        
        // URL'den auth code'u al ve session'ı exchange et
        const { data, error } = await supabase.auth.getSession();
        
        console.log('Session response:', { data, error });
        
        if (error) {
          console.error('❌ Session error:', error);
          throw error;
        }

        if (data.session) {
          console.log('✅ Session başarılı:', {
            user: data.session.user.email,
            expires_at: data.session.expires_at
          });
          
          // Başarılı giriş
          setStatus('success');
          setMessage(`Hoş geldiniz, ${data.session.user.user_metadata?.full_name || data.session.user.email}!`);
          
          toast.success('Google ile başarıyla giriş yaptınız! 🎉');
          
          // 2 saniye sonra ana sayfaya yönlendir
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
          
        } else {
          console.warn('⚠️ Session yok, exchange deneniyor...');
          
          // Alternatif: URL'den code parametresini al ve manuel exchange dene
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            console.log('✅ Access token bulundu, session set ediliyor');
            const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
            
            if (userError) {
              throw userError;
            }
            
            if (userData.user) {
              setStatus('success');
              setMessage(`Hoş geldiniz, ${userData.user.email}!`);
              toast.success('Google ile başarıyla giriş yaptınız! 🎉');
              
              setTimeout(() => {
                navigate('/', { replace: true });
              }, 2000);
              return;
            }
          }
          
          throw new Error('Session oluşturulamadı - URL parametreleri kontrol edildi');
        }
        
      } catch (error: any) {
        console.error('❌ Auth callback error:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        setStatus('error');
        setMessage(`Giriş hatası: ${error.message || 'Bilinmeyen hata'}`);
        
        toast.error('Giriş işlemi başarısız oldu. Lütfen tekrar deneyin.');
        
        // 3 saniye sonra ana sayfaya yönlendir
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 cyberpunk:from-black cyberpunk:to-gray-900 neon:from-slate-900 neon:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className={`text-xl ${getStatusColor()}`}>
            {status === 'loading' && 'Giriş İşlemi Devam Ediyor'}
            {status === 'success' && 'Giriş Başarılı! 🎉'}
            {status === 'error' && 'Giriş Hatası'}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          {status === 'loading' && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Google hesabınız doğrulanıyor...
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="space-y-3">
              <div className="text-sm text-green-600 font-medium">
                ✅ Hesabınız başarıyla oluşturuldu
              </div>
              <div className="text-sm text-muted-foreground">
                Ana sayfaya yönlendiriliyorsunuz...
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="space-y-3">
              <div className="text-sm text-red-600">
                ❌ Giriş işlemi tamamlanamadı
              </div>
              <div className="text-sm text-muted-foreground">
                Ana sayfaya yönlendiriliyorsunuz...
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;