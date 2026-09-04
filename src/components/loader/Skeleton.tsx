import { useTheme } from "../theme/ThemeContext";

interface SkeletonLoaderProps {
  variant?: "page" | "sidebar" | "card" | "table" | "text";
  rows?: number;
}

export default function SkeletonLoader({ variant = "page", rows = 4 }: SkeletonLoaderProps) {
  const { theme } = useTheme(); // true = Dark, false = Light

  const shimmer = `animate-pulse rounded-lg ${
    theme ? "bg-gray-800" : "bg-gray-200"
  }`;

  const shimmerSoft = `animate-pulse rounded-lg ${
    theme ? "bg-gray-800/60" : "bg-gray-200/70"
  }`;

  if (variant === "page") {
    return (
      <div
        className={`h-screen w-screen flex font-sans overflow-hidden transition-colors duration-300 ${
          theme ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        {/* Sidebar skeleton — Sidebar.tsx ni width/padding pramane match */}
        <div
          className={`hidden md:flex flex-col gap-4 p-3 w-64 h-full border-r ${
            theme ? "border-gray-800" : "border-gray-100"
          }`}
        >
          {/* Logo */}
          <div className={`${shimmer} w-full h-12`} />

          {/* Menu items */}
          <div className="flex flex-col gap-2 mt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`${shimmerSoft} w-full h-10`} />
            ))}
          </div>
        </div>

        {/* Main content container */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Header skeleton */}
          <div
            className={`w-full h-16 md:h-20 flex items-center justify-between px-4 md:px-6 border-b ${
              theme ? "border-gray-800" : "border-gray-100"
            }`}
          >
            <div className={`${shimmer} w-9 h-9 rounded-full md:hidden`} />
            <div className={`${shimmer} w-40 h-6`} />
            <div className="flex items-center gap-3">
              <div className={`${shimmer} w-9 h-9 rounded-full`} />
              <div className={`${shimmer} w-9 h-9 rounded-full`} />
            </div>
          </div>

          {/* Content box skeleton — main > rounded-2xl border pramane */}
          <main className="flex-1 p-6 md:p-3 w-full mx-auto overflow-hidden">
            <div
              className={`w-full min-h-full rounded-2xl p-6 border ${
                theme ? "border-gray-800" : "border-gray-100"
              }`}
            >
              {/* Back button skeleton */}
              <div className={`${shimmer} w-24 h-9 mb-5`} />

              {/* Title */}
              <div className={`${shimmer} w-40 h-6 mb-6`} />

              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`${shimmer} w-full h-32`} />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="flex flex-col gap-2 w-full p-2">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className={`${shimmer} w-full h-13`} />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className={`${shimmer} w-full h-32`} />
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="flex flex-col gap-3 w-full">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className={`${shimmer} w-full h-10`} />
        ))}
      </div>
    );
  }

  // variant === "text"
  return (
    <div className="flex flex-col gap-2 w-full">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className={`${shimmer} h-4`}
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}