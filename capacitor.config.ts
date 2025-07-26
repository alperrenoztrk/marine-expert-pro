import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.maritime.calculator',
  appName: 'Maritime Calculator',
  webDir: 'dist',
  server: {
    url: 'https://dfc3279a-089d-4d25-bff1-ff197bc24769.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e40af',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1e40af'
    },
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
    // Firebase project configuration
    googleServicesFile: 'google-services.json'
  }
};

export default config;