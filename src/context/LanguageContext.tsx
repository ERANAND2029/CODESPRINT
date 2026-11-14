"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (enText: string, hiText: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
  t: (enText) => enText,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  // Keep language in memory, optionally sync with window if available
  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.sessionStorage?.getItem("s2s_lang") : null;
    if (saved === "en" || saved === "hi") {
      setLang(saved);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      window.sessionStorage?.setItem("s2s_lang", newLang);
    }
  };

  const toggleLang = () => {
    handleSetLang(lang === "en" ? "hi" : "en");
  };

  const t = (enText: string, hiText: string) => {
    return lang === "hi" ? hiText : enText;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
