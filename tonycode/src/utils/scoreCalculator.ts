import { TrackerData } from "@/types/tracker";

export type MetricKey = "fasting" | "sleep" | "water" | "mindfulness" | "steps";

export function calculateDailyScore(data: TrackerData): number {
  const progress = getMetricProgress(data);

  const weightedScore =
    progress.fasting * 0.3 +
    progress.sleep * 0.25 +
    progress.water * 0.2 +
    progress.mindfulness * 0.15 +
    progress.steps * 0.1;

  return Math.round(weightedScore * 100);
}

export function getMetricProgress(data: TrackerData) {
  const fastingHours = getFastingHours(data.fasting);
  const fastingProgress = Math.min(fastingHours / data.fasting.goalHours, 1);

  const sleepProgress = Math.min(
    data.sleep.hoursSlept / Math.max(1, data.sleep.target),
    1
  );

  const waterProgress = Math.min(
    data.water.current / Math.max(1, data.water.target),
    1
  );

  const mindfulnessProgress = Math.min(
    data.mindfulness.isComplete
      ? 1
      : data.mindfulness.minutes / Math.max(1, data.mindfulness.target),
    1
  );

  const stepsProgress = Math.min(
    data.steps.current / Math.max(1, data.steps.target),
    1
  );

  return {
    fasting: Number.isFinite(fastingProgress) ? fastingProgress : 0,
    sleep: Number.isFinite(sleepProgress) ? sleepProgress : 0,
    water: Number.isFinite(waterProgress) ? waterProgress : 0,
    mindfulness: Number.isFinite(mindfulnessProgress) ? mindfulnessProgress : 0,
    steps: Number.isFinite(stepsProgress) ? stepsProgress : 0,
  } as Record<MetricKey, number>;
}

export function getMetricCompletion(data: TrackerData) {
  const progress = getMetricProgress(data);
  return Object.fromEntries(
    Object.entries(progress).map(([key, value]) => [key, value >= 1])
  ) as Record<MetricKey, boolean>;
}

function getFastingHours(fasting: TrackerData["fasting"]) {
  const accrued = fasting.completedHours ?? 0;
  if (fasting.isActive && fasting.startTime) {
    return accrued + (Date.now() - fasting.startTime) / (1000 * 60 * 60);
  }
  return accrued;
}
