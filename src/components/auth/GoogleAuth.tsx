import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, BookmarkPlus, History, Crown, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/safeClient";

interface GoogleUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
    picture?: string;
  };
}

interface AuthProps {
  onAuthChange?: (user: GoogleUser | null) => void;
}

export const GoogleAuth = ({ onAuthChange }: AuthProps) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session error:', error.message);
          return;
        }
        
        if (session?.user) {
          setUser(session.user as GoogleUser);
          onAuthChange?.(session.user as GoogleUser);
        }
      } catch (error) {
        console.error('Auth session error:', error);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user as GoogleUser);
          onAuthChange?.(session.user as GoogleUser);
          toast.success(`Hoş geldiniz, ${session.user.user_metadata?.full_name || session.user.email}!`);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          onAuthChange?.(null);
          toast.success('Başarıyla çıkış yaptınız');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [onAuthChange]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Get current URL for redirect
      const currentUrl = window.location.origin;
      const redirectUrl = `${currentUrl}/auth/callback`;
      
      console.log('Attempting Google sign in with redirect:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google sign in error:', error);
        toast.error(`Giriş başarısız: ${error.message}`);
        return;
      }

      console.log('Google sign in initiated:', data);
      
    } catch (error: unknown) {
      console.error('Unexpected auth error:', error);
      toast.error(error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast.error(`Çıkış hatası: ${error.message}`);
        return;
      }
      
      setUser(null);
      onAuthChange?.(null);
      setIsDropdownOpen(false);
      
    } catch (error: unknown) {
      console.error('Unexpected sign out error:', error);
      toast.error(error instanceof Error ? error.message : 'Çıkış yapılırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Get user display info
  const getUserDisplayName = () => {
    if (!user) return '';
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'Kullanıcı';
  };

  const getUserAvatar = () => {
    if (!user) return '';
    return user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
  };

  if (!user) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/25 bg-background/50">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-lg" data-translatable>Hesap Oluştur / Giriş Yap</CardTitle>
          <CardDescription className="text-sm" data-translatable>
            Hesaplarınızı kaydetmek ve senkronize etmek için Google ile giriş yapın
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            variant="outline"
            className="w-full gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span data-translatable>Giriş yapılıyor...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span data-translatable>Google ile Giriş Yap</span>
              </>
            )}
          </Button>
          
          <div className="mt-3 text-center">
            <p className="text-xs text-muted-foreground" data-translatable>
              Giriş yaparak <span className="text-primary">Kullanım Şartları</span> ve <span className="text-primary">Gizlilik Politikası</span>'nı kabul etmiş olursunuz
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2 h-auto p-2 hover:bg-muted/50"
            disabled={loading}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getUserDisplayName().charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start min-w-0">
              <span className="text-sm font-medium truncate max-w-24">
                {getUserDisplayName()}
              </span>
              <span className="text-xs text-muted-foreground truncate max-w-24">
                {user.email}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center gap-2 p-2 border-b">
            <Avatar className="w-10 h-10">
              <AvatarImage src={getUserAvatar()} alt={getUserDisplayName()} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getUserDisplayName().charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{getUserDisplayName()}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <BookmarkPlus className="w-4 h-4" />
            <span data-translatable>Favoriler</span>
            <Badge variant="secondary" className="ml-auto text-xs">0</Badge>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <History className="w-4 h-4" />
            <span data-translatable>Geçmiş</span>
            <Badge variant="secondary" className="ml-auto text-xs">0</Badge>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="gap-2 cursor-pointer">
            <Settings className="w-4 h-4" />
            <span data-translatable>Ayarlar</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="gap-2 cursor-pointer text-red-600 focus:text-red-600" 
            onClick={signOut}
            disabled={loading}
          >
            <LogOut className="w-4 h-4" />
            <span data-translatable>Çıkış Yap</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};