export interface ApplicationPayload {
    name: string;
    suid: number;
    subject: string;
    departmentId: number;
    sectionId: number;
    description?: string;
}

export interface ApplicationType {
    id: number;
    name: string;
};

export interface DropdownOptionLike {
    value: number | string;
    label: string;
    departmentId?: number | string;
}

export interface UserDropdownOption extends DropdownOptionLike {
    suid: number;
    departmentId: number;
    sectionId: number;
}