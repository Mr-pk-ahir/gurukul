export interface PermissionRow {
    create: boolean;
    edit: boolean;
    view: boolean;
    delete: boolean;
    // 🎯 FIX: આ લાઈન ઉમેરવાથી "string can't be used to index type 'PermissionRow'" એરર દૂર થશે
    [key: string]: boolean; 
}

export interface ModulePermissions {
    [moduleName: string]: PermissionRow;
}

export interface RoleCreate {
    roleName: string;
    roleCode: string;
    description?: string;
    permissions: ModulePermissions;
}

export interface AuthUser {
    suid: any;
    id: string | number;
    username: string;
    email?: string;
    roleName: string;
    roleCode: string;
    // 🎯 અહીં 'any' ઉમેરો zodat જો JSON.parse() laikā ડેટા થોડો અલગ હોય તો એરર ના આવે
    permissions: ModulePermissions | any; 
    departmentId?: number | null;
    sectionId?: number | null;
    departmentName?: string | null;
    department_name?: string | null;
}