import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Auth() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: name || 'User'
            }
          }
        });

        if (error) throw error;
        
        toast.success(t('auth.accountCreated'));
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;
        
        toast.success(t('auth.welcomeMessage'));
        navigate('/');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md glass-card rounded-card shadow-float border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2">
            {isSignUp ? t('auth.createAccount') : t('auth.welcomeBack')}
          </CardTitle>
          <CardDescription>
            {isSignUp ? t('auth.joinMessage') : t('auth.signInMessage')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <Input
                  type="text"
                  placeholder={t('auth.name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-button tap-effect border-0 bg-muted/50 focus:shadow-glow transition-shadow"
                  aria-label={t('auth.name')}
                />
              </div>
            )}
            <div>
              <Input
                type="email"
                placeholder={t('auth.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-button tap-effect border-0 bg-muted/50 focus:shadow-glow transition-shadow"
                aria-label={t('auth.email')}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder={t('auth.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="rounded-button tap-effect border-0 bg-muted/50 focus:shadow-glow transition-shadow"
                aria-label={t('auth.password')}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full tap-effect rounded-button shadow-card bg-gradient-primary hover:shadow-glow" 
              disabled={loading}
            >
              {loading ? t('common.loading') : isSignUp ? t('auth.signUp') : t('auth.signIn')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded tap-effect"
            >
              {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.noAccount')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
