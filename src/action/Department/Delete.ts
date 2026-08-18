/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default async function departmentDelete(departmentId: number) {
    try {
        const response = await fetch(`${API_URL}/departments/delete/${departmentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message);
        }
        if (response.ok) {
            toast.success("Department deleted successfully");
        }
    } catch (error: any) {
        console.error("Error deleting department:", error);
    }
}
