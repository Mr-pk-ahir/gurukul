import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../components/theme/ThemeContext";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import SearchableDropdown from "../../../components/common/SearchableDropdown";
import DatePicker from "../../../components/common/Calendar";
import {
    HiOutlineUser,
    HiOutlineIdentification,
    HiOutlineKey,
    HiOutlineCloudUpload,
    HiCamera
} from "react-icons/hi";
import type { UserCreate } from "../../../Types/User-create";
import { FiUserPlus } from "react-icons/fi";

export default function CreateUserForm() {
    const { theme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // 📥 પાઇપલાઇનમાંથી આવતો ડેટા
    const incomingData = location.state as { id: number; applicantName: string; requestedRole: string; departmentId: number } | null;

    const roles = [
        { id: 101, name: "Department Head", code: "HEAD100" },
        { id: 102, name: "Teacher / Staff", code: "STAFF" },
        { id: 103, name: "Student", code: "STUDENT" },
    ];

    const departments = [
        { id: 4, name: "Academic Main" },
        { id: 10, name: "Primary Section" },
        { id: 20, name: "Secondary Section" },
        { id: 30, name: "Higher Secondary" },
    ];

    const matchedRole = incomingData ? roles.find(r => r.code === incomingData.requestedRole) : null;

    const [formData, setFormData] = useState<UserCreate>({
        suid: Math.floor(100000 + Math.random() * 900000),
        avatar: "",
        name: incomingData?.applicantName || "",
        username: "",
        password: "",
        roleId: matchedRole?.id || 0,
        roleCode: matchedRole?.code || "",
        departmentId: incomingData?.departmentId || 0,
        sectionId: 0,
        standardId: 0,
        joiningDate: new Date().toISOString().split("T")[0],
        status: incomingData ? "APPROVED" : "PENDING"
    });

    const isHeadRole = formData.roleCode === "HEAD100";
    const isFromPipeline = !!incomingData;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "suid" ? (value === "" ? 0 : Number(value)) : value,
        }));
    };

    // 📂 લોકલ ડિવાઇસમાંથી ફાઇલ અપલોડ કરીને Base64 સ્ટ્રિંગ બનાવવી
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file); // ઈમેજને Base64 માં કન્વર્ટ કરશે
        }
    };

    // 🚀 API સબમિશન પ્રોસેસ
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            // 🎯 તમારી સાચી API લિંક અહીં સેટ કરો
            const response = await fetch("https://api.example.com/v1/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("સર્વર પર યુઝર ક્રિએટ કરવામાં સમસ્યા આવી.");
            }

            const result = await response.json();
            console.log("API સક્સેસ રિસ્પોન્સ:", result);

            if (isFromPipeline) {
                const allReqs = localStorage.getItem("admission_requests");
                if (allReqs) {
                    const parsedReqs = JSON.parse(allReqs);
                    const filteredReqs = parsedReqs.filter((r: any) => r.id !== incomingData.id);
                    localStorage.setItem("admission_requests", JSON.stringify(filteredReqs));
                }
                navigate(`/dashboard/departments/${formData.departmentId}/student-list`);
            } else {
                navigate("/dashboard/users/list");
            }

        } catch (error: any) {
            console.error("API Error:", error);
            setErrorMessage(error.message || "કંઈક ખોટું થયું છે, ફરી પ્રયાસ કરો.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`max-w-4xl mx-auto p-6 rounded-2xl shadow-sm mt-6 border transition-all duration-200 ${theme ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
            }`}>

            <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 border-neutral-200 dark:border-gray-300">
                <div className={`w-16 h-16 text-white rounded-full shadow-lg shadow-black ${theme ? 'bg-linear-to-bl from-blue-300 to-blue-900' : 'bg-linear-to-bl from-red-300 to-red-900'} flex items-center justify-center mb-2`}>
                    <FiUserPlus size={24} />
                </div>
                <h2 className={`text-4xl font-bold ${theme ? "text-blue-200" : "text-red-600"}`}>
                    {isFromPipeline ? "Onboard Approved Applicant" : "Create User & Allocate Head"}
                </h2>
                {isFromPipeline && (
                    <p className="text-sm text-gray-500 mt-1">
                        Processing Request ID: <span className="font-bold text-amber-500">#{incomingData.id}</span>
                    </p>
                )}
            </div>

            {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-700 text-sm font-medium">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="p-5 rounded-xl flex items-center justify-center ">
                    <label className={`relative w-30 h-30 rounded-full overflow-hidden border ${theme ? 'border-blue-500' : 'border-red-500'} flex items-center justify-center shadow-inner shrink-0 cursor-pointer group`}>

                        {formData.avatar ? (
                            <img src={formData.avatar} alt="Selected Profile" className="w-full h-full object-cover" />
                        ) : (
                            <HiOutlineUser className="text-5xl text-gray-400" />
                        )}

                        {/* 📷 હોવર ઇફેક્ટ: માઉસ લઈ જતાં બ્લેક શેડો અને કેમેરા દેખાશે */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <HiCamera className="text-white text-2xl" />
                        </div>

                        {/* છુપાયેલું ફાઇલ ઇનપુટ */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">User ID (SUID) *</label>
                        <Input
                            type="number"
                            name="suid"
                            value={formData.suid ? String(formData.suid) : ""}
                            onChange={handleInputChange}
                            icon={<HiOutlineIdentification className="text-lg" />}
                            placeholder="Ex: 5001"
                            required
                            disabled={isFromPipeline}
                            className={isFromPipeline ? "bg-gray-50 dark:bg-gray-800 text-gray-500" : ""}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                        <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            icon={<HiOutlineUser className="text-lg" />}
                            placeholder="Enter full name"
                            required
                            disabled={isFromPipeline}
                            className={isFromPipeline ? "bg-gray-50 dark:bg-gray-800 font-semibold" : ""}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SearchableDropdown
                        label="Select Role *"
                        placeholder="Choose Role"
                        options={roles.map(r => ({ id: r.id, name: `${r.name} (${r.code})` }))}
                        selectedId={formData.roleId || ""}
                        onSelect={(id) => {
                            if (isFromPipeline) return;
                            const selectedRole = roles.find(r => r.id === Number(id));
                            setFormData((prev) => ({
                                ...prev,
                                roleId: Number(id),
                                roleCode: selectedRole ? selectedRole.code : "",
                                ...(selectedRole?.code !== "HEAD100" && { departmentId: 0 })
                            }));
                        }}
                        required
                        disabled={isFromPipeline}
                    />

                    {(isHeadRole || isFromPipeline) ? (
                        <SearchableDropdown
                            label="Assign Department *"
                            placeholder="Choose Department"
                            options={departments}
                            selectedId={formData.departmentId || ""}
                            onSelect={(id) => {
                                if (!isFromPipeline) {
                                    setFormData((prev) => ({ ...prev, departmentId: Number(id) }))
                                }
                            }}
                            required
                            disabled={isFromPipeline}
                        />
                    ) : (
                        <div className="flex items-center justify-center border border-dashed rounded-xl p-4 bg-neutral-50/50 dark:bg-gray-800/30 text-xs text-neutral-400">
                            Department allocation allowed for HEAD100 role only.
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Username *</label>
                        <Input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            icon={<HiOutlineUser className="text-lg" />}
                            placeholder="Ex: rahul_p"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Password *</label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            icon={<HiOutlineKey className="text-lg" />}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div>
                        <DatePicker
                            label="Joining Date *"
                            selectedValue={formData.joiningDate}
                            onChange={(dateStr) => setFormData((prev) => ({ ...prev, joiningDate: dateStr }))}
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-gray-300">
                    <Button
                        type="submit"
                        disabled={loading}
                        className={`${theme ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"} min-w-[180px]`}
                    >
                        {loading ? "Processing..." : isFromPipeline ? "Confirm & Generate User" : "Create User Profile"}
                    </Button>
                </div>
            </form>
        </div>
    );
}