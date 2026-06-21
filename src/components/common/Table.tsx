import React from "react";
import { useTheme } from "../theme/ThemeContext";

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
}

export default function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No data available",
}: TableProps<T>) {
  const { theme } = useTheme();

  return (
    <div className="w-full overflow-x-auto no-scrollbar p-1">
      <table className="w-full border-separate border-spacing-y-3 text-left">
        {/* Table Header - લાલ/મેરૂન થીમ અથવા ડાર્ક થીમ */}
        <thead>
          <tr className={`transition-colors duration-200 ${
            theme 
              ? "bg-gray-800 text-gray-200" 
              : "bg-[#9b001c] text-white" // તમારા ફોટો જેવો સેમ કલર કોડ
          }`}>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`p-4 text-xs font-bold uppercase tracking-wider first:rounded-l-xl last:rounded-r-xl ${column.className || ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body - કાર્ડ લુક (વાઇટ/ડાર્ક બ્લોક્સ) */}
        <tbody className="text-sm">
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className={`shadow-sm transition-all duration-150 rounded-xl ${
                  theme 
                    ? "bg-gray-800/60 hover:bg-gray-800 text-gray-200" 
                    : "bg-white hover:bg-neutral-50 text-neutral-800"
                }`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`p-4 font-semibold first:rounded-l-xl last:rounded-r-xl border-t border-b ${
                      theme 
                        ? "border-gray-800/20" 
                        : "border-neutral-100"
                    } ${column.className || ""}`}
                  >
                    {column.accessor(item)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className={`p-8 text-center rounded-xl ${
                  theme ? "bg-gray-800 text-gray-500" : "bg-white text-neutral-400"
                }`}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}