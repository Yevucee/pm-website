/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_SUBMIT_URL?: string;
  readonly VITE_FORM_SUBMIT_SECRET?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
  readonly VITE_STATS_ACCESS_KEY?: string;
  readonly VITE_LOOKER_STUDIO_EMBED_URL?: string;
  readonly VITE_STATS_SHEET_EMBED_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
