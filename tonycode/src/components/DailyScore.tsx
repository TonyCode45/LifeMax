interface DailyScoreProps {
  score: number;
}

export function DailyScore({ score }: DailyScoreProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "hsl(var(--success))";
    if (score >= 50) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const getMessage = (score: number) => {
    if (score >= 90) return "Outstanding! 🌟";
    if (score >= 75) return "Great work! 💪";
    if (score >= 50) return "Good progress 👍";
    if (score > 0) return "Keep going! 🚀";
    return "Start your day! ✨";
  };

  return (
    <div className="bg-gradient-wellness rounded-3xl p-8 shadow-elevated mb-6 animate-scale-in">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-white mb-2">Daily Score</h2>
        <p className="text-white/80 text-sm mb-6">{getMessage(score)}</p>
        
        <div className="relative">
          <svg className="transform -rotate-90" width="200" height="200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke={getScoreColor(score)}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-bold text-white">{score}</span>
            <span className="text-white/80 text-sm">out of 100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
