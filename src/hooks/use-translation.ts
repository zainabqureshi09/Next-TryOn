"use client";

import { useLanguage } from "@/contexts/LanguageContext";

function useTranslationHook() {
  const { t, language, setLanguage, isRTL } = useLanguage();
  return { t, currentLanguage: language, setLanguage, isRTL };
}

export default useTranslationHook;
export { useTranslationHook as useTranslation };
