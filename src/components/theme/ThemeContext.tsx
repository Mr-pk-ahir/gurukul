import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  theme: boolean; // true = Red Theme, false = Blue Theme
  setTheme: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("app-theme");
    return savedTheme ? savedTheme === "true" : true; // default true (Red)
  });

  useEffect(() => {
    localStorage.setItem("app-theme", String(theme));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}