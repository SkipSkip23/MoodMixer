import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mixly.app',
  appName: 'Mixly',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a1a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    },
    AdMob: {
      appId: 'ca-app-pub-9239950445744298~6096572015', // Your real AdMob App ID
      requestTrackingAuthorization: true,
      testingDevices: [] // Empty for production
    }
  }
};

export default config;
