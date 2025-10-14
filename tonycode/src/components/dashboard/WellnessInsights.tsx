import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, ThumbsUp } from "lucide-react";

type InsightTone = "positive" | "warning" | "info";

type Insight = {
  title: string;
  description: string;
  tone?: InsightTone;
};

type WellnessInsightsProps = {
  insights: Insight[];
};

const toneStyles: Record<InsightTone, string> = {
  positive: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  info: "bg-primary/10 text-primary",
};

export function WellnessInsights({ insights }: WellnessInsightsProps) {
  if (insights.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {insights.map((insight, index) => {
        const Icon = insight.tone === "warning" ? AlertTriangle : ThumbsUp;
        const toneClass = toneStyles[insight.tone ?? "info"];
        return (
          <Card
            key={`${insight.title}-${index}`}
            className="glass-card rounded-2xl border-0 p-5 shadow-card"
          >
            <div className="flex gap-4">
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  toneClass
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {insight.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </section>
  );
}
