import { Languages } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative">
      <button
        onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        className="flex items-center gap-2 px-3 py-2 bg-white/70 backdrop-blur-sm rounded-lg border border-pink-200 text-gray-700 hover:bg-white hover:border-pink-300 transition-all duration-200"
      >
        <Languages className="w-4 h-4" />
        <span className="text-sm font-medium">
          {language === 'en' ? 'العربية' : 'English'}
        </span>
      </button>
    </div>
  );
}
