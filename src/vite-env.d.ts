/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_SUBMIT_URL?: string;
  readonly VITE_FORM_SUBMIT_SECRET?: string;
  readonly VITE_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
