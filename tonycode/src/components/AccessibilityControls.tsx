import { useTranslation } from 'react-i18next';
import { Eye, Type, Wind } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEffect } from 'react';

export function AccessibilityControls() {
  const { t } = useTranslation();
  const [highContrast, setHighContrast] = useLocalStorage('highContrast', false);
  const [largeText, setLargeText] = useLocalStorage('largeText', false);
  const [reducedMotion, setReducedMotion] = useLocalStorage('reducedMotion', false);

  useEffect(() => {
    // Apply high contrast
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply large text
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }

    // Apply reduced motion
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [highContrast, largeText, reducedMotion]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">{t('settings.accessibility')}</h2>
      </div>

      {/* High Contrast */}
      <div className="flex items-center justify-between p-card-compact glass-card rounded-button">
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-primary" />
          <Label htmlFor="high-contrast" className="flex flex-col gap-1 cursor-pointer">
            <span className="font-medium">{t('settings.highContrast')}</span>
            <span className="text-sm text-muted-foreground">
              Increase contrast for better visibility
            </span>
          </Label>
        </div>
        <Switch
          id="high-contrast"
          checked={highContrast}
          onCheckedChange={setHighContrast}
          className="tap-effect"
          aria-label={t('settings.highContrast')}
        />
      </div>

      {/* Large Text */}
      <div className="flex items-center justify-between p-card-compact glass-card rounded-button">
        <div className="flex items-center gap-3">
          <Type className="w-5 h-5 text-primary" />
          <Label htmlFor="large-text" className="flex flex-col gap-1 cursor-pointer">
            <span className="font-medium">{t('settings.largeText')}</span>
            <span className="text-sm text-muted-foreground">
              Increase text size throughout the app
            </span>
          </Label>
        </div>
        <Switch
          id="large-text"
          checked={largeText}
          onCheckedChange={setLargeText}
          className="tap-effect"
          aria-label={t('settings.largeText')}
        />
      </div>

      {/* Reduced Motion */}
      <div className="flex items-center justify-between p-card-compact glass-card rounded-button">
        <div className="flex items-center gap-3">
          <Wind className="w-5 h-5 text-primary" />
          <Label htmlFor="reduced-motion" className="flex flex-col gap-1 cursor-pointer">
            <span className="font-medium">{t('settings.reducedMotion')}</span>
            <span className="text-sm text-muted-foreground">
              Minimize animations and transitions
            </span>
          </Label>
        </div>
        <Switch
          id="reduced-motion"
          checked={reducedMotion}
          onCheckedChange={setReducedMotion}
          className="tap-effect"
          aria-label={t('settings.reducedMotion')}
        />
      </div>
    </div>
  );
}
