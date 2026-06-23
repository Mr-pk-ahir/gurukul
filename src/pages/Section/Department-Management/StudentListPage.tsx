import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../../components/theme/ThemeContext";
import Table from "../../../components/common/Table";
import { HiOutlineUserGroup, HiSearch, HiFilter, HiChevronDown } from "react-icons/hi";

// 💾 Type-Safe Data Model (Database Interface)
interface UserCreate {
  suid: string;          // Unique Primary Key
  name: string;
  username: string;
  roleCode: string;
  departmentId: number;
  sectionId: number;     // ⚠️ 4 નંબર સિવાયના ડિપાર્ટમેન્ટ માટે 0 રહેશે
  standard: string;      // Academic વિગત
}

export default function StudentListPage() {
  const { theme } = useTheme();

  // 🎯 URL માંથી ડાયનેમિક ડિપાર્ટમેન્ટ ID મેળવવા માટે
  const { deptId } = useParams<{ deptId: string }>();
  const currentDeptId = Number(deptId);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 🗃️ માસ્ટર સ્ટુડન્ટ લિસ્ટ (મિક્સ ડિપાર્ટમેન્ટ ડેટા)
  const allStudents: UserCreate[] = [
    { suid: "SUID-1001", name: "Aarav Mehta", username: "aarav_mehta", roleCode: "STUDENT", departmentId: 4, sectionId: 1, standard: "10th-A" },
    { suid: "SUID-1002", name: "Diya Patel", username: "diya_patel", roleCode: "STUDENT", departmentId: 4, sectionId: 2, standard: "12th-B" },
    { suid: "SUID-2001", name: "Rajesh Kumar", username: "rajesh_k", roleCode: "STUDENT", departmentId: 10, sectionId: 0, standard: "Not Required" },
    { suid: "SUID-2002", name: "Megha Patel", username: "megha_p", roleCode: "STAFF", departmentId: 10, sectionId: 0, standard: "Not Required" },
    { suid: "SUID-3001", name: "Smit Shah", username: "smit_shah", roleCode: "STUDENT", departmentId: 20, sectionId: 0, standard: "Not Required" },
  ];

  // 🎯 ૧. જે તે ડિપાર્ટમેન્ટ પ્રમાણે ડેટા આઇસોલેશન (Isolation)
  const deptFilteredStudents = allStudents.filter((s) => s.departmentId === currentDeptId);

  const filterOptions = [
    { label: "All Fields", value: "all" },
    { label: "Name", value: "name" },
    { label: "SUID", value: "suid" },
    { label: "Username", value: "username" },
    { label: "Role", value: "roleCode" },
    { label: "Class", value: "standard" },
  ];

  // 🌟 ડાયનેમિક પ્લેસહોલ્ડર (UserList.tsx જેવો જ pattern)
  const getSearchInputConfig = () => {
    switch (filterType) {
      case "suid":
        return { type: "text", placeholder: "Enter SUID (e.g. SUID-1001)..." };
      case "username":
        return { type: "text", placeholder: "Search Username" };
      case "roleCode":
        return { type: "text", placeholder: "Search Role" };
      case "standard":
        return { type: "text", placeholder: "Search Class" };
      case "name":
        return { type: "text", placeholder: "Search Name" };
      default:
        return { type: "text", placeholder: "Search Across All Records" };
    }
  };

  const inputConfig = getSearchInputConfig();

  // 🌟 સ્માર્ટ ફિલ્ટરિંગ લોજિક — UserList.tsx જેવો જ pattern
  const finalTableData = deptFilteredStudents.filter((s) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    switch (filterType) {
      case "name":
        return s.name.toLowerCase().includes(query);
      case "suid":
        return s.suid.toLowerCase().includes(query);
      case "username":
        return s.username.toLowerCase().includes(query);
      case "roleCode":
        return s.roleCode.toLowerCase().startsWith(query);
      case "standard":
        return s.standard.toLowerCase().includes(query);
      default: // "all"
        return (
          s.name.toLowerCase().includes(query) ||
          s.suid.toLowerCase().includes(query) ||
          s.username.toLowerCase().includes(query) ||
          s.roleCode.toLowerCase().startsWith(query) ||
          s.standard.toLowerCase().includes(query)
        );
    }
  });

  const totalStudents = deptFilteredStudents.length;

  // 📋 ટેબલ કોલમ કન્ફિગ્યુરેશન
  const columns = [
    {
      header: "SUID (PK)",
      className: `w-32 text-center font-mono font-bold ${theme ? "text-blue-400" : "text-blue-600"}`,
      accessor: (student: UserCreate) => student.suid,
    },
    {
      header: "Full Name",
      className: `text-left font-semibold ${theme ? "text-neutral-200" : "text-gray-800"}`,
      accessor: (student: UserCreate) => student.name,
    },
    {
      header: "Username",
      className: "text-left font-mono text-xs text-gray-500",
      accessor: (student: UserCreate) => `@${student.username}`,
    },
    {
      header: "Role",
      className: "text-center",
      accessor: (student: UserCreate) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            student.roleCode === "STUDENT"
              ? theme
                ? "bg-emerald-950/30 text-emerald-400"
                : "bg-green-100 text-green-700"
              : theme
                ? "bg-purple-950/30 text-purple-400"
                : "bg-purple-100 text-purple-700"
          }`}
        >
          {student.roleCode}
        </span>
      ),
    },
    {
      header: "Academic Class",
      className: "text-center font-medium",
      accessor: (student: UserCreate) => (
        <span
          className={`text-sm ${
            student.departmentId === 4
              ? theme
                ? "text-neutral-300"
                : "text-gray-700"
              : "text-gray-400 italic"
          }`}
        >
          {student.departmentId === 4 ? student.standard : "N/A (Dept 0)"}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-full mx-auto">

      {/* 🏷️ હેડર સેક્શન + ફિલ્ટર/સર્ચ — UserList.tsx જેવો જ pattern */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div className="flex items-center gap-3">
          <span
            className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors ${
              theme ? "bg-blue-500/10 text-blue-300" : "bg-[#9b001c]/10 text-[#9b001c]"
            }`}
          >
            <HiOutlineUserGroup size={20} />
          </span>
          <div>
            <h2 className={`text-xl font-bold leading-tight ${theme ? "text-blue-200" : "text-[#9b001c]"}`}>
              Official Student Roster
            </h2>
            <p className={`text-xs mt-0.5 ${theme ? "text-gray-500" : "text-neutral-400"}`}>
              Showing {finalTableData.length} of {totalStudents} students · Dept #{currentDeptId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-1">

          {/* 🌀 ફિલ્ટર ડ્રોપડાઉન */}
          <div className="relative group">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-between pl-9 pr-3 py-2.5 w-36 sm:w-40 rounded-xl border text-sm font-medium outline-none transition-all duration-300 ${
                theme
                  ? "bg-gray-800/60 border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500/50 hover:border-gray-600 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)]"
                  : "bg-white border-gray-200/80 text-gray-700 focus:ring-2 focus:ring-[#9b001c]/20 hover:border-gray-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]"
              }`}
            >
              <div
                className={`absolute left-3 flex items-center pointer-events-none transition-colors ${
                  theme ? "text-gray-400 group-hover:text-blue-400" : "text-gray-500 group-hover:text-[#9b001c]"
                }`}
              >
                <HiFilter className="w-4 h-4" />
              </div>
              <span className="truncate mr-2">
                {filterOptions.find((opt) => opt.value === filterType)?.label}
              </span>
              <HiChevronDown
                className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""} ${
                  theme ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </button>

            {isFilterOpen && (
              <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
            )}

            {isFilterOpen && (
              <div
                className={`absolute right-0 z-20 mt-2 w-44 rounded-xl border py-1.5 shadow-xl backdrop-blur-md transform transition-all duration-200 origin-top-right ${
                  theme
                    ? "bg-gray-800/95 border-gray-700 text-gray-200 shadow-black/40"
                    : "bg-white/95 border-gray-100 text-gray-700 shadow-gray-200/50"
                }`}
              >
                {filterOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setFilterType(option.value);
                      setSearchQuery("");
                      setIsFilterOpen(false);
                    }}
                    className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                      filterType === option.value
                        ? theme
                          ? "bg-blue-500/10 text-blue-400 font-bold"
                          : "bg-[#9b001c]/5 text-[#9b001c] font-bold"
                        : theme
                          ? "hover:bg-gray-700/50"
                          : "hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                    {filterType === option.value && (
                      <span className={`w-1.5 h-1.5 rounded-full ${theme ? "bg-blue-400" : "bg-[#9b001c]"}`}></span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🔍 સર્ચ ઇનપુટ */}
          <div className="relative group">
            <div
              className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
                theme ? "text-gray-400 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-[#9b001c]"
              }`}
            >
              <HiSearch className="w-4 h-4" />
            </div>
            <input
              type={inputConfig.type}
              placeholder={inputConfig.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2.5 w-full sm:w-48 lg:w-64 xl:w-72 rounded-xl border text-sm outline-none transition-all duration-300 ease-in-out focus:w-full sm:focus:w-56 lg:focus:w-72 xl:focus:w-80 ${
                theme
                  ? "bg-gray-800/60 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-gray-600 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)]"
                  : "bg-white border-gray-200/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#9b001c]/20 focus:border-[#9b001c] hover:border-gray-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]"
              }`}
            />
          </div>

        </div>
      </div>

      {/* 🗂️ ડેટા ટેબલ સેક્શન */}
      <div
        className={`rounded-2xl border shadow-sm overflow-hidden p-2 ${
          theme ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        <Table
          columns={columns}
          data={finalTableData}
          keyExtractor={(student) => student.suid}
          emptyMessage={
            searchQuery
              ? `No student matches "${searchQuery}"`
              : "No registered students found in this department pipeline yet."
          }
        />
      </div>

    </div>
  );
}