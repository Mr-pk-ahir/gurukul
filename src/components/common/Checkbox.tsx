import { useTheme } from "../theme/ThemeContext";
import { HiCheck } from "react-icons/hi";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export default function Checkbox({ checked, onChange, disabled = false }: CheckboxProps) {
  const { theme } = useTheme();

  return (
    <label className={`inline-flex items-center justify-center relative select-none ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
      {/* છુપાયેલો ઓરિજિનલ ઇનપુટ ટેગ */}
      <input
        type="checkbox"
        checked={checked}
        onChange={disabled ? undefined : onChange}
        disabled={disabled}
        className="sr-only" // Screen reader only (UI થી હાઈડ કરવા માટે)
      />

      {/* કસ્ટમ ડિઝાઇન કરેલું ચેકબોક્સ બોક્સ */}
      <div
        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 shadow-sm ${
          checked
            ? theme
              ? "bg-blue-600 border-blue-500 text-white scale-105 shadow-blue-900/30"
              : "bg-[#9b001c] border-[#9b001c] text-white scale-105 shadow-red-200"
            : theme
              ? "bg-gray-800 border-gray-700 hover:border-gray-500"
              : "bg-neutral-50 border-neutral-300 hover:border-neutral-400"
        }`}
      >
        {/* ટીક માર્ક આઇકોન જે એનિમેશન સાથે શો થશે */}
        <HiCheck
          className={`text-sm font-bold transition-all duration-200 transform ${
            checked ? "scale-100 opacity-100 rotate-0" : "scale-50 opacity-0 -rotate-45"
          }`}
        />
      </div>
    </label>
  );
}