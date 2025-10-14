import { Link } from "react-router-dom";
import { Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DailyScore } from "@/components/DailyScore";
import { FastingTimer } from "@/components/trackers/FastingTimer";
import { WaterTracker } from "@/components/trackers/WaterTracker";
import { SleepTracker } from "@/components/trackers/SleepTracker";
import { MindfulnessTracker } from "@/components/trackers/MindfulnessTracker";
import { StepsTracker } from "@/components/trackers/StepsTracker";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { defaultTrackerData, TrackerData } from "@/types/tracker";
import {
  calculateDailyScore,
  getMetricCompletion,
  getMetricProgress,
} from "@/utils/scoreCalculator";
import { useAuth } from "@/hooks/useAuth";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { MetricHighlights } from "@/components/dashboard/MetricHighlights";
import { WellnessInsights } from "@/components/dashboard/WellnessInsights";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";

export default function Index() {
  const { user } = useAuth();
  const profileKey = user
    ? `profileName_${user.id}`
    : "profileName_anonymous";
  const [profileName] = useLocalStorage(profileKey, "");

  const [trackerData, setTrackerData] = useLocalStorage<TrackerData>(
    "lifemax-tracker",
    defaultTrackerData
  );

  const dailyScore = calculateDailyScore(trackerData);
  const metricCompletion = getMetricCompletion(trackerData);
  const metricProgress = useMemo(
    () => getMetricProgress(trackerData),
    [trackerData]
  );

  const completedMetrics = Object.values(metricCompletion).filter(Boolean).length;
  const totalMetrics = Object.keys(metricCompletion).length;

  const insights = useMemo(() => buildInsights(metricProgress, trackerData), [
    metricProgress,
    trackerData,
  ]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(142_76%_36%/.08),_transparent_55%)] px-4 pb-24 pt-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              LifeMax
            </h1>
            <p className="text-muted-foreground">
              Your personal hub for fasting, hydration, sleep, mindfulness, and movement.
            </p>
          </div>
          <div className="flex gap-2">
            {user ? (
              <Link to="/friends">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Users className="w-5 h-5" />
                  <span className="sr-only">Navigate to friends</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="rounded-full">
                  Sign In
                </Button>
              </Link>
            )}
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="w-5 h-5" />
                <span className="sr-only">Open settings</span>
              </Button>
            </Link>
          </div>
        </div>

        <DashboardHero
          score={dailyScore}
          completedMetrics={completedMetrics}
          totalMetrics={totalMetrics}
          userName={profileName || user?.email || undefined}
        />

        <MetricHighlights trackerData={trackerData} />

        <Card className="glass-card border-0 p-6 shadow-card">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Today&apos;s trackers
            </h2>
            <p className="text-sm text-muted-foreground">
              Log progress below — everything saves instantly on this device.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FastingTimer
              data={trackerData.fasting}
              onUpdate={(fasting) =>
                setTrackerData({ ...trackerData, fasting })
              }
            />

            <WaterTracker
              data={trackerData.water}
              onUpdate={(water) =>
                setTrackerData({ ...trackerData, water })
              }
            />

            <SleepTracker
              data={trackerData.sleep}
              onUpdate={(sleep) =>
                setTrackerData({ ...trackerData, sleep })
              }
            />

            <MindfulnessTracker
              data={trackerData.mindfulness}
              onUpdate={(mindfulness) =>
                setTrackerData({ ...trackerData, mindfulness })
              }
            />

            <StepsTracker
              data={trackerData.steps}
              onUpdate={(steps) =>
                setTrackerData({ ...trackerData, steps })
              }
            />
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            <DailyScore score={dailyScore} />
            <WellnessInsights insights={insights} />
          </div>

          <Card className="glass-card border-0 p-6 shadow-card">
            <h3 className="text-lg font-semibold text-foreground">
              Need a boost?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Invite friends to keep each other accountable. Nudges and shared scores
              help everyone stay consistent.
            </p>
            <Button
              className="mt-4 w-full"
              variant="secondary"
              onClick={() => {
                if (user) {
                  window.location.href = "/friends";
                } else {
                  window.location.href = "/auth";
                }
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              {user ? "Open friends hub" : "Sign in to connect"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

function buildInsights(
  progress: ReturnType<typeof getMetricProgress>,
  data: TrackerData
) {
  const insights = [] as Array<{
    title: string;
    description: string;
    tone?: "positive" | "warning" | "info";
  }>;

  if (progress.water >= 1) {
    insights.push({
      title: "Hydration goal crushed",
      description: "Great job staying hydrated. Your body and focus will thank you.",
      tone: "positive",
    });
  } else if (progress.water < 0.5) {
    insights.push({
      title: "Time for a water break",
      description: "You are halfway to your hydration target. Grab a glass soon!",
      tone: "warning",
    });
  }

  if (progress.sleep >= 1) {
    insights.push({
      title: "Well rested",
      description: "You hit your sleep target. Keep the consistent routine going.",
      tone: "positive",
    });
  } else if (data.sleep.hoursSlept < data.sleep.target) {
    insights.push({
      title: "Plan tonight's wind-down",
      description: `Aim for ${(data.sleep.target - data.sleep.hoursSlept).toFixed(
        1
      )} more hours to reach your sleep goal.`,
      tone: "info",
    });
  }

  if (progress.steps >= 1) {
    insights.push({
      title: "Steps on fire",
      description:
        "You've met your step goal for the day. Consider a mobility stretch to recover.",
      tone: "positive",
    });
  } else if (data.steps.current < data.steps.target / 2) {
    insights.push({
      title: "Move break",
      description: "A 10-minute walk now will get you much closer to your step target.",
      tone: "warning",
    });
  }

  if (progress.mindfulness >= 1) {
    insights.push({
      title: "Mindful win",
      description:
        "Meditation complete for today. Consider journaling a quick takeaway.",
      tone: "positive",
    });
  } else if (!data.mindfulness.isComplete) {
    insights.push({
      title: "Schedule a mindfulness pause",
      description: "Five calm minutes can kickstart your focus for the afternoon.",
      tone: "info",
    });
  }

  return insights.slice(0, 4);
}
