import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrackerData } from "@/types/tracker";

interface SleepTrackerProps {
  data: TrackerData["sleep"];
  onUpdate: (data: TrackerData["sleep"]) => void;
}

export function SleepTracker({ data, onUpdate }: SleepTrackerProps) {
  const adjustTarget = (hours: number) => {
    onUpdate({
      ...data,
      target: Math.max(5, Math.min(12, data.target + hours)),
    });
  };

  const progress = Math.min((data.hoursSlept / data.target) * 100, 100);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Sleep</h3>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm text-muted-foreground mb-2 block">
          Hours slept last night
        </label>
        <Input
          type="number"
          min="0"
          max="24"
          step="0.5"
          value={data.hoursSlept || ""}
          onChange={(e) =>
            onUpdate({ ...data, hoursSlept: parseFloat(e.target.value) || 0 })
          }
          className="mb-4"
          placeholder="Enter hours"
        />

        <div className="flex justify-between mb-2">
          <span className="text-2xl font-bold text-foreground">
            {data.hoursSlept}h
          </span>
          <span className="text-sm text-muted-foreground">of {data.target}h</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-secondary transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-foreground mb-2">
          Target: {data.target} hours
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTarget(-0.5)}
            className="flex-1"
          >
            -0.5h
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTarget(-1)}
            className="flex-1"
          >
            -1h
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTarget(0.5)}
            className="flex-1"
          >
            +0.5h
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTarget(1)}
            className="flex-1"
          >
            +1h
          </Button>
        </div>
      </div>
    </div>
  );
}
