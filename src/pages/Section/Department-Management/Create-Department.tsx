import React, { useState } from "react";
import { useTheme } from "../../../components/theme/ThemeContext";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import DescriptionInput from "../../../components/common/DescriptionInput";
import SearchableDropdown from "../../../components/common/SearchableDropdown";

import {
    HiOutlineOfficeBuilding,
    HiOutlineUserGroup,
    HiOutlineDocumentText,
} from "react-icons/hi";
import { FaBuilding } from "react-icons/fa";

// 🌟 ફોર્મને વિઝ્યુઅલી ગ્રુપ કરવા માટેનું નાનું હેડર — CreateUserForm માંથી
// સેમ pattern, જેથી બંને ફોર્મ્સ વચ્ચે consistency રહે
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

// 🌟 બેકએન્ડ ID જાતે બનાવશે એટલે અહિયાંથી departmentId કાઢી નાખ્યું છે
export interface DepartmentCreate {
    departmentName: string;
    departmentHeadId: number | "";
    description: string;
}

// 👥 Mock ડેટા (ભવિષ્યમાં આ ૬-ડિજિટ ID વાળા ડેટા API દ્વારા આવશે)
const AVAILABLE_HEADS = [
    { id: 221355, name: "Rahul Patel (Admin)" },
    { id: 334512, name: "Sneha Sharma (Senior Prof.)" },
    { id: 112233, name: "Amit Shah (HOD)" },
    { id: 998877, name: "Priya Desai (Coordinator)" },
];

export default function CreateDepartment() {
    const { theme } = useTheme();

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [formData, setFormData] = useState<DepartmentCreate>({
        departmentName: "",
        departmentHeadId: "",
        description: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            console.log("Create Department ઓબ્જેક્ટ API માટે રેડી છે:", formData);
            // 🎯 અહિયાં તમે API કોલ કરી શકો છો, બેકએન્ડ જાતે જ નવો ૬-ડિજિટ ID એસાઇન કરી દેશે.
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
                    <FaBuilding size={24} />
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme ? "text-blue-200" : "text-red-600"}`}>
                    Create Department & Allocate Head
                </h2>
                <p className={`text-sm max-w-md ${theme ? "text-gray-400" : "text-neutral-500"}`}>
                    Fill in the details below to register a new department and assign its head.
                </p>
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

                {/* ===== Department Identity section ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineOfficeBuilding size={15} />} title="Department Identity" theme={theme} />
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Department Name *</label>
                        <Input
                            type="text"
                            name="departmentName"
                            value={formData.departmentName}
                            onChange={handleInputChange}
                            icon={<HiOutlineOfficeBuilding className="text-lg" />}
                            placeholder="Enter department name"
                            required
                        />
                    </div>
                </div>

                {/* ===== Head Allocation section ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineUserGroup size={15} />} title="Head Allocation" theme={theme} />
                    <div>
                        <SearchableDropdown
                            label="Assign Department Head *"
                            placeholder="Search and select head..."
                            searchPlaceholder="Type name to search..."
                            options={AVAILABLE_HEADS}
                            selectedId={formData.departmentHeadId}
                            onSelect={(id) => setFormData((prev) => ({ ...prev, departmentHeadId: id }))}
                            required
                        />
                    </div>
                </div>

                {/* ===== Description section ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineDocumentText size={15} />} title="Description" theme={theme} />
                    <DescriptionInput
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        maxLength={300}
                        placeholder="Enter department description or core details..."
                        label="Description"
                        required={false}
                    />
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
                        ) : (
                            "Create Department"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}