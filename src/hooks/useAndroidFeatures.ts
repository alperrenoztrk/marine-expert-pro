import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const useAndroidFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());

    if (Capacitor.isNativePlatform()) {
      // Status bar configuration
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#1e40af' });

      // Keyboard listeners
      let keyboardWillShowListener: any;
      let keyboardWillHideListener: any;

      const setupListeners = async () => {
        keyboardWillShowListener = await Keyboard.addListener('keyboardWillShow', () => {
          setKeyboardVisible(true);
        });

        keyboardWillHideListener = await Keyboard.addListener('keyboardWillHide', () => {
          setKeyboardVisible(false);
        });

        // Note: Back button handling is done in useNavigationHierarchy hook
        // to provide hierarchical navigation instead of browser history
      };

      setupListeners();

      return () => {
        keyboardWillShowListener?.remove();
        keyboardWillHideListener?.remove();
      };
    }
  }, []);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      await Haptics.impact({ style });
    }
  };

  const hideKeyboard = async () => {
    if (isNative) {
      await Keyboard.hide();
    }
  };

  return {
    isNative,
    keyboardVisible,
    triggerHaptic,
    hideKeyboard
  };
};