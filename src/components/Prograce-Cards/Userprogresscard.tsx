import CircularProgressAvatar from "./Circularprogressavatar";
import type { UserProgress } from "../../services/progressService";

interface UserProgressCardProps {
    user: UserProgress;
    theme: boolean;
}

export default function UserProgressCard({ user, theme }: UserProgressCardProps) {
    return (
        <div
            className={`flex flex-col items-center text-center gap-2 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
                theme
                    ? "bg-gray-800/40 border-gray-700 hover:border-blue-500/40 hover:shadow-[0_10px_25px_-5px_rgba(59,130,246,0.15)]"
                    : "bg-neutral-50 border-neutral-200 hover:border-red-200 hover:shadow-[0_10px_25px_-5px_rgba(220,38,38,0.08)]"
            }`}
        >
            <CircularProgressAvatar
                imageUrl={user.avatar}
                name={user.name}
                percentage={user.percentage}
                size={72}
                theme={theme}
            />

            {/* 🎯 Naam ane SUID — 2 chhoti details */}
            <div className="mt-1">
                <p className={`text-sm font-bold truncate max-w-[110px] ${theme ? "text-white" : "text-neutral-900"}`}>
                    {user.name}
                </p>
                <p className={`text-xs font-mono ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                    #{user.suid}
                </p>
            </div>

            <p className={`text-[11px] ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                {user.completedTasks}/{user.totalTasks} tasks
            </p>
        </div>
    );
}