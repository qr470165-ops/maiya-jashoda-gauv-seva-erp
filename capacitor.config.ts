import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.maiyajashoda.app',
  appName: 'Maiya Jashoda Trust',
  webDir: 'public',
  server: {
    url: 'https://maiya-jashoda-gauv-seva-erp.vercel.app',
    cleartext: true
  }
};

export default config;