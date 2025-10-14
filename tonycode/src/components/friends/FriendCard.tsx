import { FriendWithStats } from '@/types/friends';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FriendCardProps {
  friend: FriendWithStats;
  onNudge: (friendId: string) => void;
  nudgeCooldown: boolean;
}

export function FriendCard({ friend, onNudge, nudgeCooldown }: FriendCardProps) {
  const navigate = useNavigate();
  const score = friend.stats?.daily_score || 0;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return 'text-primary';
    if (streak >= 3) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <Card 
      className="p-card glass-card rounded-card card-interactive cursor-pointer shadow-elevated border-0 animate-fade-in"
      onClick={() => navigate(`/friends/${friend.id}`)}
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 shadow-card ring-2 ring-border/50">
          <AvatarImage src={friend.avatar_url} />
          <AvatarFallback className="bg-gradient-primary text-white text-lg font-semibold">
            {friend.name[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{friend.name}</h3>
          
          <div className="flex items-center gap-2 mt-1.5">
            {[
              { streak: friend.stats?.fasting_streak || 0, label: 'Fast' },
              { streak: friend.stats?.sleep_streak || 0, label: 'Sleep' },
              { streak: friend.stats?.mindfulness_streak || 0, label: 'Mind' },
              { streak: friend.stats?.steps_streak || 0, label: 'Steps' }
            ].map((item, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-0.5 ${getStreakColor(item.streak)} transition-colors`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">{item.streak}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <svg width="70" height="70" className="transform -rotate-90">
              <circle
                cx="35"
                cy="35"
                r={radius}
                stroke="hsl(var(--muted))"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="35"
                cy="35"
                r={radius}
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out drop-shadow-glow"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                {score}
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onNudge(friend.id);
            }}
            disabled={nudgeCooldown}
            className="text-xs tap-effect rounded-button shadow-sm hover:shadow-glow-accent transition-all"
          >
            {nudgeCooldown ? '⏱️ Wait' : '👋 Nudge'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
