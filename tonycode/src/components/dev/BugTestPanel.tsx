import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, User, Sun, Moon, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const formatTime = () => new Date().toLocaleTimeString();

type LogEntry = {
  message: string;
  tone?: "info" | "success" | "error";
};

export function BugTestPanel() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const profileKey = user
    ? `profileName_${user.id}`
    : "profileName_anonymous";
  const [userName, setUserName] = useLocalStorage(profileKey, "");

  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = (entry: LogEntry) =>
    setLogs((prev) => [...prev, entry].slice(-8));

  const testNotifications = async () => {
    addLog({ message: `${formatTime()} • Checking notification support` });

    if (typeof window === "undefined" || !("Notification" in window)) {
      addLog({
        message: `${formatTime()} • Notifications not supported in this browser`,
        tone: "error",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      addLog({
        message: `${formatTime()} • Permission state: ${permission}`,
        tone: permission === "granted" ? "success" : "info",
      });

      if (permission === "granted") {
        new Notification("LifeMax Test", {
          body: "Looks good! Notifications can reach this device.",
          icon: "/icon-192.png",
        });
        addLog({
          message: `${formatTime()} • Notification delivered successfully`,
          tone: "success",
        });
      } else if (permission === "denied") {
        addLog({
          message: `${formatTime()} • User blocked notifications – open browser settings to enable`,
          tone: "error",
        });
      } else {
        addLog({
          message: `${formatTime()} • User dismissed the prompt – try clicking "Allow" next time`,
          tone: "info",
        });
      }
    } catch (error) {
      addLog({
        message: `${formatTime()} • Error requesting notifications: ${(error as Error).message}`,
        tone: "error",
      });
    }
  };

  const testProfileStorage = () => {
    addLog({
      message: `${formatTime()} • Local storage key: ${profileKey}`,
      tone: "info",
    });
    addLog({
      message: `${formatTime()} • Stored name: "${userName || "(empty)"}"`,
      tone: userName ? "success" : "info",
    });
    addLog({
      message: `${formatTime()} • ${
        user ? `Signed in as ${user.email}` : "Not authenticated"
      }`,
      tone: user ? "success" : "error",
    });
  };

  const testTheme = () => {
    addLog({
      message: `${formatTime()} • Current theme: ${theme}`,
      tone: "info",
    });
    toggleTheme();
    addLog({
      message: `${formatTime()} • Theme toggled to ${theme === "light" ? "dark" : "light"}`,
      tone: "success",
    });
  };

  const resetPanel = () => setLogs([]);

  return (
    <Card className="border-dashed border-primary/40 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          🐛 Bug Test Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Quick checks to confirm notifications, profile persistence, and theme
          toggling behave correctly per user session.
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button onClick={testNotifications} className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Test Notifications
          </Button>
          <Button onClick={testProfileStorage} className="flex items-center gap-2">
            <User className="h-4 w-4" /> Verify Profile Storage
          </Button>
          <Button onClick={testTheme} className="flex items-center gap-2">
            {theme === "light" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            Toggle Theme
          </Button>
          <Button variant="outline" onClick={resetPanel} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Clear Output
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Profile name (stored per user):
          </label>
          <input
            type="text"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            placeholder="Enter a display name"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-inner"
          />
          <p className="text-xs text-muted-foreground">
            Key: {profileKey}
          </p>
        </div>

        <div className="rounded-xl bg-muted/60 p-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Test output
          </p>
          <div className="mt-2 space-y-1 text-xs">
            {logs.length === 0 ? (
              <p className="text-muted-foreground">No tests run yet.</p>
            ) : (
              logs.map((entry, index) => (
                <p
                  key={`${entry.message}-${index}`}
                  className={
                    entry.tone === "error"
                      ? "text-destructive"
                      : entry.tone === "success"
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-muted-foreground"
                  }
                >
                  {entry.message}
                </p>
              ))
            )}
          </div>
        </div>

        {user && (
          <Button variant="destructive" className="w-full" onClick={signOut}>
            Sign out (clears session)
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
