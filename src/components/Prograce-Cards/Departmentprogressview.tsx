import { HiOutlineLibrary } from "react-icons/hi";
import type { DepartmentProgress } from "../../services/progressService";
import SectionProgressCard from "./SectionProgressCard";

interface DepartmentProgressViewProps {
    department: DepartmentProgress;
    theme: boolean;
}

export default function DepartmentProgressView({ department, theme }: DepartmentProgressViewProps) {
    const barColor =
        department.percentage >= 75 ? "bg-emerald-500" : department.percentage >= 40 ? "bg-amber-500" : "bg-red-500";

    return (
        <div className="space-y-6">
            {/* 🎯 1. Department nu aakhu overall progress bar — top ma */}
            <div
                className={`rounded-3xl border p-6 sm:p-8 ${
                    theme ? "bg-gray-900 border-gray-800" : "bg-white border-neutral-200"
                }`}
            >
                <div className="flex items-center gap-4 mb-5">
                    <span className={`flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 ${theme ? "bg-blue-500/10 text-blue-300" : "bg-red-500/10 text-red-600"}`}>
                        <HiOutlineLibrary size={26} />
                    </span>
                    <div>
                        <h2 className={`text-2xl font-black ${theme ? "text-white" : "text-neutral-900"}`}>
                            {department.department_name}
                        </h2>
                        <p className={`text-sm ${theme ? "text-gray-400" : "text-neutral-500"}`}>
                            {department.sections.length} sections · {department.completedTasks}/{department.totalTasks} tasks completed overall
                        </p>
                    </div>
                    <span className={`ml-auto text-4xl font-black ${theme ? "text-white" : "text-neutral-900"}`}>
                        {department.percentage}%
                    </span>
                </div>

                <div className={`w-full h-3 rounded-full overflow-hidden ${theme ? "bg-gray-800" : "bg-neutral-200"}`}>
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                        style={{ width: `${department.percentage}%` }}
                    />
                </div>
            </div>

            {/* 🎯 2. Niche — badha sections ni list, dareke section ni andar users */}
            <div className="space-y-4">
                <h3 className={`text-sm font-bold uppercase tracking-wider ${theme ? "text-gray-400" : "text-neutral-500"}`}>
                    Sections
                </h3>

                {department.sections.length === 0 ? (
                    <div className={`text-center py-12 rounded-2xl border ${theme ? "border-gray-800 text-gray-500" : "border-neutral-200 text-neutral-400"}`}>
                        No sections created in this department yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {department.sections.map((sec) => (
                            <SectionProgressCard key={sec.section_id} section={sec} theme={theme} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}