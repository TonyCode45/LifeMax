import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Droplet, Footprints, Moon, Sparkles } from 'lucide-react';

interface NudgeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectNudge: (type: 'hydrate' | 'walk' | 'sleep' | 'encourage') => void;
}

export function NudgeSheet({ open, onOpenChange, onSelectNudge }: NudgeSheetProps) {
  const nudgeOptions = [
    { type: 'hydrate' as const, icon: Droplet, label: 'Hydrate', emoji: '💧', color: 'text-blue-500' },
    { type: 'walk' as const, icon: Footprints, label: 'Walk', emoji: '👣', color: 'text-green-500' },
    { type: 'sleep' as const, icon: Moon, label: 'Sleep', emoji: '😴', color: 'text-purple-500' },
    { type: 'encourage' as const, icon: Sparkles, label: 'Encourage', emoji: '🌟', color: 'text-yellow-500' }
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl glass-card border-0 shadow-float animate-slide-up">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl">Send a Nudge</SheetTitle>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-4 pb-6">
          {nudgeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.type}
                variant="outline"
                size="lg"
                onClick={() => {
                  onSelectNudge(option.type);
                  onOpenChange(false);
                }}
                className="h-28 flex flex-col gap-3 tap-effect rounded-card border-0 glass-card shadow-card hover:shadow-elevated transition-all group"
              >
                <div className="relative">
                  <Icon className={`h-10 w-10 ${option.color} group-hover:scale-110 transition-transform`} />
                  <div className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition-opacity">
                    <Icon className={`h-10 w-10 ${option.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-bounce-subtle">{option.emoji}</span>
                  <span className="font-semibold text-base">{option.label}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
