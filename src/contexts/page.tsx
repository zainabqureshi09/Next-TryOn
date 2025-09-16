"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// ✅ Apni supported languages yahan list karo
type Language = "en" | "ur" | "ar" | "hi" | "fr" | "de";

interface LanguageContextType {
  t: any;
  isRTL: any;
  language: Language;
  setLanguage: (lang: Language) => void;
  cycleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const supportedLanguages: Language[] = ["en", "ur", "ar", "hi", "fr", "de"];
  const [language, setLanguage] = useState<Language>("en");

  const cycleLanguage = () => {
    setLanguage((prev) => {
      const currentIndex = supportedLanguages.indexOf(prev);
      const nextIndex = (currentIndex + 1) % supportedLanguages.length;
      return supportedLanguages[nextIndex];
    });
  };

  // Dummy translation function and RTL check for demonstration
  const t = (key: string) => key; // Replace with actual translation logic
  const isRTL = language === "ar" || language === "ur";

  return (
    <LanguageContext.Provider value={{ t, isRTL, language, setLanguage, cycleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );

}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
