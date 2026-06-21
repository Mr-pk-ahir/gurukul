import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../../components/theme/ThemeContext";
import Table from "../../../components/common/Table";
import { HiOutlineClock, HiOutlineCheckCircle, HiUsers, HiCheck } from "react-icons/hi";

interface AdmissionRequest {
  id: number;
  applicantName: string;
  requestedRole: string;
  departmentId: number;
  requestDate: string;
  status: "PENDING" | "APPROVED";
}

export default function AdmissionRequestPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { deptId } = useParams<{ deptId: string }>(); 
  const currentDeptId = Number(deptId);

  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED">("PENDING");
  const [allRequests, setAllRequests] = useState<AdmissionRequest[]>([]);

  // 📥 LocalStorage માંથી ડેટા લોડ કરવો
  useEffect(() => {
    const data = localStorage.getItem("admission_requests");
    if (data) {
      setAllRequests(JSON.parse(data));
    }
  }, []);

  // 🔄 સ્ટેટસ APPROVED કરવું અને લોકલસ્ટોરેજમાં અપડેટ કરવું
  const handleApprove = (id: number) => {
    const updated = allRequests.map(req => req.id === id ? { ...req, status: "APPROVED" as const } : req);
    setAllRequests(updated);
    localStorage.setItem("admission_requests", JSON.stringify(updated));
  };

  // 🚀 Redirect to User Create Form with Data State
  const handleCreateUserRedirect = (request: AdmissionRequest) => {
    navigate("/users/create", {
      state: {
        id: request.id, // રીડાયરેક્શન માટે આઈડી પાસ કરી
        applicantName: request.applicantName,
        requestedRole: request.requestedRole,
        departmentId: request.departmentId
      }
    });
  };

  const deptFilteredData = allRequests.filter(r => r.departmentId === currentDeptId);
  const finalTableData = deptFilteredData.filter(r => r.status === activeTab);

  const pendingCount = deptFilteredData.filter(r => r.status === "PENDING").length;
  const approvedCount = deptFilteredData.filter(r => r.status === "APPROVED").length;

  const columns = [
    { header: "Req ID", className: "w-24 text-center font-mono font-bold", accessor: (req: AdmissionRequest) => `#${req.id}` },
    { header: "Applicant Name", className: "text-left font-semibold", accessor: (req: AdmissionRequest) => req.applicantName },
    { 
      header: "Role", 
      className: "text-center", 
      accessor: (req: AdmissionRequest) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${req.requestedRole === "STUDENT" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
          {req.requestedRole}
        </span>
      ) 
    },
    { header: "Date", className: "text-center text-sm text-gray-500", accessor: (req: AdmissionRequest) => req.requestDate },
    {
      header: "Actions",
      className: "text-center w-40",
      accessor: (req: AdmissionRequest) => (
        <div className="flex justify-center items-center">
          {req.status === "PENDING" ? (
            <button
              onClick={() => handleApprove(req.id)}
              className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <HiCheck /> Approve
            </button>
          ) : (
            <button
              onClick={() => handleCreateUserRedirect(req)}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <HiUsers /> Create User
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className={`text-2xl font-black ${theme ? "text-blue-400" : "text-gray-900"}`}>Admission Pipeline</h2>
        <p className="text-sm text-gray-500">Department ID: {currentDeptId}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
        <div onClick={() => setActiveTab("PENDING")} className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${activeTab === "PENDING" ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-600 font-bold" : "border-gray-200 bg-white text-gray-400"}`}>
          <span className="flex items-center gap-2"><HiOutlineClock /> Pending Requests</span>
          <span className="font-mono bg-amber-500 text-white px-2 py-0.5 rounded">{pendingCount}</span>
        </div>

        <div onClick={() => setActiveTab("APPROVED")} className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${activeTab === "APPROVED" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 font-bold" : "border-gray-200 bg-white text-gray-400"}`}>
          <span className="flex items-center gap-2"><HiOutlineCheckCircle /> Approved Outbox</span>
          <span className="font-mono bg-emerald-500 text-white px-2 py-0.5 rounded">{approvedCount}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 shadow-sm p-2">
        <Table columns={columns} data={finalTableData} keyExtractor={(req) => req.id.toString()} emptyMessage="No requests found." />
      </div>
    </div>
  );
}