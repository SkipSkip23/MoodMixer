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
      appId: 'ca-app-pub-3940256099942544~3347511713', // Replace with your actual App ID
      requestTrackingAuthorization: true,
      testingDevices: ['YOUR_TESTING_DEVICE_ID']
    }
  }
};

export default config;
