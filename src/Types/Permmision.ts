// Types/Permmision.ts

export type Permission = {
    department: {
        create: boolean;
        edit: boolean;
        view: boolean;
        delete: boolean;
    };
    createuser: {
        create: boolean;
        edit: boolean;
        view: boolean;
        delete: boolean;
    };
};