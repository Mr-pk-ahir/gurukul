export interface PermissionRow {
    create: boolean;
    edit: boolean;
    view: boolean;
    delete: boolean;
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
    permissions: ModulePermissions;
    departmentId?: number | null;
    sectionId?: number | null;
}