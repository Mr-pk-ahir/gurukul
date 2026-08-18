
/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default async function userDelete(userId: number) {
    try {
        await fetch(`${API_URL}/users/delete/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

    } catch (error: any) {
        console.error("Error deleting user:", error);
    }
}
