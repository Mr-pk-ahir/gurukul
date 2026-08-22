interface CircularProgressAvatarProps {
    imageUrl?: string | null;
    name: string;
    percentage: number;
    size?: number;
    theme: boolean;
}

export default function CircularProgressAvatar({
    imageUrl,
    name,
    percentage,
    size = 72,
    theme,
}: CircularProgressAvatarProps) {
    const strokeWidth = 4;
    const radius = (size - strokeWidth * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    // 🎯 Percentage pramane color badle: low = red, mid = amber, high = green
    const getColor = () => {
        if (percentage >= 75) return "#10b981"; // emerald
        if (percentage >= 40) return "#f59e0b"; // amber
        return "#ef4444"; // red
    };

    const initial = name?.charAt(0)?.toUpperCase() || "U";

    return (
        <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="absolute top-0 left-0 -rotate-90">
                {/* Background track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={theme ? "#1f2937" : "#e5e7eb"}
                    strokeWidth={strokeWidth}
                />
                {/* Progress arc */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
            </svg>

            <div
                className="rounded-full overflow-hidden flex items-center justify-center font-bold"
                style={{
                    width: size - strokeWidth * 2 - 6,
                    height: size - strokeWidth * 2 - 6,
                }}
            >
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover rounded-full" />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center rounded-full text-lg ${theme ? "bg-gray-800 text-blue-300" : "bg-neutral-100 text-red-600"}`}>
                        {initial}
                    </div>
                )}
            </div>

            {/* Percentage badge, niche corner ma */}
            <span
                className={`absolute -bottom-1 -right-1 text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 ${theme ? "bg-gray-900 border-gray-900" : "bg-white border-white"}`}
                style={{ color: getColor() }}
            >
                {percentage}%
            </span>
        </div>
    );
}