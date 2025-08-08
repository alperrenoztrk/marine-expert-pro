import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageRouteSync = () => {
  const location = useLocation();
  const { currentLanguage, applyTranslations } = useLanguage();

  useEffect(() => {
    // Re-apply translations on route change and language change
    applyTranslations(currentLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, currentLanguage]);

  return null;
};