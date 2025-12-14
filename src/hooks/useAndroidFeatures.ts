import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { App } from '@capacitor/app';
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
      let backButtonListener: any;

      const setupListeners = async () => {
        keyboardWillShowListener = await Keyboard.addListener('keyboardWillShow', () => {
          setKeyboardVisible(true);
        });

        keyboardWillHideListener = await Keyboard.addListener('keyboardWillHide', () => {
          setKeyboardVisible(false);
        });

        // Back button handler
        backButtonListener = await App.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            App.exitApp();
          } else {
            window.history.back();
          }
        });
      };

      setupListeners();

      return () => {
        keyboardWillShowListener?.remove();
        keyboardWillHideListener?.remove();
        backButtonListener?.remove();
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