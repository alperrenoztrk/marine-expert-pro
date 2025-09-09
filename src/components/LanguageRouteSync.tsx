import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageRouteSync = () => {
  const location = useLocation();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // Simple route sync - just ensure document lang is set
    document.documentElement.lang = currentLanguage;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, currentLanguage]);

  return null;
};