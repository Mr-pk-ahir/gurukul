import React, { useState } from "react";
import { useTheme } from "../../../components/theme/ThemeContext";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import DescriptionInput from "../../../components/common/DescriptionInput";
import SearchableDropdown from "../../../components/common/SearchableDropdown";

import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { FaBuilding } from "react-icons/fa";

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Create Department ઓબ્જેક્ટ API માટે રેડી છે:", formData);
        // અહિયાં તમે API કોલ કરી શકો છો, બેકએન્ડ જાતે જ નવો ૬-ડિજિટ ID એસાઇન કરી દેશે.
    };

    return (
        <div className={`max-w-4xl mx-auto p-6 rounded-2xl shadow-md mt-6 transition-all duration-200 border ${theme ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
            }`}>
            <div className="mb-6 border-b pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 border-neutral-200 dark:border-gray-300">
                <div className={`w-16 h-16 text-white rounded-full shadow-lg shadow-black ${theme ? 'bg-linear-to-bl from-blue-300 to-blue-900' : 'bg-linear-to-bl from-red-300 to-red-900'} flex items-center justify-center mb-2`}>
                    <FaBuilding size={24} />
                </div>
                <h2 className={`text-4xl font-bold ${theme ? "text-blue-200" : "text-red-600"}`}>
                    Create Department & Allocate Head
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">

                {/* 🌟 રો ૧: Department Name અને Head Selection એક જ લાઇનમાં */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${theme ? "text-gray-300" : "text-neutral-700"}`}>
                            Department Name
                        </label>
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

                    <SearchableDropdown
                        label="Assign Department Head"
                        placeholder="Search and select head..."
                        searchPlaceholder="Type name to search..."
                        options={AVAILABLE_HEADS}
                        selectedId={formData.departmentHeadId}
                        onSelect={(id) => setFormData(prev => ({ ...prev, departmentHeadId: id }))}
                        required
                    />
                </div>

                {/* રો ૨: Description */}
                <div>
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

                {/* સબમિટ બટન */}
                <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-gray-800 transition-colors duration-200">
                    <Button
                        type="submit"
                        className={theme ? "bg-blue-600 hover:bg-blue-700" : "bg-red-500 hover:bg-red-600"}
                    >
                        Create Department
                    </Button>
                </div>
            </form>
        </div>
    );
}