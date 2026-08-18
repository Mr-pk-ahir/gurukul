import { HiX, HiOutlineUserGroup } from "react-icons/hi";
import StudentList, { type StudentData } from "./Student-list";

export type { StudentData };

interface SectionDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    sectionName: string;
    students: StudentData[];
    loading: boolean;
    theme: boolean;
    onStudentRemoved: (suid: number) => void;
}

export default function SectionDropdown({
    isOpen,
    onClose,
    sectionName,
    students,
    loading,
    theme,
    onStudentRemoved,
}: SectionDropdownProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative w-full max-w-2xl max-h-[80vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
                    theme ? "bg-gray-900 border-gray-800" : "bg-white border-neutral-200"
                }`}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${
                        theme ? "border-gray-800" : "border-neutral-100"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <span
                            className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${
                                theme ? "bg-blue-500/10 text-blue-300" : "bg-red-500/10 text-red-600"
                            }`}
                        >
                            <HiOutlineUserGroup size={18} />
                        </span>
                        <div>
                            <h3 className={`text-base font-bold leading-tight ${theme ? "text-blue-200" : "text-red-600"}`}>
                                {sectionName}
                            </h3>
                            <p className={`text-xs mt-0.5 ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                                {students.length} student{students.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className={`p-2 rounded-lg transition-colors ${
                            theme ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200" : "hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700"
                        }`}
                    >
                        <HiX size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-6 py-4 flex-1">
                    {loading ? (
                        <div className="flex justify-center py-16">
                            <div
                                className={`w-8 h-8 rounded-full border-4 border-t-transparent animate-spin ${
                                    theme ? "border-blue-500" : "border-red-600"
                                }`}
                            />
                        </div>
                    ) : students.length === 0 ? (
                        <p className={`text-sm text-center py-16 ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                            No students assigned to this section yet.
                        </p>
                    ) : (
                        <StudentList students={students} theme={theme} onStudentRemoved={onStudentRemoved} />
                    )}
                </div>
            </div>
        </div>
    );
}