import { Brain, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackerData } from "@/types/tracker";

interface MindfulnessTrackerProps {
  data: TrackerData["mindfulness"];
  onUpdate: (data: TrackerData["mindfulness"]) => void;
}

export function MindfulnessTracker({ data, onUpdate }: MindfulnessTrackerProps) {
  const adjustMinutes = (minutes: number) => {
    onUpdate({
      ...data,
      minutes: Math.max(0, data.minutes + minutes),
    });
  };

  const adjustTarget = (minutes: number) => {
    onUpdate({
      ...data,
      target: Math.max(5, data.target + minutes),
    });
  };

  const toggleComplete = () => {
    onUpdate({ ...data, isComplete: !data.isComplete });
  };

  const progress = Math.min((data.minutes / data.target) * 100, 100);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Mindfulness</h3>
        </div>
        {data.isComplete && (
          <div className="bg-success/10 text-success rounded-full p-1">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-2xl font-bold text-foreground">{data.minutes}min</span>
          <span className="text-sm text-muted-foreground">of {data.target}min</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-secondary transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <Button onClick={() => adjustMinutes(5)} variant="outline" size="sm">
          +5min
        </Button>
        <Button onClick={() => adjustMinutes(10)} variant="outline" size="sm">
          +10min
        </Button>
        <Button onClick={() => adjustMinutes(15)} variant="outline" size="sm">
          +15min
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <Button onClick={() => adjustMinutes(-5)} variant="outline" size="sm">
          -5min
        </Button>
        <Button onClick={() => adjustMinutes(-10)} variant="outline" size="sm">
          -10min
        </Button>
        <Button onClick={() => adjustMinutes(-15)} variant="outline" size="sm">
          -15min
        </Button>
      </div>

      <Button
        onClick={toggleComplete}
        variant={data.isComplete ? "outline" : "default"}
        className="w-full mb-4"
      >
        {data.isComplete ? "Mark Incomplete" : "Mark Complete"}
      </Button>

      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-foreground mb-2">
          Daily target: {data.target} minutes
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTarget(-5)}
            className="flex-1"
          >
            -5min
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTarget(5)}
            className="flex-1"
          >
            +5min
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTarget(10)}
            className="flex-1"
          >
            +10min
          </Button>
        </div>
      </div>
    </div>
  );
}
