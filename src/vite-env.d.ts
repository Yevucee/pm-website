/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_SUBMIT_URL?: string;
  readonly VITE_FORM_SUBMIT_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
