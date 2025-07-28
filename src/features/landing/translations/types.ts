export type Language = 'en' | 'vi';

export interface Translations {
  [key: string]: string;
}

export interface TranslationKeys {
  en: Translations;
  vi: Translations;
}