import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    // Set document direction based on language
    const currentLang = languages.find(lang => lang.code === i18n.language);
    document.documentElement.dir = currentLang?.dir || 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="flex items-center gap-3">
      <Globe className="w-5 h-5 text-primary" />
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{t('settings.language')}</h3>
        <p className="text-sm text-muted-foreground">{t('settings.chooseLanguage')}</p>
      </div>
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger className="w-[180px] rounded-button tap-effect">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{currentLanguage.flag}</span>
              <span>{currentLanguage.name}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-card glass-card border-0 shadow-elevated">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.code} 
              value={lang.code}
              className="rounded-button focus:bg-primary/10 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
                {lang.dir === 'rtl' && <span className="text-xs text-muted-foreground">RTL</span>}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
