import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../../components/theme/ThemeContext";
import Table from "../../../components/common/Table";
import { HiOutlineSearch, HiOutlineUserGroup } from "react-icons/hi";

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

  const [searchTerm, setSearchTerm] = useState("");

  // 🗃️ માસ્ટર સ્ટુડન્ટ લિસ્ટ (મિક્સ ડિપાર્ટમેન્ટ ડેટા)
  const allStudents: UserCreate[] = [
    { suid: "SUID-1001", name: "Aarav Mehta", username: "aarav_mehta", roleCode: "STUDENT", departmentId: 4, sectionId: 1, standard: "10th-A" },
    { suid: "SUID-1002", name: "Diya Patel", username: "diya_patel", roleCode: "STUDENT", departmentId: 4, sectionId: 2, standard: "12th-B" },
    { suid: "SUID-2001", name: "Rajesh Kumar", username: "rajesh_k", roleCode: "STUDENT", departmentId: 10, sectionId: 0, standard: "Not Required" },
    { suid: "SUID-2002", name: "Megha Patel", username: "megha_p", roleCode: "STAFF", departmentId: 10, sectionId: 0, standard: "Not Required" },
    { suid: "SUID-3001", name: "Smit Shah", username: "smit_shah", roleCode: "STUDENT", departmentId: 20, sectionId: 0, standard: "Not Required" },
  ];

  // 🎯 ૧. જે તે ડિપાર્ટમેન્ટ પ્રમાણે ડેટા આઇસોલેશન (Isolation)
  const deptFilteredStudents = allStudents.filter(s => s.departmentId === currentDeptId);

  // 🔍 ૨. નામ અથવા SUID થી સર્ચ ફિલ્ટર
  const finalTableData = deptFilteredStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.suid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = deptFilteredStudents.length;

  // 📋 ટેબલ કોલમ કન્ફિગ્યુરેશન
  const columns = [
    { 
      header: "SUID (PK)", 
      className: "w-32 text-center font-mono font-bold text-blue-600 dark:text-blue-400", 
      accessor: (student: UserCreate) => student.suid 
    },
    { 
      header: "Full Name", 
      className: "text-left font-semibold text-gray-800 dark:text-neutral-200", 
      accessor: (student: UserCreate) => student.name 
    },
    { 
      header: "Username", 
      className: "text-left text-gray-500 font-mono text-xs", 
      accessor: (student: UserCreate) => `@${student.username}` 
    },
    { 
      header: "Role", 
      className: "text-center", 
      accessor: (student: UserCreate) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
          student.roleCode === "STUDENT" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
        }`}>
          {student.roleCode}
        </span>
      ) 
    },
    // ⚠️ કન્ડિશનલ કોલમ ડેટા: જો ડિપાર્ટમેન્ટ 4 (Academic) હોય તો જ ક્લાસ દેખાડવો
    { 
      header: "Academic Class", 
      className: "text-center font-medium", 
      accessor: (student: UserCreate) => (
        <span className={`text-sm ${student.departmentId === 4 ? "text-gray-700 dark:text-neutral-300" : "text-gray-400 italic"}`}>
          {student.departmentId === 4 ? student.standard : "N/A (Dept 0)"}
        </span>
      ) 
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      
      {/* 🏷️ હેડર સેક્શન */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-4 gap-4">
        <div>
          <h2 className={`text-2xl font-black tracking-tight ${theme ? "text-blue-400" : "text-gray-900"}`}>
            Official Student Roster
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Isolated Registry for <span className="font-bold text-blue-600">Department ID: {currentDeptId}</span>
          </p>
        </div>

        {/* 📊 મોડ્યુલ સ્ટેટ્સ કાઉન્ટર */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 px-4 py-2 rounded-xl border border-gray-100 self-start md:self-auto">
          <HiOutlineUserGroup className="text-xl text-blue-500" />
          <div>
            <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Active Users</div>
            <div className="text-lg font-mono font-bold text-gray-800 dark:text-neutral-200">{totalStudents} Total</div>
          </div>
        </div>
      </div>

      {/* 🔍 સર્ચ બાર કમ્પોનન્ટ */}
      <div className="max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <HiOutlineSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name or SUID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white dark:bg-neutral-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* 🗂️ ડેટા ટેબલ સેક્શન */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-2">
        <Table 
          columns={columns} 
          data={finalTableData} 
          keyExtractor={(student) => student.suid} 
          emptyMessage={
            searchTerm 
              ? "No student matches your search query." 
              : "No registered students found in this department pipeline yet."
          } 
        />
      </div>

    </div>
  );
}