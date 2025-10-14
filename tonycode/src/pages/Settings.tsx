import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Shield, User, Download, Users, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { AccessibilityControls } from "@/components/AccessibilityControls";
import { BugTestPanel } from "@/components/dev/BugTestPanel";

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const profileKey = user
    ? `profileName_${user.id}`
    : "profileName_anonymous";
  const [privacy, setPrivacy] = useLocalStorage("privacy", true);
  const [userName, setUserName] = useLocalStorage(profileKey, "");

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="flex items-center gap-4 mb-section">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="tap-effect">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{t('settings.title')}</h1>
        </div>

        <div className="space-y-4">
          {/* Upgrade Plan */}
          <div 
            className="glass-card rounded-card p-card shadow-elevated border-0 card-interactive cursor-pointer bg-gradient-to-r from-primary/10 to-accent/10"
            onClick={() => navigate('/pricing')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/pricing')}
            aria-label="Upgrade Plan"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Upgrade Plan ✨</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock premium features and insights
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="tap-effect">
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Button>
            </div>
          </div>

          {/* Friends & Social - Only show if authenticated */}
          {user && (
            <div 
              className="glass-card rounded-card p-card shadow-elevated border-0 card-interactive cursor-pointer"
              onClick={() => navigate('/friends/settings')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/friends/settings')}
              aria-label={t('friends.settings')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">{t('friends.settings')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage friends, invites, and privacy
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="tap-effect">
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {/* Sign In / Sign Out */}
          {user ? (
            <div className="glass-card rounded-card p-card shadow-elevated border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">{t('auth.signOut')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('auth.signedInAs')} {user.email}
                    </p>
                  </div>
                </div>
                <Button onClick={handleSignOut} variant="outline" className="tap-effect rounded-button">
                  {t('auth.signOut')}
                </Button>
              </div>
            </div>
          ) : (
            <div 
              className="glass-card rounded-card p-card shadow-elevated border-0 card-interactive cursor-pointer"
              onClick={() => navigate('/auth')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/auth')}
              aria-label={t('auth.signIn')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">{t('auth.signIn')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Access friends and social features
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="tap-effect">
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {/* Theme */}
          <div className="glass-card rounded-card p-card shadow-elevated border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "light" ? (
                  <Sun className="w-5 h-5 text-warning" />
                ) : (
                  <Moon className="w-5 h-5 text-accent" />
                )}
                <div>
                  <h3 className="font-semibold text-foreground">{t('settings.theme')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {theme === "light" ? t('settings.lightMode') : t('settings.darkMode')}
                  </p>
                </div>
              </div>
              <Button onClick={toggleTheme} variant="outline" className="tap-effect rounded-button">
                {t('settings.switchTo')} {theme === "light" ? t('settings.darkMode') : t('settings.lightMode')}
              </Button>
            </div>
          </div>

          {/* Language */}
          <div className="glass-card rounded-card p-card shadow-elevated border-0">
            <LanguageSwitcher />
          </div>

          {/* Accessibility */}
          <div className="glass-card rounded-card p-card shadow-elevated border-0">
            <AccessibilityControls />
          </div>

          {/* Privacy */}
          <div className="glass-card rounded-card p-card shadow-elevated border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">{t('settings.privacy')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.keepDataPrivate')}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setPrivacy(!privacy)}
                variant={privacy ? "default" : "outline"}
                className="tap-effect rounded-button"
              >
                {privacy ? t('settings.enabled') : t('settings.disabled')}
              </Button>
            </div>
          </div>

          {/* User Profile */}
          <div className="glass-card rounded-card p-card shadow-elevated border-0">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">{t('settings.userProfile')}</h3>
                <p className="text-sm text-muted-foreground">{t('settings.personalInfo')}</p>
              </div>
            </div>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={t('settings.enterName')}
              className="w-full bg-muted/50 border-0 rounded-button p-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary transition-shadow"
              aria-label={t('settings.userProfile')}
            />
          </div>

          {/* Export Data */}
          <div className="glass-card rounded-card p-card shadow-elevated border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">{t('settings.exportData')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.downloadData')}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="tap-effect rounded-button">{t('settings.export')}</Button>
            </div>
          </div>

          {/* App Info */}
          <div className="glass-card rounded-card p-card shadow-elevated border-0">
            <h3 className="font-semibold text-foreground mb-2">{t('settings.about')}</h3>
            <p className="text-sm text-muted-foreground mb-1">{t('settings.version')}</p>
            <p className="text-sm text-muted-foreground">
              {t('settings.companion')}
            </p>
          </div>
        </div>
      </div>

      {import.meta.env.DEV && (
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Developer QA</h2>
            <span className="text-sm text-muted-foreground">
              Visible because you are running in development mode
            </span>
          </div>
          <div className="glass-card rounded-card p-card shadow-elevated border-0">
            <BugTestPanel />
          </div>
        </div>
      )}
    </div>
  );
}
