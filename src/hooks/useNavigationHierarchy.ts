import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Sayfa hiyerarşisi mapping'i - her sayfa için parent menü tanımı
const navigationHierarchy: Record<string, string> = {
  // Calculations menu pages
  '/calculations': '/',
  '/navigation-calculation': '/calculations',
  '/stability-calculations': '/calculations',
  '/hydrostatics': '/calculations',
  '/hydrostatic-page': '/calculations',
  '/hydrostatics-stability': '/calculations',
  '/trim-list': '/calculations',
  '/ballast': '/calculations',
  '/tank-calculations': '/calculations',
  '/engine': '/calculations',
  '/economics': '/calculations',
  '/safety-calculations': '/calculations',
  '/structural-calculations': '/calculations',
  '/hydrodynamics': '/calculations',
  '/emission-calculations': '/calculations',
  '/weather-calculations': '/calculations',
  '/special-ship-calculations': '/calculations',
  
  // Navigation menu pages
  '/navigation-menu': '/',
  '/navigation-topics': '/navigation-menu',
  '/navigation-formulas': '/navigation-menu',
  '/navigation-quiz': '/navigation-menu',
  '/navigation-assistant': '/navigation-menu',
  '/celestial-calculations': '/navigation-menu',
  
  // Stability menu pages
  '/stability': '/',
  '/stability-topics': '/stability',
  '/stability-formulas': '/stability',
  '/stability-quiz': '/stability',
  '/stability-assistant': '/stability',
  '/stability-calculator': '/stability',
  '/stability-analysis': '/stability',
  '/stable-tales': '/stability',
  
  // Stability topics
  '/stability-topics/transverse': '/stability-topics',
  '/stability-topics/longitudinal': '/stability-topics',
  '/stability-topics/trim-list': '/stability-topics',
  '/stability-topics/gm': '/stability-topics',
  '/stability-topics/gz': '/stability-topics',
  '/stability-topics/gz-curve': '/stability-topics',
  '/stability-topics/displacement': '/stability-topics',
  '/stability-topics/draft': '/stability-topics',
  '/stability-topics/tpc': '/stability-topics',
  '/stability-topics/hydrostatic': '/stability-topics',
  '/stability-topics/bonjean': '/stability-topics',
  '/stability-topics/free-surface': '/stability-topics',
  '/stability-topics/weight-shift': '/stability-topics',
  '/stability-topics/passenger-shift': '/stability-topics',
  '/stability-topics/wind-heel': '/stability-topics',
  '/stability-topics/turning-heel': '/stability-topics',
  '/stability-topics/list': '/stability-topics',
  '/stability-topics/loll': '/stability-topics',
  '/stability-topics/damage': '/stability-topics',
  '/stability-topics/grain': '/stability-topics',
  '/stability-topics/roll-period': '/stability-topics',
  '/stability-topics/imo-criteria': '/stability-topics',
  '/stability-topics/gz-imo': '/stability-topics',
  '/stability-topics/inclination-test': '/stability-topics',
  '/stability-topics/shearing-bending': '/stability-topics',
  '/stability-topics/wind-weather': '/stability-topics',
  
  // Stability practical pages
  '/stability-practical': '/stability',
  '/stability-practical/fwa': '/stability-practical',
  '/stability-practical/ghm': '/stability-practical',
  '/stability-practical/tank': '/stability-practical',
  
  // Stability formulas detail pages
  '/stability-formulas/transverse': '/stability-formulas',
  '/stability-formulas/longitudinal': '/stability-formulas',
  '/stability-formulas/trim': '/stability-formulas',
  '/stability-formulas/gm': '/stability-formulas',
  '/stability-formulas/gz': '/stability-formulas',
  '/stability-formulas/displacement': '/stability-formulas',
  '/stability-formulas/draft': '/stability-formulas',
  '/stability-formulas/tpc': '/stability-formulas',
  '/stability-formulas/free-surface': '/stability-formulas',
  '/stability-formulas/weight-shift': '/stability-formulas',
  '/stability-formulas/wind-heel': '/stability-formulas',
  '/stability-formulas/list': '/stability-formulas',
  '/stability-formulas/loll': '/stability-formulas',
  '/stability-formulas/roll-period': '/stability-formulas',
  '/stability-formulas/imo-criteria': '/stability-formulas',
  '/stability-formulas/grain': '/stability-formulas',
  
  // Stability rules pages
  '/stability-rules': '/stability',
  '/stability-rules/basic': '/stability-rules',
  
  // Draft survey pages
  '/draft-survey': '/calculations',
  '/draft-survey/standard': '/draft-survey',
  '/draft-survey/intermediate': '/draft-survey',
  '/draft-survey/comparative': '/draft-survey',
  '/draft-survey/density': '/draft-survey',
  '/draft-survey/ballast': '/draft-survey',
  '/draft-survey/bunker': '/draft-survey',
  '/draft-survey/port': '/draft-survey',
  '/draft-survey/preloading': '/draft-survey',
  '/draft-survey/postdischarge': '/draft-survey',
  '/draft-survey/analysis': '/draft-survey',
  
  // Ballast menu pages
  '/ballast-menu': '/',
  
  // Tank menu pages
  '/tank-menu': '/',
  
  // Engine menu pages
  '/engine-menu': '/',
  
  // Economics menu pages
  '/economics-menu': '/',
  
  // Safety menu pages
  '/safety-menu': '/',
  
  // Emissions menu pages
  '/emissions-menu': '/',
  
  // Hydrodynamics menu pages
  '/hydrodynamics-menu': '/',
  
  // Structural menu pages
  '/structural-menu': '/',
  
  // Special ships menu pages
  '/special-ships-menu': '/',
  
  // SOLAS menu pages
  '/solas-menu': '/',
  '/regulations': '/solas-menu',
  '/colreg-presentation': '/solas-menu',
  
  // Seamanship menu pages
  '/seamanship-menu': '/',
  '/seamanship-topics': '/seamanship-menu',
  '/sailor-knots': '/seamanship-menu',
  
  // Weather pages
  '/weather-menu': '/',
  '/weather-forecast': '/weather-menu',
  '/detailed-meteorology': '/weather-menu',
  
  // Utility pages
  '/clock': '/',
  '/moon-phases': '/',
  '/sunrise-times': '/',
  '/sunset-times': '/',
  '/location-selector': '/',
  '/settings': '/',
  
  // Widget page
  '/empty': '/',
};

/**
 * Hook that handles browser/mobile back button navigation
 * according to logical menu hierarchy instead of browser history
 */
export const useNavigationHierarchy = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = (event: PopStateEvent) => {
      event.preventDefault();
      
      const currentPath = location.pathname;
      const parentPath = navigationHierarchy[currentPath];
      
      if (parentPath) {
        // Navigate to parent menu
        navigate(parentPath, { replace: true });
      } else {
        // If no parent defined, go to home
        navigate('/', { replace: true });
      }
    };

    // Listen to browser back button
    window.addEventListener('popstate', handleBackButton);

    // Push a dummy state to enable back button handling
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [location.pathname, navigate]);
};
