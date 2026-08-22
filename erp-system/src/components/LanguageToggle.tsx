"use client";

import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";

export default function LanguageToggle({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();

  const toggleLanguage = () => {
    const newLocale = currentLocale === "en" ? "el" : "en";
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.refresh(); // Refresh the Server Components with the new cookie
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-white/[0.1] bg-slate-100 hover:bg-slate-200 transition-colors text-xs font-bold text-slate-900 uppercase"
    >
      <Globe className="w-4 h-4 text-indigo-400" />
      {currentLocale === "en" ? "ΕΛ" : "EN"}
    </button>
  );
}



