
export interface Permission {
    module: string;
    action: 'create' | 'view' | 'edit' | 'delete' | 'upload';
}

const adminPermissions: Permission[] = [
    { module: "departments", action: "view" },
    { module: "departments", action: "create" },
    { module: "departments", action: "edit" },
    { module: "departments", action: "delete" },
    { module: "lessons", action: "view" },
    { module: "lessons", action: "upload" },
    { module: "roles", action: "view" },
    { module: "roles", action: "create" },
    { module: "permissions", action: "view" },
    { module: "permissions", action: "edit" },
    { module: "students", action: "view" },
    { module: "students", action: "edit" },
];

const userPermissions: Permission[] = [
    { module: "departments", action: "view" }, // ફક્ત જોઈ શકશે
    { module: "lessons", action: "view" },
    { module: "students", action: "view" },
];

const getAdminRole = (): string => {
    const adminData = localStorage.getItem("adminData");
    if (adminData) {
        const parsed = JSON.parse(adminData);
        return parsed.role || "user"; 
    }
    return "user";
};

export const hasPermission = (module: string, action: Permission['action']): boolean => {
    const currentRole = getAdminRole();
    
    const permissions = currentRole === 'super-admin' || currentRole === 'admin' 
        ? adminPermissions 
        : userPermissions;
    
    return permissions.some(
        (p) => p.module === module && p.action === action
    );
};