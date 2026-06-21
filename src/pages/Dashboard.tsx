import { useState } from "react";
import { useTheme } from "../components/theme/ThemeContext";
import { HiOutlineLibrary, HiOutlineUsers, HiOutlineShieldCheck } from "react-icons/hi";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function Dashboard() {
  const { theme } = useTheme();
  const userData = localStorage.getItem("user");
  const username = userData ? JSON.parse(userData).username : "Guest";

  // ફક્ત ટાઇમફ્રેમ સ્ટેટ રાખ્યો છે (ગ્રાફ ફિલ્ટર માટે)
  const [timeFrame, setTimeFrame] = useState<"week" | "month">("month");

  const stats = {
    departmentsCount: 12,
    usersCount: 48,
    rolesCount: 6,
  };

  // ગ્રાફ માટેનો ડાયનેમિક મોક ડેટા
  const graphData = {
    month: [
      { name: "Week 1", department: 2, user: 10 },
      { name: "Week 2", department: 5, user: 25 },
      { name: "Week 3", department: 3, user: 18 },
      { name: "Week 4", department: 12, user: 48 },
    ],
    week: [
      { name: "Mon", department: 1, user: 4 },
      { name: "Tue", department: 3, user: 8 },
      { name: "Wed", department: 2, user: 12 },
      { name: "Thu", department: 5, user: 6 },
      { name: "Fri", department: 1, user: 15 },
      { name: "Sat", department: 0, user: 3 },
      { name: "Sun", department: 0, user: 0 },
    ],
  };

  const currentChartData = graphData[timeFrame];

  return (
    <div className={`w-full space-y-8 rounded-2xl p-6 transition-all duration-300 border ${
      theme ? "bg-gray-900 text-gray-50 border-gray-800" : "bg-neutral-50 text-neutral-900 border-neutral-200"
    }`}>
      
      {/* --- હેડર સેક્શન --- */}
      <div className="flex justify-between items-center border-b pb-4 dark:border-gray-800 border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, <span className={theme ? "text-blue-400" : "text-red-600"}>{username}</span> 👋
          </h1>
          <p className={`text-xs mt-1 ${theme ? "text-gray-400" : "text-neutral-500"}`}>
            Here is what's happening with your Gurukul management today.
          </p>
        </div>
      </div>

      {/* --- 🛠️ મોટા ચોરસ (Square) સ્ટેટ્સ કાર્ડ્સ મોટા ટેક્સ્ટ સાથે --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* બોક્સ ૧: ડિપાર્ટમેન્ટ */}
        <div className={`aspect-square p-8 rounded-3xl border flex flex-col justify-between shadow-md transition-all hover:scale-[1.01] ${
          theme ? "bg-gray-800/50 border-gray-800" : "bg-white border-neutral-200"
        }`}>
          <div className="flex justify-between items-start">
            <p className={`text-base font-bold tracking-wide uppercase ${theme ? "text-gray-400" : "text-neutral-500"}`}>
              Total Departments
            </p>
            <div className={`p-4 rounded-2xl ${theme ? "bg-red-950/50 text-red-400" : "bg-red-50 text-red-600"}`}>
              <HiOutlineLibrary className="text-3xl" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-6xl font-black tracking-tight">{stats.departmentsCount}</h3>
            <p className="text-xs text-emerald-500 font-semibold mt-1">Active Modules</p>
          </div>
        </div>

        {/* બોક્સ ૨: યુઝર્સ */}
        <div className={`aspect-square p-8 rounded-3xl border flex flex-col justify-between shadow-md transition-all hover:scale-[1.01] ${
          theme ? "bg-gray-800/50 border-gray-800" : "bg-white border-neutral-200"
        }`}>
          <div className="flex justify-between items-start">
            <p className={`text-base font-bold tracking-wide uppercase ${theme ? "text-gray-400" : "text-neutral-500"}`}>
              Total Active Users
            </p>
            <div className={`p-4 rounded-2xl ${theme ? "bg-blue-950/50 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
              <HiOutlineUsers className="text-3xl" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-6xl font-black tracking-tight">{stats.usersCount}</h3>
            <p className="text-xs text-emerald-500 font-semibold mt-1">Verified Accounts</p>
          </div>
        </div>

        {/* બોક્સ ૩: રોલ્સ */}
        <div className={`aspect-square p-8 rounded-3xl border flex flex-col justify-between shadow-md transition-all hover:scale-[1.01] ${
          theme ? "bg-gray-800/50 border-gray-800" : "bg-white border-neutral-200"
        }`}>
          <div className="flex justify-between items-start">
            <p className={`text-base font-bold tracking-wide uppercase ${theme ? "text-gray-400" : "text-neutral-500"}`}>
              Total System Roles
            </p>
            <div className={`p-4 rounded-2xl ${theme ? "bg-emerald-950/50 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
              <HiOutlineShieldCheck className="text-3xl" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-6xl font-black tracking-tight">{stats.rolesCount}</h3>
            <p className="text-xs text-emerald-500 font-semibold mt-1">Configured Permissions</p>
          </div>
        </div>

      </div>

      {/* --- ગ્રાફ બોક્સ (ક્લીન હેડર સાથે) --- */}
      <div className={`p-6 rounded-3xl border shadow-sm ${
        theme ? "bg-gray-800/30 border-gray-800" : "bg-white border-neutral-200"
      }`}>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Overall Analytics</h3>
            <p className={`text-xs ${theme ? "text-gray-400" : "text-neutral-500"}`}>Overview of platform growth</p>
          </div>

          {/* 1 Week અને 1 Month ફિલ્ટર ਬਟਨ */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeFrame("week")}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                timeFrame === "week"
                  ? theme ? "bg-gray-700 border-gray-600 text-white" : "bg-neutral-900 border-neutral-900 text-white"
                  : theme ? "border-gray-800 text-gray-400 hover:text-white" : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              1 Week
            </button>
            <button
              onClick={() => setTimeFrame("month")}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                timeFrame === "month"
                  ? theme ? "bg-gray-700 border-gray-600 text-white" : "bg-neutral-900 border-neutral-900 text-white"
                  : theme ? "border-gray-800 text-gray-400 hover:text-white" : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              1 Month
            </button>
          </div>
        </div>

        {/* ગ્રાફ એરિયા */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="departmentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9b001c" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#9b001c" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme ? "#1f2937" : "#f3f4f6"} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: theme ? "#9ca3af" : "#6b7280", fontSize: 12 }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: theme ? "#9ca3af" : "#6b7280", fontSize: 12 }} 
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme ? "#1f2937" : "#ffffff", 
                  borderColor: theme ? "#374151" : "#e5e7eb",
                  borderRadius: "12px",
                  color: theme ? "#f9fafb" : "#111827"
                }} 
              />
              {/* બંને ડેટા એક જ ગ્રાફમાં સ્મૂથલી દેખાશે */}
              <Area type="monotone" dataKey="department" stroke="#9b001c" strokeWidth={2.5} fillOpacity={1} fill="url(#departmentGrad)" />
              <Area type="monotone" dataKey="user" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#userGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}