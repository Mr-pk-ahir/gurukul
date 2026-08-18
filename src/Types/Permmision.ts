// Types/Permmision.ts

export interface PermissionAction {
    create: boolean;
    edit: boolean;
    view: boolean;
    delete: boolean;
    [key: string]: boolean; // ડાયનેમિક action માટે
}

export type Permission = {
    // 🎯 FIX: ફિક્સ કી ના બદલે ડાયનેમિક કી આપો જેથી backend ના ગમે તે મોડ્યુલ નામ ચાલી જાય
    [moduleName: string]: PermissionAction;
};