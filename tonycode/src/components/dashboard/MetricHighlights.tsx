import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlarmClock,
  Droplet,
  Moon,
  Brain,
  Footprints,
} from "lucide-react";
import { TrackerData } from "@/types/tracker";
import { getMetricProgress } from "@/utils/scoreCalculator";

const METRIC_DEFINITIONS = {
  fasting: {
    label: "Fasting",
    icon: AlarmClock,
    accent: "from-emerald-500/20 to-emerald-500/5",
    formatValue: (value: TrackerData["fasting"]) =>
      `${value.completedHours.toFixed(1)}h`,
    formatTarget: (value: TrackerData["fasting"]) => `${value.goalHours}h`,
  },
  water: {
    label: "Hydration",
    icon: Droplet,
    accent: "from-sky-500/20 to-sky-500/5",
    formatValue: (value: TrackerData["water"]) => `${value.current}ml`,
    formatTarget: (value: TrackerData["water"]) => `${value.target}ml`,
  },
  sleep: {
    label: "Sleep",
    icon: Moon,
    accent: "from-indigo-500/20 to-indigo-500/5",
    formatValue: (value: TrackerData["sleep"]) => `${value.hoursSlept}h`,
    formatTarget: (value: TrackerData["sleep"]) => `${value.target}h`,
  },
  mindfulness: {
    label: "Mindfulness",
    icon: Brain,
    accent: "from-purple-500/20 to-purple-500/5",
    formatValue: (value: TrackerData["mindfulness"]) =>
      value.isComplete
        ? "Session complete"
        : `${value.minutes}min`,
    formatTarget: (value: TrackerData["mindfulness"]) => `${value.target}min`,
  },
  steps: {
    label: "Steps",
    icon: Footprints,
    accent: "from-orange-500/20 to-orange-500/5",
    formatValue: (value: TrackerData["steps"]) =>
      value.current.toLocaleString(),
    formatTarget: (value: TrackerData["steps"]) =>
      value.target.toLocaleString(),
  },
} as const;

type MetricHighlightsProps = {
  trackerData: TrackerData;
};

export function MetricHighlights({ trackerData }: MetricHighlightsProps) {
  const progress = getMetricProgress(trackerData);

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {(Object.keys(METRIC_DEFINITIONS) as Array<keyof typeof METRIC_DEFINITIONS>)
        .map((key) => {
          const config = METRIC_DEFINITIONS[key];
          const Icon = config.icon;
          const percentage = Math.round(progress[key] * 100);
          const value = trackerData[key as keyof TrackerData];
          
          return (
            <Card
              key={key}
              className="relative overflow-hidden rounded-2xl border-0 bg-card shadow-card"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${config.accent}`}
                aria-hidden="true"
              />
              <div className="relative space-y-4 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {config.label}
                    </p>
                    <p className="text-xl font-semibold text-foreground">
                      {config.formatValue(value as never)}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground">
                      Goal: {config.formatTarget(value as never)}
                    </p>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-primary shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{percentage}% complete</span>
                    <span>Remaining: {Math.max(0, 100 - percentage)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              </div>
            </Card>
          );
        })}
    </section>
  );
}
