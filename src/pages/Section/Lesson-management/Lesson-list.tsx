import { useTheme } from "../../../components/theme/ThemeContext";
import Button from "../../../components/common/Button";
import { useNavigate } from "react-router-dom";

export default function LessonList() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`max-w-6xl mx-auto p-6 sm:p-8 rounded-2xl shadow-sm mt-6 border transition-all duration-200 ${theme ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-neutral-200 text-neutral-900"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${theme ? "text-blue-400" : "text-red-600"}`}>
            Lesson Management
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2">Lesson List</h2>
        </div>

        <Button onClick={() => navigate("/dashboard/lessons/create")} className="!px-5">
          Create Lesson
        </Button>
      </div>

      <div className={`mt-8 rounded-2xl border p-8 text-center ${theme ? "border-gray-800 bg-gray-800/40" : "border-neutral-200 bg-neutral-50"}`}>
        <p className={`text-lg font-medium ${theme ? "text-gray-300" : "text-neutral-700"}`}>
          Lesson list view is ready for your data source.
        </p>
        <p className={`mt-2 text-sm ${theme ? "text-gray-400" : "text-neutral-500"}`}>
          Create a lesson from the form to start populating this list.
        </p>
      </div>
    </div>
  );
}
