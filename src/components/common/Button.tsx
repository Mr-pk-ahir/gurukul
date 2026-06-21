import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useTheme } from "../theme/ThemeContext";

// HTML Button na badha j default attributes support thase
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean; // Loading state mate
  loadingText?: string; // Loading vakhate batavavu text (default: "Loading...")
  leftIcon?: ReactNode; // Text ni dabi baju icon mate
  rightIcon?: ReactNode; // Text ni jamni baju icon mate
}

export default function Button({
  children,
  isLoading = false,
  loadingText = "Loading...",
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const { theme } = useTheme(); // true = Dark, false = Light

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      aria-disabled={disabled || isLoading || undefined}
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5
        text-sm font-semibold text-white transition-all duration-200
        bg-linear-to-bl shadow-lg
        ${
          theme
            ? "from-blue-400 to-blue-700 shadow-blue-950/40 hover:from-blue-400 hover:to-blue-800"
            : "from-red-400 to-red-700 shadow-red-950/20 hover:from-red-400 hover:to-red-800"
        }
        active:scale-[0.98]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${theme ? "focus-visible:ring-blue-400" : "focus-visible:ring-red-300"}
        disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100
        cursor-pointer disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <svg
          className="h-4 w-4 shrink-0 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Left Icon (Jo loading na hotu hoy to j dekhase) */}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}

      {/* Button Text */}
      <span>{isLoading ? loadingText : children}</span>

      {/* Right Icon */}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}