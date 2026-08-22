import { useState, useEffect } from "react";
import { useTheme } from "../../components/theme/ThemeContext";
import { HiOutlineChartBar } from "react-icons/hi";
import { toast } from "sonner";
import { progressService, type DepartmentProgress, type SectionProgress, type UserProgress, type DepartmentSummary } from "../../services/progressService";
import DepartmentProgressView from "../../components/Prograce-Cards/Departmentprogressview";
import SectionProgressCard from "../../components/Prograce-Cards/SectionProgressCard";
import UserProgressCard from "../../components/Prograce-Cards/Userprogresscard";
import type { AuthUser } from "../../Types/Role-create";

// 🎯 IMPORTANT: Roles table na exact role_code pramane confirm karo
const SUPER_ADMIN = "SUPER_ADMIN";
const DEPARTMENT_HEAD = "HEAD100";
const SECTION_HEAD = "SECTION_HEAD";

export default function ProgressDashboard() {
    const { theme } = useTheme();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Super Admin dropdown state
    const [deptSummaries, setDeptSummaries] = useState<DepartmentSummary[]>([]);
    const [selectedDeptId, setSelectedDeptId] = useState<number | null>(null);

    // Data states
    const [departmentData, setDepartmentData] = useState<DepartmentProgress | null>(null);
    const [sectionData, setSectionData] = useState<SectionProgress | null>(null);
    const [userData, setUserData] = useState<UserProgress | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    // 🎯 Role pramane decide karo shu load karvu
    useEffect(() => {
        if (!user) return;

        const load = async () => {
            setLoading(true);
            try {
                if (user.roleCode === SUPER_ADMIN) {
                    const result = await progressService.getAllDepartmentsProgress();
                    if (result.success) {
                        setDeptSummaries(result.data);
                        if (result.data.length > 0) {
                            setSelectedDeptId(result.data[0].department_id);
                        }
                    }
                } else if (user.roleCode === DEPARTMENT_HEAD) {
                    if (user.departmentId) {
                        const result = await progressService.getDepartmentProgress(user.departmentId);
                        if (result.success) setDepartmentData(result.data);
                    }
                } else if (user.roleCode === SECTION_HEAD) {
                    const sectionId = (user as any).sectionId;
                    if (sectionId) {
                        const result = await progressService.getSectionProgress(sectionId);
                        if (result.success) setSectionData(result.data);
                    }
                } else {
                    // Student / User — potानు j progress
                    const result = await progressService.getUserProgress(user.suid);
                    if (result.success) setUserData(result.data);
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to load progress data");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user]);

    // Super Admin e department select karyu pachi e department nu detail fetch karo
    useEffect(() => {
        if (user?.roleCode !== SUPER_ADMIN || !selectedDeptId) return;

        const fetchDept = async () => {
            try {
                setLoading(true);
                const result = await progressService.getDepartmentProgress(selectedDeptId);
                if (result.success) setDepartmentData(result.data);
            } catch (error: any) {
                toast.error(error.message || "Failed to load department progress");
            } finally {
                setLoading(false);
            }
        };
        fetchDept();
    }, [selectedDeptId, user]);

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
            <div className="flex items-center gap-3">
                <span className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${theme ? "bg-blue-500/10 text-blue-300" : "bg-red-500/10 text-red-600"}`}>
                    <HiOutlineChartBar size={20} />
                </span>
                <div>
                    <h1 className={`text-xl font-bold ${theme ? "text-blue-200" : "text-red-600"}`}>Progress Overview</h1>
                    <p className={`text-xs ${theme ? "text-gray-500" : "text-neutral-400"}`}>Track task completion across the system</p>
                </div>

                {/* 🎯 Sirf Super Admin ne j department select karvani dropdown dekhay */}
                {user.roleCode === SUPER_ADMIN && deptSummaries.length > 0 && (
                    <select
                        value={selectedDeptId ?? ""}
                        onChange={(e) => setSelectedDeptId(Number(e.target.value))}
                        className={`ml-auto px-4 py-2.5 rounded-xl border text-sm font-medium outline-none ${
                            theme ? "bg-gray-800/60 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-700"
                        }`}
                    >
                        {deptSummaries.map((d) => (
                            <option key={d.department_id} value={d.department_id}>
                                {d.department_name} ({d.percentage}%)
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className={`w-10 h-10 rounded-full border-4 border-t-transparent animate-spin ${theme ? "border-blue-500" : "border-red-600"}`} />
                </div>
            ) : (
                <>
                    {/* Super Admin / Department Head — full department view */}
                    {(user.roleCode === SUPER_ADMIN || user.roleCode === DEPARTMENT_HEAD) && departmentData && (
                        <DepartmentProgressView department={departmentData} theme={theme} />
                    )}

                    {/* Section Head — potana section nu view, default expanded */}
                    {user.roleCode === SECTION_HEAD && sectionData && (
                        <SectionProgressCard section={sectionData} theme={theme} defaultOpen={true} />
                    )}

                    {/* Student / User — potanu personal progress card */}
                    {user.roleCode !== SUPER_ADMIN && user.roleCode !== DEPARTMENT_HEAD && user.roleCode !== SECTION_HEAD && userData && (
                        <div className="flex justify-center py-10">
                            <UserProgressCard user={userData} theme={theme} />
                        </div>
                    )}

                    {/* Empty states */}
                    {user.roleCode === DEPARTMENT_HEAD && !departmentData && (
                        <p className={`text-center py-16 ${theme ? "text-gray-500" : "text-neutral-400"}`}>No department assigned to your account.</p>
                    )}
                    {user.roleCode === SECTION_HEAD && !sectionData && (
                        <p className={`text-center py-16 ${theme ? "text-gray-500" : "text-neutral-400"}`}>No section assigned to your account.</p>
                    )}
                </>
            )}
        </div>
    );
}