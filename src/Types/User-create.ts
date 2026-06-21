// Types/User-create.ts
export type UserCreate = {
    suid: number;
    avatar: string;
    name: string;
    username: string;
    password: string;
    departmentId: number; // 🌟 department માંથી departmentId કર્યું
    sectionId: number;    // 🌟 section માંથી sectionId કર્યું
    standardId: number;   // 🌟 standard માંથી standardId કર્યું
    roleId: number;       // 🌟 નવું ઉમેર્યું
    roleCode: string;     // 🌟 નવું ઉમેર્યું
    joiningDate: string;
    status?: "PENDING" | "APPROVED"; // optional status
};