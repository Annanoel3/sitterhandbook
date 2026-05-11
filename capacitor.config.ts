import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sitterhandbook.android',
  appName: 'SitterHandbook',
  webDir: 'dist',
  server: {
    url: 'https://paws-port-00644a1d.base44.app',
    cleartext: false,
    androidScheme: 'https',
    allowNavigation: [
      'paws-port-00644a1d.base44.app',
      '*.base44.app',
      'accounts.google.com',
      '*.google.com',
    ],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false,
      androidSplashResourceName: 'splash',
    },
    StatusBar: {
      style: 'DEFAULT',
      backgroundColor: '#ffffff',
    },
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
