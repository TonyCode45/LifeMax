import { Footprints, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackerData } from "@/types/tracker";

interface StepsTrackerProps {
  data: TrackerData["steps"];
  onUpdate: (data: TrackerData["steps"]) => void;
}

export function StepsTracker({ data, onUpdate }: StepsTrackerProps) {
  const addSteps = (amount: number) => {
    onUpdate({
      ...data,
      current: data.current + amount,
      history: [...data.history, amount],
    });
  };

  const undoSteps = () => {
    if (data.history.length === 0) return;
    const lastAmount = data.history[data.history.length - 1];
    onUpdate({
      ...data,
      current: Math.max(0, data.current - lastAmount),
      history: data.history.slice(0, -1),
    });
  };

  const adjustTarget = (amount: number) => {
    onUpdate({ ...data, target: Math.max(1000, data.target + amount) });
  };

  const progress = Math.min((data.current / data.target) * 100, 100);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Footprints className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Steps</h3>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-2xl font-bold text-foreground">
            {data.current.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">
            of {data.target.toLocaleString()}
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-primary transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2">
        <Button onClick={() => addSteps(100)} variant="outline" size="sm">
          +100
        </Button>
        <Button onClick={() => addSteps(500)} variant="outline" size="sm">
          +500
        </Button>
        <Button onClick={() => addSteps(1000)} variant="outline" size="sm">
          +1k
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button onClick={() => addSteps(2500)} variant="outline" size="sm">
          +2.5k
        </Button>
        <Button onClick={() => addSteps(5000)} variant="outline" size="sm">
          +5k
        </Button>
      </div>

      <Button
        onClick={undoSteps}
        variant="ghost"
        size="sm"
        className="w-full mb-4"
        disabled={data.history.length === 0}
      >
        <Undo2 className="w-4 h-4 mr-2" />
        Undo Last
      </Button>

      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-foreground mb-2">
          Daily target: {data.target.toLocaleString()} steps
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTarget(-1000)}
            className="flex-1"
          >
            -1k
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTarget(1000)}
            className="flex-1"
          >
            +1k
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustTarget(2500)}
            className="flex-1"
          >
            +2.5k
          </Button>
        </div>
      </div>
    </div>
  );
}
