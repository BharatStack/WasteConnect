
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.1ec418875572496589869c51daeb5f27',
  appName: 'glow-flow-green-app',
  webDir: 'dist',
  server: {
    url: 'https://1ec41887-5572-4965-8986-9c51daeb5f27.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#10b981'
    }
  }
};

export default config;
