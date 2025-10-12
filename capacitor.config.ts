import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c91ef2fa0890438a815184cda6639f91',
  appName: 'maritime-calculator',
  webDir: 'dist',
  server: {
    url: 'https://c91ef2fa-0890-438a-8151-84cda6639f91.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1e40af'
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK'
    },
    App: {
      skipBackButton: true
    },
    Haptics: {},
    // Firebase & Google Services Configuration
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '318030353367-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK'
    },
    
  }
};

export default config;