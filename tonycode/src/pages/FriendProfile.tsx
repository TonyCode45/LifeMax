import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserStatsHistory } from '@/types/friends';
import { toast } from 'sonner';
import { NudgeSheet } from '@/components/friends/NudgeSheet';

export default function FriendProfile() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [friend, setFriend] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStatsHistory | null>(null);
  const [weekHistory, setWeekHistory] = useState<UserStatsHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [nudgeSheetOpen, setNudgeSheetOpen] = useState(false);
  const [nudgeCooldown, setNudgeCooldown] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [friendId]);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }
      setCurrentUser(user);

      // Load friend profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', friendId)
        .single();

      if (profileError) throw profileError;
      setFriend(profileData);

      // Load today's stats
      const today = new Date().toISOString().split('T')[0];
      const { data: todayStats } = await supabase
        .from('user_stats_history')
        .select('*')
        .eq('user_id', friendId)
        .eq('date', today)
        .maybeSingle();

      setStats(todayStats);

      // Load last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: historyData } = await supabase
        .from('user_stats_history')
        .select('*')
        .eq('user_id', friendId)
        .gte('date', weekAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      setWeekHistory(historyData || []);
    } catch (error: any) {
      console.error('Error loading friend profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const sendNudge = async (type: 'hydrate' | 'walk' | 'sleep' | 'encourage') => {
    if (!friendId || !currentUser) return;

    try {
      const { error } = await supabase
        .from('nudges')
        .insert({
          from_user_id: currentUser.id,
          to_user_id: friendId,
          nudge_type: type
        });

      if (error) throw error;

      const emojis = {
        hydrate: '💧',
        walk: '👣',
        sleep: '😴',
        encourage: '🌟'
      };

      toast.success(`Nudge sent ${emojis[type]}`);
      setNudgeCooldown(true);
      setTimeout(() => setNudgeCooldown(false), 60000);
    } catch (error: any) {
      console.error('Error sending nudge:', error);
      toast.error('Failed to send nudge');
    }
  };

  if (loading || !friend) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-glow text-primary">Loading...</div>
      </div>
    );
  }

  const score = stats?.daily_score || 0;
  const showExact = friend.privacy_share_exact_numbers;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getMessage = (score: number) => {
    if (score >= 90) return "Outstanding work! 🌟";
    if (score >= 75) return "Great progress! 💪";
    if (score >= 50) return "Keep going! 👍";
    if (score > 0) return "You've got this! 🚀";
    return "Start your journey! ✨";
  };

  const statsCards = [
    {
      emoji: '⏱️',
      label: 'Fasting',
      value: showExact ? `${stats?.fasting_hours || 0}h` : `${Math.round((stats?.fasting_hours || 0) / 16 * 100)}%`,
      target: showExact ? '16h' : '100%',
      progress: (stats?.fasting_hours || 0) / 16 * 100,
      streak: stats?.fasting_streak || 0
    },
    {
      emoji: '😴',
      label: 'Sleep',
      value: showExact ? `${stats?.sleep_hours || 0}h` : `${Math.round((stats?.sleep_hours || 0) / 8 * 100)}%`,
      target: showExact ? '8h' : '100%',
      progress: (stats?.sleep_hours || 0) / 8 * 100,
      streak: stats?.sleep_streak || 0
    },
    {
      emoji: '💧',
      label: 'Water',
      value: showExact ? `${stats?.water_ml || 0}ml` : `${Math.round((stats?.water_ml || 0) / 2500 * 100)}%`,
      target: showExact ? '2500ml' : '100%',
      progress: (stats?.water_ml || 0) / 2500 * 100,
      streak: 0
    },
    {
      emoji: '🧘',
      label: 'Mindfulness',
      value: showExact ? `${stats?.mindfulness_minutes || 0}min` : `${Math.round((stats?.mindfulness_minutes || 0) / 20 * 100)}%`,
      target: showExact ? '20min' : '100%',
      progress: (stats?.mindfulness_minutes || 0) / 20 * 100,
      streak: stats?.mindfulness_streak || 0
    },
    {
      emoji: '👣',
      label: 'Steps',
      value: showExact ? `${stats?.steps || 0}` : `${Math.round((stats?.steps || 0) / 10000 * 100)}%`,
      target: showExact ? '10k' : '100%',
      progress: (stats?.steps || 0) / 10000 * 100,
      streak: stats?.steps_streak || 0
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 glass-card backdrop-blur-glass border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-card py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/friends')} className="tap-effect">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shadow-card ring-2 ring-border/50">
                <AvatarImage src={friend.avatar_url} />
                <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                  {friend.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">{friend.name}</h1>
                <span className="text-xs text-muted-foreground">
                  {friend.language === 'en' ? '🇺🇸' : '🌍'}
                </span>
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setNudgeSheetOpen(true)}
            disabled={nudgeCooldown}
            className="tap-effect rounded-button shadow-card hover:shadow-glow-accent"
          >
            {nudgeCooldown ? '⏱️' : '👋'} Nudge
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-card space-y-section animate-fade-in-up">
        {!showExact && (
          <Card className="glass-card rounded-card border-dashed border-2 border-muted shadow-sm animate-scale-in">
            <CardContent className="pt-card flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Privacy mode: Showing percentages only</span>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-wellness text-white rounded-card shadow-float border-0 animate-scale-in">
          <CardContent className="pt-card">
            <div className="flex flex-col items-center">
              <p className="text-sm opacity-90 mb-2">{getMessage(score)}</p>
              
              <div className="relative mb-4">
                <svg className="transform -rotate-90" width="200" height="200">
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out drop-shadow-2xl"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-bold drop-shadow-lg">{score}</span>
                  <span className="text-sm opacity-80">Daily Score</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {statsCards.map((stat, i) => (
            <Card 
              key={i} 
              className="glass-card rounded-card shadow-elevated border-0 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{stat.emoji}</span>
                  <span>{stat.label}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{stat.value}</span>
                  <span className="text-muted-foreground">/ {stat.target}</span>
                </div>
                <Progress value={Math.min(stat.progress, 100)} className="h-2 animate-progress-fill" />
                {stat.streak > 0 && (
                  <div className="flex items-center gap-1 text-xs text-primary animate-scale-in">
                    <span>🔥</span>
                    <span className="font-medium">{stat.streak} day streak</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {weekHistory.length > 0 && (
          <Card className="glass-card rounded-card shadow-elevated border-0 animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-xl">7-Day History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weekHistory.map((day, index) => (
                  <div 
                    key={day.date} 
                    className="flex items-center gap-3 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <span className="text-sm text-muted-foreground w-20">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1">
                      <Progress value={day.daily_score} className="h-2" />
                    </div>
                    <span className="text-sm font-medium w-10 text-right">
                      {day.daily_score}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
