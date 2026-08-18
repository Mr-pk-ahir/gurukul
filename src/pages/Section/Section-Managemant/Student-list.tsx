import { HiMinus } from "react-icons/hi";
import { toast } from "sonner";

export interface StudentData {
    suid: number;
    name: string;
    username: string;
    avatar: string;
    departmentId: number;
    sectionId: number | null;
    joiningDate: string;
    status: string;
}

interface StudentListProps {
    students: StudentData[];
    theme: boolean;
    onStudentRemoved: (suid: number) => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function StudentList({ students, theme, onStudentRemoved }: StudentListProps) {
    const removeStudentFromSection = async (student: StudentData) => {
        try {
            const response = await fetch(`${API_URL}/users/${student.suid}/section`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sectionId: null }),
            });
            const result = await response.json();

            if (result.success) {
                toast.success(`${student.name} removed from section`);
                onStudentRemoved(student.suid);
            } else {
                toast.error(result.message || "Could not remove student");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const handleRemoveClick = (student: StudentData) => {
        toast(`Remove ${student.name} from this section?`, {
            description: "The student will be unassigned from this section.",
            action: {
                label: "Confirm",
                onClick: () => removeStudentFromSection(student),
            },
            cancel: {
                label: "Cancel",
                onClick: () => {},
            },
        });
    };

    return (
        <div className="flex flex-col gap-2">
            {students.map((student, index) => (
                <div
                    key={student.suid}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                        theme
                            ? "bg-gray-800/60 border-gray-700 hover:border-gray-600"
                            : "bg-white border-neutral-200 hover:border-neutral-300"
                    }`}
                >
                    <span
                        className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 text-xs font-bold font-mono ${
                            theme ? "bg-blue-500/10 text-blue-300" : "bg-red-500/10 text-red-600"
                        }`}
                    >
                        {index + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold truncate block">{student.name}</span>
                        <span className="text-xs text-gray-400 font-mono truncate block">
                            SUID: {student.suid} · {student.status}
                        </span>
                    </div>

                    <button
                        onClick={() => handleRemoveClick(student)}
                        title="Remove from section"
                        className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors ${
                            theme
                                ? "text-red-400 hover:bg-red-500/10"
                                : "text-red-500 hover:bg-red-50"
                        }`}
                    >
                        <HiMinus size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}