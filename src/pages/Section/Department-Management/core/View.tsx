import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTheme  } from "../../../../components/theme/ThemeContext";
import { getDepartmentById, type DepartmentData } from "../../../../action/Department/View";

export default function DepartmentView() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { departmentId } = useParams<{ departmentId: string }>();
  const [department, setDepartment] = useState<DepartmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!departmentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await getDepartmentById(Number(departmentId));
        setDepartment(result);
      } catch (error) {
        console.error("Department view error:", error);
        toast.error("Unable to load department details.");
        navigate("/dashboard/departments/list");
      } finally {
        setLoading(false);
      }
    };

    void fetchDepartment();
  }, [departmentId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className={`h-10 w-10 animate-spin rounded-full border-4 border-t-transparent ${theme ? "border-blue-500" : "border-[#9b001c]"}`} />
      </div>
    );
  }

  if (!department) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
        Department not found.
      </div>
    );
  }

  return (
    <div className={`mx-auto max-w-4xl rounded-3xl border p-6 shadow-sm ${theme ? "border-gray-700 bg-gray-900 text-white" : "border-neutral-200 bg-white text-neutral-900"}`}>
      <div className="mb-6 flex items-center justify-between gap-3 border-b pb-4">
        <div>
          <p className={`text-xs uppercase tracking-[0.2em] ${theme ? "text-blue-300" : "text-[#9b001c]"}`}>
            Department Profile
          </p>
          <h2 className="mt-2 text-2xl font-bold">{department.departmentName}</h2>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/dashboard/departments/edit/${department.departmentId}`)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${theme ? "bg-blue-600 hover:bg-blue-700" : "bg-[#9b001c] hover:bg-[#7d0017] text-white"}`}
        >
          Edit Department
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className={`rounded-2xl border p-4 ${theme ? "border-gray-700 bg-gray-800/60" : "border-neutral-200 bg-neutral-50"}`}>
          <p className={`text-xs uppercase tracking-[0.2em] ${theme ? "text-gray-400" : "text-neutral-500"}`}>Department ID</p>
          <p className="mt-2 text-xl font-semibold">#{department.departmentId}</p>
        </div>

        <div className={`rounded-2xl border p-4 ${theme ? "border-gray-700 bg-gray-800/60" : "border-neutral-200 bg-neutral-50"}`}>
          <p className={`text-xs uppercase tracking-[0.2em] ${theme ? "text-gray-400" : "text-neutral-500"}`}>Department Head</p>
          <p className="mt-2 text-xl font-semibold">{department.departmentHeadName || "Not Assigned"}</p>
          {department.departmentHeadId && (
            <p className={`mt-2 text-sm ${theme ? "text-gray-400" : "text-neutral-500"}`}>
              Head ID: {department.departmentHeadId}
            </p>
          )}
        </div>
      </div>

      <div className={`mt-6 rounded-2xl border p-4 ${theme ? "border-gray-700 bg-gray-800/60" : "border-neutral-200 bg-neutral-50"}`}>
        <p className={`text-xs uppercase tracking-[0.2em] ${theme ? "text-gray-400" : "text-neutral-500"}`}>Description</p>
        <p className="mt-3 leading-7 text-base">
          {department.description || "No description available."}
        </p>
      </div>
    </div>
  );
}
