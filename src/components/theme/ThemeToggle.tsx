import { useTheme } from "./ThemeContext";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col items-start p-1 bg-transparent w-fit">
      <button
        onClick={() => setTheme(!theme)}
        aria-label="Toggle Theme"
        // w-14 (56px) અને h-7 (28px) થી સાઇઝ નાની કરી છે
        className={`relative w-14 h-7 rounded-full flex items-center justify-between px-1 cursor-pointer transition-all duration-500 ease-in-out border outline-none select-none active:scale-95
          ${theme
            ? "bg-linear-to-b from-slate-900 to-slate-800 border-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
            : "bg-linear-to-b from-sky-400 to-blue-200 border-sky-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
          }
        `}
      >
        {/* --- બેકગ્રાઉન્ડ આઈકોન્સ (નાના કર્યા - text-[10px]) --- */}
        <HiOutlineMoon
          className={`text-slate-100 text-[10px] transition-all duration-500 z-0 ${theme ? "opacity-40 translate-x-0.5" : "opacity-0 -translate-x-2"
            }`}
        />

        <HiOutlineSun
          className={`text-amber-400 text-[10px] transition-all duration-500 z-0 ${theme ? "opacity-0 translate-x-2" : "opacity-40 -translate-x-0.5"
            }`}
        />

        <div
          className={`absolute w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ease-out transform shadow-md z-10
            ${theme
              ? "bg-white text-amber-500 translate-x-0 shadow-amber-400/40"
              : "bg-linear-to-tr from-slate-100 to-white text-slate-800 translate-x-7 shadow-black/50"
            }
          `}
        >
          {/* સર્કલની અંદરના આઈકોન પણ નાના કર્યા છે */}
          {theme ? (
            <HiOutlineSun className="text-xs" />
          ) : (
            <HiOutlineMoon className="text-[10px]" />
          )}
        </div>
      </button>
    </div>
  );
}