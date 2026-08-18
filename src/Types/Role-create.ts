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
    id: string | number;
    username: string;
    email?: string;
    roleName: string;
    roleCode: string;
    // 🎯 અહીં 'any' ઉમેરો જેથી જો JSON.parse() વખતે ડેટા થોડો અલગ હોય તો એરર ના આવે
    permissions: ModulePermissions | any; 
    departmentId?: number | null;
    sectionId?: number | null;
}