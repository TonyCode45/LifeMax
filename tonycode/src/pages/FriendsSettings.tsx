import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Copy, UserPlus, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useFriendRequests } from '@/hooks/useFriends';

export default function FriendsSettings() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [inviteCode, setInviteCode] = useState('');
  const [friendCode, setFriendCode] = useState('');
  const [shareExactNumbers, setShareExactNumbers] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }
      setUser(user);

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(profileData);
      setInviteCode(profileData.invite_code);
      setShareExactNumbers(profileData.privacy_share_exact_numbers);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const { incoming, outgoing, acceptRequest, declineRequest, cancelRequest, refetch } = useFriendRequests(user?.id);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success(t('friends.codeCopied'));
  };

  const shareInviteCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join me on ${t('app.name')}!`,
          text: `Use my code ${inviteCode} to connect on ${t('app.name')}`,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      copyInviteCode();
    }
  };

  const addFriend = async () => {
    if (!friendCode.trim()) {
      toast.error(t('friends.enterCode'));
      return;
    }

    try {
      const { data: friendProfile, error: findError } = await supabase
        .from('profiles')
        .select('id')
        .eq('invite_code', friendCode.toUpperCase())
        .single();

      if (findError || !friendProfile) {
        toast.error(t('friends.invalidCode'));
        return;
      }

      if (friendProfile.id === user.id) {
        toast.error(t('friends.cantAddSelf'));
        return;
      }

      const { error: requestError } = await supabase
        .from('friend_requests')
        .insert({
          from_user_id: user.id,
          to_user_id: friendProfile.id,
          status: 'pending'
        });

      if (requestError) {
        if (requestError.code === '23505') {
          toast.error(t('friends.alreadySent'));
        } else {
          throw requestError;
        }
        return;
      }

      toast.success(t('friends.requestSent'));
      setFriendCode('');
      refetch();
    } catch (error: any) {
      console.error('Error adding friend:', error);
      toast.error('Failed to send friend request');
    }
  };

  const updatePrivacy = async (value: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ privacy_share_exact_numbers: value })
        .eq('id', user.id);

      if (error) throw error;

      setShareExactNumbers(value);
      toast.success('Privacy settings updated');
    } catch (error: any) {
      console.error('Error updating privacy:', error);
      toast.error('Failed to update settings');
    }
  };

  if (loading) {
    return <div className="p-6 animate-pulse-glow">{t('common.loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 glass-card backdrop-blur-glass border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-card py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} className="tap-effect" aria-label={t('common.back')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t('friends.settings')}</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-card space-y-section animate-fade-in-up">
        <Card className="glass-card rounded-card shadow-elevated border-0">
          <CardHeader>
            <CardTitle className="text-xl">{t('friends.myInviteCode')}</CardTitle>
            <CardDescription>{t('friends.shareCode')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={inviteCode}
              readOnly
              className="text-2xl font-mono text-center tracking-wider rounded-button bg-muted/50 border-0"
              aria-label={t('friends.myInviteCode')}
            />
            <div className="flex gap-2">
              <Button onClick={copyInviteCode} className="flex-1 tap-effect rounded-button shadow-card" variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                {t('friends.copy')}
              </Button>
              <Button onClick={shareInviteCode} className="flex-1 tap-effect rounded-button shadow-card bg-gradient-primary hover:shadow-glow">
                <Share2 className="h-4 w-4 mr-2" />
                {t('friends.share')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card rounded-card shadow-elevated border-0">
          <CardHeader>
            <CardTitle className="text-xl">{t('friends.addByCode')}</CardTitle>
            <CardDescription>{t('friends.enterCode')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
              placeholder={t('friends.enterCodePlaceholder')}
              className="text-lg font-mono text-center tracking-wider rounded-button bg-muted/50 border-0"
              aria-label={t('friends.addByCode')}
            />
            <Button onClick={addFriend} className="w-full tap-effect rounded-button shadow-card bg-gradient-primary hover:shadow-glow">
              <UserPlus className="h-4 w-4 mr-2" />
              {t('friends.sendRequest')}
            </Button>
          </CardContent>
        </Card>

        {incoming.length > 0 && (
          <Card className="glass-card rounded-card shadow-elevated border-0 animate-scale-in">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                {t('friends.incomingRequests')}
                <span className="text-sm px-2 py-0.5 bg-accent/20 text-accent rounded-full">{incoming.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {incoming.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-card-compact glass-card rounded-button shadow-sm">
                  <span className="font-medium">{request.from_user.name}</span>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => acceptRequest(request.id)} className="tap-effect rounded-button shadow-card bg-success hover:shadow-glow">
                      {t('friends.accept')}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => declineRequest(request.id)} className="tap-effect rounded-button">
                      {t('friends.decline')}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {outgoing.length > 0 && (
          <Card className="glass-card rounded-card shadow-elevated border-0 animate-scale-in">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                {t('friends.outgoingRequests')}
                <span className="text-sm px-2 py-0.5 bg-muted text-muted-foreground rounded-full">{outgoing.length}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {outgoing.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-card-compact glass-card rounded-button shadow-sm">
                  <span className="font-medium">{request.to_user.name}</span>
                  <Button size="sm" variant="outline" onClick={() => cancelRequest(request.id)} className="tap-effect rounded-button">
                    {t('common.cancel')}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="glass-card rounded-card shadow-elevated border-0">
          <CardHeader>
            <CardTitle className="text-xl">{t('friends.privacySettings')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-card-compact">
              <Label htmlFor="share-exact" className="flex flex-col gap-1 cursor-pointer">
                <span className="font-medium">{t('friends.shareExactNumbers')}</span>
                <span className="text-sm text-muted-foreground">
                  {t('friends.shareExactDesc')}
                </span>
              </Label>
              <Switch
                id="share-exact"
                checked={shareExactNumbers}
                onCheckedChange={updatePrivacy}
                className="tap-effect"
                aria-label={t('friends.shareExactNumbers')}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full tap-effect rounded-button shadow-card hover:shadow-elevated"
          onClick={() => navigate('/friends')}
        >
          {t('friends.viewFriendsList')}
        </Button>
      </main>
    </div>
  );
}
