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
    HiCamera,
    HiOutlineOfficeBuilding,
    HiOutlineCalendar,
    HiOutlineShieldCheck,
} from "react-icons/hi";
import type { UserCreate } from "../../../Types/User-create";
import { FaUserCircle } from "react-icons/fa";

// 🌟 ફોર્મને વિઝ્યુઅલી ગ્રુપ કરવા માટેનું નાનું હેડર — દરેક સેક્શનને
// label + icon + thin divider આપે છે, જે scanning ઝડપી બનાવે છે
function SectionHeading({
    icon,
    title,
    theme,
}: {
    icon: React.ReactNode;
    title: string;
    theme: boolean;
}) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <span
                className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${theme ? "bg-blue-500/10 text-blue-300" : "bg-red-500/10 text-red-600"
                    }`}
            >
                {icon}
            </span>
            <h3
                className={`text-xs font-semibold uppercase tracking-wider ${theme ? "text-gray-400" : "text-neutral-500"
                    }`}
            >
                {title}
            </h3>
            <div className={`flex-1 h-px ${theme ? "bg-gray-800" : "bg-neutral-200"}`} />
        </div>
    );
}

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
        bod: new Date().toISOString().split("T")[0],
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
        <div
            className={`max-w-7xl mx-auto p-6 sm:p-8 rounded-2xl shadow-sm mt-6 border transition-all duration-200 ${theme ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
                }`}
        >
            {/* ===== Header ===== */}
            <div className="mb-8 pb-6 border-b flex flex-col items-center text-center gap-2 border-neutral-200 dark:border-gray-800">
                <div
                    className={`w-16 h-16 text-white rounded-full shadow-lg ${theme
                            ? "bg-linear-to-bl from-blue-300 to-blue-900 shadow-blue-950/40"
                            : "bg-linear-to-bl from-red-300 to-red-900 shadow-red-950/20"
                        } flex items-center justify-center mb-1`}
                >
                    <FaUserCircle size={24} />
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme ? "text-blue-200" : "text-red-600"}`}>
                    {isFromPipeline ? "Onboard Approved Applicant" : "Create User & Allocate Head"}
                </h2>
                <p className={`text-sm max-w-md ${theme ? "text-gray-400" : "text-neutral-500"}`}>
                    {isFromPipeline
                        ? "Review the applicant's details below, then confirm to generate their account."
                        : "Fill in the details below to add a new user to the system."}
                </p>
                {isFromPipeline && (
                    <span
                        className={`inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-medium ${theme ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-700"
                            }`}
                    >
                        Processing Request <span className="font-bold">#{incomingData.id}</span>
                    </span>
                )}
            </div>

            {/* ===== Error banner ===== */}
            {errorMessage && (
                <div
                    role="alert"
                    className={`mb-6 flex items-start gap-2.5 p-3.5 rounded-xl text-sm font-medium border ${theme
                            ? "bg-red-500/10 text-red-300 border-red-500/20"
                            : "bg-red-50 text-red-700 border-red-100"
                        }`}
                >
                    <span className="mt-0.5 shrink-0">⚠</span>
                    <span>{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* ===== Avatar ===== */}
                <div className="flex flex-col items-center justify-center gap-2">
                    <label
                        className={`relative w-40 h-30 rounded-3xl overflow-hidden border-2 ${theme ? "border-blue-500/60" : "border-red-500/60"
                            } flex items-center justify-center shrink-0 cursor-pointer group transition-shadow ring-4 ${theme ? "ring-blue-500/5 hover:ring-blue-500/10" : "ring-red-500/5 hover:ring-red-500/10"
                            }`}
                    >
                        {formData.avatar ? (
                            <img src={formData.avatar} alt="Selected Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span
                                className={`flex items-center justify-center w-full h-full ${theme ? "bg-gray-800 text-gray-500" : "bg-neutral-100 text-neutral-400"
                                    }`}
                            >
                                <HiOutlineUser className="text-5xl" />
                            </span>
                        )}

                        {/* 📷 હોવર ઇફેક્ટ: માઉસ લઈ જતાં બ્લેક શેડો અને કેમેરા દેખાશે */}
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <HiCamera className="text-white text-2xl" />
                            <span className="text-white text-[10px] font-medium">Upload</span>
                        </div>

                        {/* છુપાયેલું ફાઇલ ઇનપુટ */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                    <p className={`text-xs ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                        Profile photo (optional)
                    </p>
                </div>

                {/* ===== Identity section ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineIdentification size={15} />} title="Identity" theme={theme} />
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
                </div>

                {/* ===== Role & department section ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineShieldCheck size={15} />} title="Role & Department" theme={theme} />
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
                            <div
                                className={`flex items-center gap-2.5 border border-dashed rounded-xl p-4 text-xs ${theme
                                        ? "border-gray-700 bg-gray-800/30 text-gray-500"
                                        : "border-neutral-200 bg-neutral-50/50 text-neutral-400"
                                    }`}
                            >
                                <HiOutlineOfficeBuilding className="text-base shrink-0" />
                                Department allocation is only available for the Department Head role.
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== Account section ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineKey size={15} />} title="Account Credentials" theme={theme} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                </div>

                {/* ===== Dates section ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineCalendar size={15} />} title="Important Dates" theme={theme} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DatePicker
                            label="Joining Date *"
                            selectedValue={formData.joiningDate}
                            onChange={(dateStr) => setFormData((prev) => ({ ...prev, joiningDate: dateStr }))}
                            required
                        />
                        <DatePicker
                            label="BOD *"
                            selectedValue={formData.bod}
                            onChange={(dateStr) => setFormData((prev) => ({ ...prev, bod: dateStr }))}
                            required
                        />
                    </div>
                </div>

                {/* ===== Submit ===== */}
                <div className="flex justify-end items-center gap-3 pt-6 border-t border-neutral-200 dark:border-gray-800">
                    <p className={`text-xs mr-auto hidden sm:block ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                        Fields marked * are required.
                    </p>
                    <Button
                        type="submit"
                        disabled={loading}
                        className={`${theme ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"} min-w-45 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                Processing...
                            </span>
                        ) : isFromPipeline ? (
                            "Confirm & Generate User"
                        ) : (
                            "Create User Profile"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}