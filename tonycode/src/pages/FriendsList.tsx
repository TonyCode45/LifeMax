import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useFriends } from '@/hooks/useFriends';
import { FriendCard } from '@/components/friends/FriendCard';
import { NudgeSheet } from '@/components/friends/NudgeSheet';
import { toast } from 'sonner';

export default function FriendsList() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [nudgeSheetOpen, setNudgeSheetOpen] = useState(false);
  const [nudgeCooldowns, setNudgeCooldowns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
      return;
    }
    setUser(user);
  };

  const { friends, loading } = useFriends(user?.id);

  const handleNudgeClick = (friendId: string) => {
    if (nudgeCooldowns[friendId]) {
      toast.error(t('friends.nudgeCooldown'));
      return;
    }
    setSelectedFriend(friendId);
    setNudgeSheetOpen(true);
  };

  const sendNudge = async (type: 'hydrate' | 'walk' | 'sleep' | 'encourage') => {
    if (!selectedFriend || !user) return;

    try {
      const { error } = await supabase
        .from('nudges')
        .insert({
          from_user_id: user.id,
          to_user_id: selectedFriend,
          nudge_type: type
        });

      if (error) throw error;

      const emojis = {
        hydrate: '💧',
        walk: '👣',
        sleep: '😴',
        encourage: '🌟'
      };

      toast.success(`${t('friends.nudgeSent')} ${emojis[type]}`, {
        description: t('friends.nudgeNotified')
      });

      setNudgeCooldowns(prev => ({ ...prev, [selectedFriend]: true }));
      setTimeout(() => {
        setNudgeCooldowns(prev => ({ ...prev, [selectedFriend]: false }));
      }, 60000);

    } catch (error: any) {
      console.error('Error sending nudge:', error);
      toast.error('Failed to send nudge');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-glow text-primary">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 glass-card backdrop-blur-glass border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-card py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="tap-effect" aria-label={t('common.back')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">{t('friends.title')}</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => navigate('/friends/settings')} className="tap-effect" aria-label={t('friends.settings')}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-card">
        {friends.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary/10 flex items-center justify-center mb-4 shadow-glow">
                <span className="text-5xl">👥</span>
              </div>
              <p className="text-muted-foreground mb-6 text-lg">{t('friends.noFriends')}</p>
            </div>
            <Button 
              onClick={() => navigate('/friends/settings')} 
              className="tap-effect rounded-button shadow-elevated bg-gradient-primary hover:shadow-glow"
            >
              {t('friends.addFriends')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up">
            {friends.map((friend, index) => (
              <div
                key={friend.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FriendCard
                  friend={friend}
                  onNudge={handleNudgeClick}
                  nudgeCooldown={!!nudgeCooldowns[friend.id]}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <NudgeSheet
        open={nudgeSheetOpen}
        onOpenChange={setNudgeSheetOpen}
        onSelectNudge={sendNudge}
      />
    </div>
  );
}
