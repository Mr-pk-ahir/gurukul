import type { ButtonHTMLAttributes, ReactNode } from "react";

// HTML Button na badha j default attributes support thase
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean; // Loading state mate
  leftIcon?: ReactNode; // Text ni dabi baju icon mate
  rightIcon?: ReactNode; // Text ni jamni baju icon mate
}

export default function Button({
  children,
  isLoading,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 
        text-sm font-semibold text-white transition duration-200 
        hover:bg-red-600 active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-red-100
        disabled:pointer-events-none disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
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
            box-shadow="none"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Left Icon (Jo loading na hotu hoy to j dekhase) */}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}

      {/* Button Text */}
      <span>{isLoading ? "Loading..." : children}</span>

      {/* Right Icon */}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}