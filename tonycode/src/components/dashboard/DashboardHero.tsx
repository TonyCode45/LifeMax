import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, BellRing, Sparkles } from "lucide-react";

interface DashboardHeroProps {
  score: number;
  completedMetrics: number;
  totalMetrics: number;
  userName?: string;
}

export function DashboardHero({
  score,
  completedMetrics,
  totalMetrics,
  userName,
}: DashboardHeroProps) {
  const navigate = useNavigate();
  const completionPercent = Math.round((completedMetrics / totalMetrics) * 100);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 via-primary to-accent/80 text-white shadow-elevated">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_transparent_55%)]" />
      <div className="relative px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              {completedMetrics === totalMetrics
                ? "All goals completed"
                : `${completedMetrics}/${totalMetrics} habits completed today`}
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {userName ? `Welcome back, ${userName}!` : "Your wellness snapshot"}
            </h2>
            <p className="text-base text-white/85 sm:text-lg">
              Keep stacking small wins. Your daily score is updated in real-time as
              you log progress across fasting, hydration, sleep, mindfulness, and steps.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base">
              <div>
                <p className="font-semibold">Daily Score</p>
                <p className="text-3xl font-bold leading-tight sm:text-4xl">
                  {score}
                  <span className="text-sm font-medium text-white/70"> / 100</span>
                </p>
              </div>
              <div className="h-12 w-px bg-white/30" aria-hidden="true" />
              <div>
                <p className="font-semibold">Completion</p>
                <p className="text-lg font-semibold text-white/80">
                  {completionPercent}% of today&apos;s habits
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => navigate("/friends")}
              variant="secondary"
              className="backdrop-blur text-primary hover:bg-white"
            >
              <Users className="mr-2 h-4 w-4" />
              Check on friends
            </Button>
            <Button
              onClick={() => navigate("/settings")}
              className="bg-white text-primary hover:bg-white/90"
            >
              <BellRing className="mr-2 h-4 w-4" />
              Configure reminders
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
