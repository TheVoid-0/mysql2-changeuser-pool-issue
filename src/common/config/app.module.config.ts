import { ConfigModuleOptions } from '@nestjs/config';

export function getConfigServiceConfiguration(): ConfigModuleOptions {
  return {
    isGlobal: true,
    envFilePath: ['.env', '.env.local', '.env.production'],
    load: [
      () => ({
        MODE: process.env.MODE,
        DEBUG: process.env.DEBUG === 'true' ? true : false,
      }),
    ],
  };
}
