/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_CONFIG_ENDPOINT?: string;
  readonly VITE_SANDBOX_ID?: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}