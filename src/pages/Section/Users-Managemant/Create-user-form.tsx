import React, { useState } from "react";
import { useTheme } from "../../../components/theme/ThemeContext";

import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import SearchableDropdown from "../../../components/common/SearchableDropdown";

import { HiOutlineUser, HiOutlineClock, HiOutlineIdentification, HiOutlineCalendar } from "react-icons/hi";
import type { UserCreate } from "../../../Types/User-create";

export default function CreateUserForm() {
  const { theme } = useTheme();

  const [formData, setFormData] = useState<UserCreate>({
    suid: 0, 
    name: "",
    username: "",
    password: "",
    department: 0,
    section: 0,
    standard: 0,
    role: "",
    joiningDate: "",
    permissions: {
      department: { create: false, edit: false, view: true, delete: false },
      createuser: { create: false, edit: false, view: true, delete: false },
    },
  });

  const departments = [
    { id: 1, name: "Admin" },
    { id: 2, name: "HR" },
    { id: 3, name: "Account" },
    { id: 4, name: "Academic" },
  ];

  const sections = [
    { id: 10, name: "Section A" },
    { id: 20, name: "Section B" },
    { id: 30, name: "Section C" },
  ];

  const standards = [
    { id: 9, name: "9th Standard" },
    { id: 10, name: "10th Standard" },
    { id: 11, name: "11th Standard" },
    { id: 12, name: "12th Standard" },
  ];

  const roles = [
    { id: 101, name: "Admin" },
    { id: 102, name: "Teacher" },
    { id: 103, name: "Clerk" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === "suid" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("ટાઇપ સેફ ઓબ્જેક્ટ API માટે રેડી છે:", formData);
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 rounded-2xl shadow-md mt-6 transition-all duration-200 border ${
      theme ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
    }`}>
      <h2 className={`text-2xl font-bold mb-6 border-b pb-3 transition-colors ${
        theme ? "border-gray-800 text-blue-200" : "border-neutral-200 text-red-600"
      }`}>
        Create New User
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* રો ૧: SUID અને પૂરું નામ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${theme ? "text-gray-300" : "text-neutral-700"}`}>User ID (SUID)</label>
            <Input
              type="number"
              name="suid"
              value={formData.suid ? String(formData.suid) : ""}
              onChange={handleInputChange}
              icon={<HiOutlineIdentification className="text-lg" />}
              placeholder="Ex: 101"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${theme ? "text-gray-300" : "text-neutral-700"}`}>Full Name</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              icon={<HiOutlineUser className="text-lg" />}
              placeholder="Enter full name"
              required
            />
          </div>
        </div>

        {/* રો ૨: યુઝરનેમ અને પાસવર્ડ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${theme ? "text-gray-300" : "text-neutral-700"}`}>Username</label>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              icon={<HiOutlineUser className="text-lg" />}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${theme ? "text-gray-300" : "text-neutral-700"}`}>Password</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              icon={<HiOutlineClock className="text-lg" />}
              placeholder="Enter password"
              required
            />
          </div>
        </div>

        {/* રો ૩: Department અને Section (નંબર આઈડી સપોર્ટેડ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchableDropdown
            label="Department"
            placeholder="Select Department"
            searchPlaceholder="Search department..."
            options={departments}
            selectedId={formData.department}
            onSelect={(id) => setFormData((prev) => ({ ...prev, department: id }))}
            required
          />

          <SearchableDropdown
            label="Section"
            placeholder="Select Section"
            searchPlaceholder="Search section..."
            options={sections}
            selectedId={formData.section}
            onSelect={(id) => setFormData((prev) => ({ ...prev, section: id }))}
            required
          />
        </div>

        {/* રો ૪: Standard, Role, અને Joining Date */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchableDropdown
            label="Standard"
            placeholder="Select Standard"
            searchPlaceholder="Search standard..."
            options={standards}
            selectedId={formData.standard}
            onSelect={(id) => setFormData((prev) => ({ ...prev, standard: id }))}
            required
          />

          {/* Role ડ્રોપડાઉન - જે ઓબ્જેક્ટમાંથી નામ (string) સેટ કરશે */}
          <SearchableDropdown
            label="Role"
            placeholder="Select Role"
            searchPlaceholder="Search role..."
            options={roles}
            selectedId={roles.find(r => r.name === formData.role)?.id || ""}
            onSelect={(id) => {
              const selectedRoleName = roles.find(r => r.id === id)?.name || "";
              setFormData((prev) => ({ ...prev, role: selectedRoleName }));
            }}
            required
          />

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${theme ? "text-gray-300" : "text-neutral-700"}`}>Joining Date</label>
            <Input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleInputChange}
              icon={<HiOutlineCalendar className="text-lg" />}
              required
            />
          </div>
        </div>

        {/* સબમિટ బటన్ */}
        <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-gray-800 transition-colors duration-200">
          <Button
            type="submit"
            className={theme ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-200/20" : "bg-red-500 hover:bg-red-600"}
          >
            Create User
          </Button>
        </div>
      </form>
    </div>
  );
}