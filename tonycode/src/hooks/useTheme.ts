import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Theme = "light" | "dark";

const prefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(
    "theme",
    prefersDark() ? "dark" : "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    const metaThemeColor = document.querySelector(
      'meta[name="theme-color"]'
    );
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#0f172a" : "#ffffff"
      );
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [setTheme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return { theme, setTheme, toggleTheme };
}
