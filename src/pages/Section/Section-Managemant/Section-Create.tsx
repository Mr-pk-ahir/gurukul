import React, { useState, useEffect } from "react";
import { useTheme } from "../../../components/theme/ThemeContext";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import SearchableDropdown from "../../../components/common/SearchableDropdown"; // 👑 SearchableDropdown Import karyu

import {
    HiOutlineOfficeBuilding,
    HiOutlineUser,
    HiOutlineClipboardList
} from "react-icons/hi";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

export interface SectionCreate {
    sectionName: string;
    sectionHead: string;
    departmentId: string;
}

interface DropdownOption {
    value: string | number;
    label: string;
}

interface User {
    id: string;
    name: string;
    departmentId: string;
}

export default function CreateSection() {
    const { theme } = useTheme();
    const [loading, setLoading] = useState<boolean>(false);

    // Dropdown Data States (Dropdown Option format ma convert kariyu chhe)
    const [deptOptions, setDeptOptions] = useState<DropdownOption[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [userOptions, setUserOptions] = useState<DropdownOption[]>([]);

    const [formData, setFormData] = useState<SectionCreate>({
        sectionName: "",
        sectionHead: "",
        departmentId: "",
    });

    // Fetch Departments and Users on mount
    useEffect(() => {
        fetchInitialData();
    }, []);

    // Filter users dynamically whenever departmentId changes
    // 1. Filter users dynamically whenever departmentId changes
    useEffect(() => {
        // ખાતરી કરો કે 'users' એરે છે અને તેમાં ડેટા છે
        if (formData.departmentId && Array.isArray(users) && users.length > 0) {
            const associatedUsers = users.filter((user: any) => {
                // ડેટાબેઝના સાચા ફિલ્ડ 'department_id' સાથે સરખામણી
                const userDeptId = user.department_id || user.departmentId;
                return String(userDeptId) === String(formData.departmentId);
            });

            const mappedUsers = associatedUsers.map((u: any) => {
                // જો suid કે id બંને ન હોય તો સેફ્ટી માટે રેન્ડમ કી જશે, જેથી 'undefined' ની એરર ક્યારેય ન આવે
                const uniqueId = u.suid || u.id || `user-${Math.random()}`;
                return {
                    value: uniqueId,
                    label: u.name || "Unknown User",
                };
            });
            setUserOptions(mappedUsers);
        } else {
            setUserOptions([]);
        }
        // જ્યારે ડિપાર્ટમેન્ટ બદલાય ત્યારે સેક્શન હેડ રીસેટ કરવો
        setFormData((prev) => ({ ...prev, sectionHead: "" }));
    }, [formData.departmentId, users]);


    // 2. Fetch Initial Data માં પણ સુધારો
    const fetchInitialData = async () => {
        try {
            const [deptRes, userRes] = await Promise.all([
                fetch(`${API_URL}/departments`),
                fetch(`${API_URL}/users`)
            ]);

            const deptData = await deptRes.json();
            const userData = await userRes.json();

            if (deptData.success && Array.isArray(deptData.data)) {
                const mappedDepts = deptData.data.map((d: any) => {
                    // 👑 જો બેકએન્ડમાંથી department_id, departmentId કે id જે પણ આવે, એને પ્રોપરલી પકડી લેશે
                    const actualId = d.department_id !== undefined ? d.department_id : (d.departmentId !== undefined ? d.departmentId : d.id);
                    const actualName = d.department_name || d.departmentName || d.name || "Unknown";

                    return {
                        value: actualId, // હવે આ ક્યારેય undefined નહીં થાય
                        label: actualName
                    };
                });
                setDeptOptions(mappedDepts);
            }

            if (userData.success) {
                const fetchedUsers = Array.isArray(userData.data) ? userData.data : [];
                setUsers(fetchedUsers);
            }
        } catch (error) {
            toast.error("Failed to load dependency data");
        }
    };

    // Standard handler for text inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Custom handler specifically designed for Searchable Dropdowns
    const handleSelectChange = (name: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value, // આ લાઇન બરાબર છે, પણ ખાતરી કરો કે ટાઇપ સેફ રહે
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation check for dropdowns
        if (!formData.departmentId) {
            toast.error("Please select a department");
            return;
        }
        if (!formData.sectionHead) {
            toast.error("Please assign a section head");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/sections/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.sectionName,
                    departmentId: Number(formData.departmentId),
                    description: `Section Head SUID: ${formData.sectionHead}` // ડિસ્ક્રિપ્શનમાં હેડ આઈડી સેટ કરવા માટે
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Section created successfully");
                setFormData({
                    sectionName: "",
                    sectionHead: "",
                    departmentId: "",
                });
            }
        } catch (error: any) {
            toast.error(error.message || "Error creating section");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`max-w-7xl mx-auto p-6 sm:p-8 rounded-2xl shadow-sm mt-6 border transition-all duration-200 ${theme
                ? "bg-gray-900 border-gray-800 text-white"
                : "bg-white border-neutral-200 text-neutral-900"
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
                    <HiOutlineClipboardList size={24} />
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme ? "text-blue-200" : "text-red-600"}`}>
                    Create Section
                </h2>
                <p className={`text-sm max-w-md ${theme ? "text-gray-400" : "text-neutral-500"}`}>
                    Fill in the details below to register a new section under a department.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* ===== Department Selection ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineOfficeBuilding size={15} />} title="Select Department" theme={theme} />
                    <SearchableDropdown
                        label="Department"
                        placeholder="Select a department"
                        searchPlaceholder="Search departments..."
                        options={deptOptions}
                        selectedValue={formData.departmentId}
                        onSelect={(val) => {
                            // 👑 આ કોન્સોલ લોગ ઉમેરો
                            handleSelectChange("departmentId", val);
                        }}
                        required={true}
                    />
                </div>

                {/* ===== Section Identity ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineOfficeBuilding size={15} />} title="Section Identity" theme={theme} />
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Section Name *</label>
                        <Input
                            type="text"
                            name="sectionName"
                            value={formData.sectionName}
                            onChange={handleInputChange}
                            icon={<HiOutlineOfficeBuilding className="text-lg" />}
                            placeholder="Enter section name"
                            required
                        />
                    </div>
                </div>

                {/* ===== Section Head (User) Selection ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineUser size={15} />} title="Section Head Assignment" theme={theme} />
                    <SearchableDropdown
                        label="Assign Section Head"
                        placeholder={formData.departmentId ? "Select a user as head" : "Please select a department first"}
                        searchPlaceholder="Search users..."
                        options={userOptions}
                        selectedValue={formData.sectionHead}
                        onSelect={(val) => handleSelectChange("sectionHead", val)}
                        disabled={!formData.departmentId}
                        required={true}
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
                        className={`${theme ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
                            } min-w-45 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            "Create Section"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}