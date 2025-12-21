import { ReactNode } from 'react';
import { usePro } from '@/hooks/usePro';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/safeClient';

interface PremiumGuardProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export const PremiumGuard = ({ children, title = 'Premium İçerik', description = 'Bu içerik ücretli abonelere özeldir.' }: PremiumGuardProps) => {
  const { loading, isPro } = usePro();

  const startCheckout = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          mode: 'payment',
          successUrl: window.location.origin + '/?payment=success',
          cancelUrl: window.location.href,
        },
      });
      if (error) throw error;
      const url = (data as any)?.url;
      if (url) window.location.href = url as string;
    } catch (e) {
      console.error('Checkout error', e);
    }
  };

  if (loading) return null;
  if (isPro) return <>{children}</>;

  return (
    <Card className="max-w-xl mx-auto">
      <CardContent className="py-8 text-center space-y-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button onClick={startCheckout}>Satın Al ve Eriş</Button>
      </CardContent>
    </Card>
  );
};
