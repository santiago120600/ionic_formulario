import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'almacen.swcatorce.upsrj',
  appName: 'almacen_app',
  webDir: 'www',
  bundledWebRuntime: false,
  android: {
        allowMixedContent: true
  }
};

export default config;
