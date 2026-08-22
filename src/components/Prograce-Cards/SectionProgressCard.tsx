import { useState } from "react";
import { HiOutlineOfficeBuilding, HiChevronDown, HiOutlineUserGroup } from "react-icons/hi";
import type { SectionProgress } from "../../services/progressService";
import UserProgressCard from "./Userprogresscard";

interface SectionProgressCardProps {
    section: SectionProgress;
    theme: boolean;
    defaultOpen?: boolean;
}

function getBarColor(percentage: number) {
    if (percentage >= 75) return "bg-emerald-500";
    if (percentage >= 40) return "bg-amber-500";
    return "bg-red-500";
}

export default function SectionProgressCard({ section, theme, defaultOpen = false }: SectionProgressCardProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`rounded-2xl border overflow-hidden transition-all duration-200 ${theme ? "border-gray-800 bg-gray-900/40" : "border-neutral-200 bg-white"}`}>
            {/* 🎯 Section header — naam, thodi details, progress bar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors ${theme ? "hover:bg-gray-800/40" : "hover:bg-neutral-50"}`}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <span className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${theme ? "bg-blue-500/10 text-blue-300" : "bg-red-500/10 text-red-600"}`}>
                        <HiOutlineOfficeBuilding size={18} />
                    </span>
                    <div className="min-w-0">
                        <h3 className={`font-bold truncate ${theme ? "text-white" : "text-neutral-900"}`}>{section.name}</h3>
                        <p className={`text-xs flex items-center gap-1.5 mt-0.5 ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                            <HiOutlineUserGroup size={13} />
                            {section.users.length} users · {section.completedTasks}/{section.totalTasks} tasks done
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {/* Mini progress bar */}
                    <div className="hidden sm:flex flex-col items-end gap-1 w-32">
                        <span className={`text-xs font-bold ${theme ? "text-gray-300" : "text-neutral-600"}`}>{section.percentage}%</span>
                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${theme ? "bg-gray-800" : "bg-neutral-200"}`}>
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${getBarColor(section.percentage)}`}
                                style={{ width: `${section.percentage}%` }}
                            />
                        </div>
                    </div>
                    <HiChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${theme ? "text-gray-400" : "text-neutral-500"}`} />
                </div>
            </button>

            {/* 🎯 Expand thay to section na badha users (avatar ring sathe) dekhay */}
            {isOpen && (
                <div className={`px-5 pb-5 pt-1 border-t ${theme ? "border-gray-800" : "border-neutral-100"}`}>
                    {section.users.length === 0 ? (
                        <p className={`text-sm text-center py-6 ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                            No users in this section yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
                            {section.users.map((u) => (
                                <UserProgressCard key={u.suid} user={u} theme={theme} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}