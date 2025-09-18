"use client";

import React, { createContext, useContext, ReactNode } from "react";
import useLanguageStore, { 
  type Language as StoreLanguage, 
  type TranslationKey 
} from "@/store/language";

type UiLanguage = "en" | "it" | "de" | "fr"; // UI accepts lowercase codes

interface LanguageContextType {
  t: (key: TranslationKey) => string;
  isRTL: boolean;
  language: UiLanguage;
  setLanguage: (lang: UiLanguage | StoreLanguage) => void;
  cycleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function toStoreCode(lang: string): StoreLanguage {
  const upper = lang.toUpperCase();
  if (upper === "EN" || upper === "IT" || upper === "DE" || upper === "FR") return upper as StoreLanguage;
  return "EN";
}

function toUiCode(lang: StoreLanguage): UiLanguage {
  return lang.toLowerCase() as UiLanguage;
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const currentLanguage = useLanguageStore((s) => s.currentLanguage);
  const setLanguageStore = useLanguageStore((s) => s.setLanguage);
  const getTranslation = useLanguageStore((s) => s.getTranslation);

  const setLanguage = (lang: UiLanguage | StoreLanguage) => {
    setLanguageStore(toStoreCode(lang));
  };

  const cycleLanguage = () => {
    const order: StoreLanguage[] = ["EN", "IT", "DE", "FR"];
    const idx = order.indexOf(currentLanguage);
    const next = order[(idx + 1) % order.length];
    setLanguageStore(next);
  };

  const t = (key: TranslationKey) => getTranslation(key);
  const isRTL = false; // Corrected: German (DE) and Italian (IT) are not RTL languages
  const uiLanguage = toUiCode(currentLanguage);

  return (
    <LanguageContext.Provider value={{ t, isRTL, language: uiLanguage, setLanguage, cycleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
