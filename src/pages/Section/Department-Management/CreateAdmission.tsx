import React, { useState } from "react";
import { useTheme } from "../../../components/theme/ThemeContext";
import Input from "../../../components/common/Input";
import { HiOutlineUser, HiOutlineLibrary } from "react-icons/hi";
import { FaBuilding } from "react-icons/fa";
// import SearchableDropdown from "../../../components/common/SearchableDropdown";

export default function CreateAdmission() {
    const { theme } = useTheme();
    const [applicantName, setApplicantName] = useState("");
    const [applicantSuid, setApplicantSuid] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();

        // ૧. નવી રિક્વેસ્ટ ઓબ્જેક્ટ બનાવવો
        const newRequest = {
            id: Math.floor(100 + Math.random() * 900), // Random 3 Digit Req ID
            applicantName,
            applicantSuid,
            departmentId: Number(departmentId),
            requestDate: new Date().toLocaleDateString("en-GB"), // DD/MM/YYYY
            status: "PENDING",
        };

        // ૨. લોકલસ્ટોરેજમાં ઓલરેડી રહેલી રિક્વેસ્ટ મેળવીને નવી એડ કરવી (Real-time syncing)
        const existingRequests = localStorage.getItem("admission_requests");
        const requestsList = existingRequests ? JSON.parse(existingRequests) : [];
        requestsList.push(newRequest);

        localStorage.setItem("admission_requests", JSON.stringify(requestsList));

        // ૩. ફોર્મ ક્લિયર કરવું
        setApplicantName("");
        setDepartmentId("");
        setSuccessMsg("Admission request submitted successfully to Admin Pipeline!");
        setTimeout(() => setSuccessMsg(""), 4000);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 border-neutral-200 dark:border-gray-300">
                <div className={`w-16 h-16 text-white rounded-full shadow-lg shadow-black ${theme ? 'bg-linear-to-bl from-blue-300 to-blue-900' : 'bg-linear-to-bl from-red-300 to-red-900'} flex items-center justify-center mb-2`}>
                    <FaBuilding size={24} />
                </div>
                <h2 className={`text-4xl font-bold ${theme ? "text-blue-200" : "text-red-600"}`}>
                    Create Department & Allocate Head
                </h2>
            </div>

            {successMsg && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-bold shadow-sm">
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleApply} className={` p-6 rounded-2xl border border-gray-800 shadow-sm space-y-5`}>
                <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase text-gray-400">Full Name</label>
                    <Input
                        type="text"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="Enter full name"
                        required
                        icon={<HiOutlineUser className="text-gray-400" />}
                    />
                    <label className="block text-xs font-bold mb-1.5 mt-6 uppercase text-gray-400">Suid</label>
                    <Input
                        type={"number"}
                        value={"applicantSuid"}
                        required
                        onChange={(e) => setApplicantSuid(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold mb-2 uppercase text-gray-400">Department ID</label>
                        <Input
                            type="number"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            placeholder="e.g. 10 or 4"
                            required
                            icon={<HiOutlineLibrary className="text-gray-400" />}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                    Submit Admission Request
                </button>
            </form>
        </div>
    );
}