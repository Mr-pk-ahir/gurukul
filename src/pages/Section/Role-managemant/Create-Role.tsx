import React, { useState } from "react";
import { useTheme } from "../../../components/theme/ThemeContext";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Checkbox from "../../../components/common/Checkbox";
import { HiOutlineShieldCheck, HiOutlineDocumentText } from "react-icons/hi";

// 🛠️ આપણો નવો ટાઇપ અહીં ઇમ્પોર્ટ કર્યો
import type { RoleCreate, PermissionRow } from "../../../Types/Role-create";

export default function CreateRole() {
    const { theme } = useTheme();

    const modules = ["Department", "Users", "Roles & Permissions"];

    // 🛠️ useState માં RoleCreate ટાઇપ સેટ કર્યો
    const [formData, setFormData] = useState<RoleCreate>({
        roleName: "",
        roleCode: "",
        description: "",
        permissions: modules.reduce((acc, module) => {
            acc[module] = { create: false, edit: false, view: false, delete: false };
            return acc;
        }, {} as { [key: string]: PermissionRow }),
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (module: string, action: keyof PermissionRow) => {
        setFormData((prev) => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [module]: {
                    ...prev.permissions[module],
                    [action]: !prev.permissions[module][action],
                },
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 🛠️ આ ઓબ્જેક્ટ હવે અદ્દલ તમારા પૂર્વનિર્ધારિત ટાઇપ પ્રમાણે જ API માં જશે
        console.log("ટાઇપ સેફ રોલ ઓબ્જેક્ટ API માટે એકદમ રેડી છે:", formData);
        
        // અહીં ભવિષ્યમાં તમારો API કોલ આવશે:
        // axios.post('/api/roles', formData);
    };

    return (
        <div className={`max-w-4xl mx-auto p-6 rounded-2xl shadow-md mt-6 transition-all duration-200 border ${
            theme ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
        }`}>
            <h2 className={`text-2xl font-bold mb-6 border-b pb-3 ${
                theme ? "border-gray-800 text-blue-200" : "border-neutral-200 text-red-600"
            }`}>
                Create New Role
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ફોર્મ ઇનપુટ્સ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${theme ? "text-gray-300" : "text-neutral-700"}`}>Role Name</label>
                        <Input
                            type="text"
                            name="roleName"
                            value={formData.roleName}
                            onChange={handleInputChange}
                            icon={<HiOutlineShieldCheck className="text-lg" />}
                            placeholder="Ex: HOD, Class Teacher"
                            required
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1.5 ${theme ? "text-gray-300" : "text-neutral-700"}`}>Role Code</label>
                        <Input
                            type="text"
                            name="roleCode"
                            value={formData.roleCode}
                            onChange={handleInputChange}
                            icon={<HiOutlineDocumentText className="text-lg" />}
                            placeholder="Ex: ROLE_HOD"
                            required
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className={`block text-sm font-medium mb-1.5 ${theme ? "text-gray-300" : "text-neutral-700"}`}>Description (Optional)</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Enter role details or responsibilities..."
                        className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all ${
                            theme 
                                ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500" 
                                : "bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-red-500"
                        }`}
                    />
                </div>

                {/* Permissions Matrix */}
                <div>
                    <label className={`block text-sm font-bold mb-3 ${theme ? "text-gray-200" : "text-neutral-800"}`}>
                        Module Permissions
                    </label>
                    <div className={`overflow-hidden border rounded-xl ${theme ? "border-gray-800" : "border-neutral-200"}`}>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`text-xs font-bold uppercase tracking-wider ${theme ? "bg-gray-800 text-gray-300" : "bg-[#9b001c] text-white"}`}>
                                    <th className="p-4">Module Name</th>
                                    <th className="p-4 text-center">Create</th>
                                    <th className="p-4 text-center">Edit</th>
                                    <th className="p-4 text-center">View</th>
                                    <th className="p-4 text-center">Delete</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y text-sm ${theme ? "divide-gray-800 bg-gray-800/20" : "divide-neutral-100 bg-white"}`}>
                                {modules.map((module) => (
                                    <tr key={module} className={theme ? "hover:bg-gray-800/40" : "hover:bg-neutral-50"}>
                                        <td className="p-4 font-semibold">{module}</td>
                                        {(["create", "edit", "view", "delete"] as const).map((action) => (
                                            <td key={action} className="p-4 text-center">
                                                <Checkbox
                                                    checked={formData.permissions[module][action]}
                                                    onChange={() => handlePermissionChange(module, action)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Button */}
                <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-gray-800">
                    <Button
                        type="submit"
                        className={theme ? "bg-blue-600 hover:bg-blue-700" : "bg-red-500 hover:bg-red-600"}
                    >
                        Create Role
                    </Button>
                </div>
            </form>
        </div>
    );
}