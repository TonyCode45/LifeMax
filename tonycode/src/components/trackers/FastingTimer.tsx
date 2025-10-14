import { useState, useEffect } from "react";
import { Play, Pause, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackerData } from "@/types/tracker";

interface FastingTimerProps {
  data: TrackerData["fasting"];
  onUpdate: (data: TrackerData["fasting"]) => void;
}

export function FastingTimer({ data, onUpdate }: FastingTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!data.isActive || !data.startTime) return;

    const interval = setInterval(() => {
      setElapsed(Date.now() - data.startTime!);
    }, 1000);

    return () => clearInterval(interval);
  }, [data.isActive, data.startTime]);

  const toggleTimer = () => {
    if (data.isActive) {
      if (data.startTime) {
        const completedHours = (Date.now() - data.startTime) / (1000 * 60 * 60);
        onUpdate({
          ...data,
          isActive: false,
          startTime: null,
          completedHours,
        });
      } else {
        onUpdate({ ...data, isActive: false, startTime: null });
      }
      setElapsed(0);
    } else {
      onUpdate({
        ...data,
        isActive: true,
        startTime: Date.now(),
        completedHours: 0,
      });
    }
  };

  const adjustGoal = (minutes: number) => {
    const newGoalHours = Math.max(1, data.goalHours + minutes / 60);
    onUpdate({ ...data, goalHours: newGoalHours });
  };

  const hoursElapsed = elapsed / (1000 * 60 * 60);
  const totalHours = data.completedHours + hoursElapsed;
  const progress = Math.min((totalHours / data.goalHours) * 100, 100);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Fasting Timer</h3>
        </div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          <svg className="transform -rotate-90" width="140" height="140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="hsl(var(--muted))"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="hsl(var(--primary))"
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">
              {data.isActive
                ? formatTime(elapsed)
                : formatTime(data.completedHours * 60 * 60 * 1000)}
            </span>
            <span className="text-xs text-muted-foreground">
              of {data.goalHours}h
            </span>
          </div>
        </div>

        <Button
          onClick={toggleTimer}
          className="w-full mb-4"
          variant={data.isActive ? "destructive" : "default"}
        >
          {data.isActive ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Stop Fast
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Fast
            </>
          )}
        </Button>
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-foreground mb-2">Goal: {data.goalHours} hours</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustGoal(-15)}
            className="flex-1"
          >
            -15m
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustGoal(-60)}
            className="flex-1"
          >
            -1h
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustGoal(15)}
            className="flex-1"
          >
            +15m
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustGoal(60)}
            className="flex-1"
          >
            +1h
          </Button>
        </div>
      </div>
    </div>
  );
}
