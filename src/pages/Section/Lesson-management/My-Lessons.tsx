import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../../components/theme/ThemeContext";
import Button from "../../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { lessonService } from "../../../services/lessonService";
import { toast } from "sonner";

interface MyLessonItem {
  lesson_title?: string;
  lesson_type?: string;
  description?: string;
  progress_points?: number;
  date_start?: string;
  start_date?: string;
  date_end?: string;
  end_date?: string;
  created_by?: number | string | null;
  created_at?: string;
}

export default function MyLessons() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<MyLessonItem[]>([]);
  const [loading, setLoading] = useState(false);

  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchMyLessons = async () => {
      setLoading(true);

      try {
        const response = await lessonService.getMyLessons(user?.id ?? user?.suid ?? null);
        const data = Array.isArray(response?.data) ? response.data : [];
        setLessons(data);
      } catch (error: any) {
        toast.error(error?.message || "Unable to load your lessons");
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchMyLessons();
  }, [user?.id, user?.suid]);

  const renderDate = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  return (
    <div className={`mx-auto max-w-6xl rounded-2xl border p-6 shadow-sm transition-all duration-200 sm:p-8 ${theme ? "border-gray-800 bg-gray-900 text-white" : "border-neutral-200 bg-white text-neutral-900"}`}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${theme ? "text-blue-400" : "text-red-600"}`}>
            My Workspace
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">My Lessons</h2>
        </div>

        <Button onClick={() => navigate("/dashboard/lessons/create")} className="!px-5">
          Create Lesson
        </Button>
      </div>

      {loading ? (
        <div className={`rounded-2xl border p-8 text-center ${theme ? "border-gray-800 bg-gray-800/40" : "border-neutral-200 bg-neutral-50"}`}>
          <p className={`${theme ? "text-gray-300" : "text-neutral-700"}`}>Loading your lessons...</p>
        </div>
      ) : lessons.length === 0 ? (
        <div className={`rounded-2xl border p-8 text-center ${theme ? "border-gray-800 bg-gray-800/40" : "border-neutral-200 bg-neutral-50"}`}>
          <p className={`text-lg font-medium ${theme ? "text-gray-300" : "text-neutral-700"}`}>
            No lessons found for your account yet.
          </p>
          <p className={`mt-2 text-sm ${theme ? "text-gray-400" : "text-neutral-500"}`}>
            Create a lesson and it will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson, index) => (
            <div
              key={`${lesson.lesson_title ?? "lesson"}-${index}`}
              className={`rounded-2xl border p-5 shadow-sm transition-all duration-200 ${theme ? "border-gray-800 bg-gray-800/40" : "border-neutral-200 bg-neutral-50"}`}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${theme ? "bg-blue-500/10 text-blue-300" : "bg-red-100 text-red-700"}`}>
                  {lesson.lesson_type || "Lesson"}
                </span>
                <span className={`text-xs ${theme ? "text-gray-400" : "text-neutral-500"}`}>
                  {lesson.progress_points ?? 0} pts
                </span>
              </div>

              <h3 className="text-xl font-bold leading-snug">{lesson.lesson_title || "Untitled Lesson"}</h3>

              <div className={`mt-4 space-y-2 text-sm ${theme ? "text-gray-300" : "text-neutral-600"}`}>
                <p>
                  <span className="font-semibold">Start:</span> {renderDate(lesson.date_start || lesson.start_date)}
                </p>
                <p>
                  <span className="font-semibold">End:</span> {renderDate(lesson.date_end || lesson.end_date)}
                </p>
              </div>

              {lesson.description && (
                <p className={`mt-4 line-clamp-3 text-sm ${theme ? "text-gray-400" : "text-neutral-500"}`}>
                  {lesson.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
