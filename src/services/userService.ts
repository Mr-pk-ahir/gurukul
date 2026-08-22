/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios" // 👈 tamara existing api client no actual path check kari levo (departmentService/sectionService ma je vaparyu hoy e j)

export interface UserData {
    user_id: number;
    name: string;
    email?: string;
    role_code?: string;
    department_id?: number | null;
    section_id?: number | null;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export const userService = {
    getAllUsers: async () => {
        try {
            const res = await axios.get(`${API_URL}/users`);
            return { success: true, data: res.data?.data ?? res.data };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || "Error fetching users" };
        }
    },

    getUserById: async (userId: number) => {
        try {
            const res = await axios.get(`${API_URL}/users/${userId}`);
            return { success: true, data: res.data?.data ?? res.data };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || "Error fetching user" };
        }
    },
};