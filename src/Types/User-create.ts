
import type { Permission } from "./Permmision"; 

export type UserCreate = {
    suid: number;
    department: number;
    name: string;
    section: number;
    standard: number;
    username: string;
    password: string;
    role: string;
    joiningDate: string;
    permissions: Permission;
};