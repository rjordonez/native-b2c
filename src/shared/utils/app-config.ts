import { APP_CONFIG_DEFAULTS } from '../../features/livekit/app-config';
import type { AppConfig, SandboxConfig } from '../../features/livekit/types';

export const CONFIG_ENDPOINT = import.meta.env.VITE_APP_CONFIG_ENDPOINT;
export const SANDBOX_ID = import.meta.env.VITE_SANDBOX_ID;

export function getOrigin(): string {
  return window.location.origin;
}

export const getAppConfig = async (): Promise<AppConfig> => {
  if (CONFIG_ENDPOINT) {
    const origin = getOrigin();
    const sandboxId = SANDBOX_ID ?? origin.split('.')[0];

    try {
      const response = await fetch(CONFIG_ENDPOINT, {
        cache: 'no-store',
        headers: { 'X-Sandbox-ID': sandboxId },
      });

      const remoteConfig: SandboxConfig = await response.json();
      const config: AppConfig = { ...APP_CONFIG_DEFAULTS };

      for (const [key, entry] of Object.entries(remoteConfig)) {
        if (entry === null) continue;
        if (
          key in config &&
          typeof config[key as keyof AppConfig] === entry.type &&
          typeof config[key as keyof AppConfig] === typeof entry.value
        ) {
          // @ts-expect-error I'm not sure quite how to appease TypeScript, but we've thoroughly checked types above
          config[key as keyof AppConfig] = entry.value as AppConfig[keyof AppConfig];
        }
      }

      return config;
    } catch (error) {
      console.error('Failed to fetch app config:', error);
    }
  }

  return APP_CONFIG_DEFAULTS;
};