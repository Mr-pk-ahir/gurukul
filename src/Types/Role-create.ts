export interface PermissionRow {
    create: boolean;
    edit: boolean;
    view: boolean;
    delete: boolean;
}

export interface ModulePermissions {
    "Department"?: PermissionRow;
    "Users"?: PermissionRow;
    "Section"?: PermissionRow; // 👑 નવું સેક્શન મોડ્યુલ અહી એડ કર્યું
    "Roles & Permissions"?: PermissionRow;
    "overview-management"?: PermissionRow;
    [moduleName: string]: PermissionRow | undefined; // આ ડાયનેમિક કી રાખવાથી બીજા મોડ્યુલ્સ પણ સપોર્ટ કરશે
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
    departmentId?: number | null; // તમારી જરૂરિયાત મુજબ
    sectionId?: number | null;    // તમારી જરૂરિયાત મુજબ
}