import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"
type Colors = "purple" | "red" | "blue" | /* "yellow" | */ "green" | "pink" |
  'coral'
  | 'teal'
  | 'rust'
  | 'cerulean'
  | 'fuchsia'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColor?: Colors
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  themeColor: Colors
  setThemeColor: (color: Colors) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  themeColor: "purple",
  setThemeColor: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export const ThemeColors: { [_ in Colors]: string } = {
  purple: "#7c5cff",
  blue: "#0066ff",
  green: "#24b158",
  red: "#f1003c",
  // yellow: "#f2f700",
  pink: "#ff3e88",
  coral: '#FF6B6B',
  teal: '#008080',
  rust: '#B7410E',
  cerulean: '#007BA7',
  fuchsia: '#FF00FF',
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColor = "purple",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const [themeColor, setThemeColor] = useState<Colors>(
    () => (localStorage.getItem(`${storageKey}-color`) as Colors) || defaultColor
  )

  useEffect(() => {
    const root = window.document.body

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    const root = window.document.body
    root.classList.remove("purple", "red", "blue", "yellow", "green", "pink", "coral",   "teal", "rust", "cerulean", "fuchsia")
    root.classList.add(themeColor)
  }, [themeColor])

  const value = {
    theme,
    themeColor,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    setThemeColor: (color: Colors) => {
      localStorage.setItem(`${storageKey}-color`, color)
      setThemeColor(color)
    }
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
