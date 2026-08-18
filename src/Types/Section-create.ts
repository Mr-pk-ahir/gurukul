export interface SectionOption {
    section_id: number;
    name: string;
    department_id: number;
    section_head_id?: number | null;
    head_name?: string | null;
}

export interface SectionFormState {
    name: string;
    departmentId: number | "";
    description?: string;
    sectionHead?: number | string | "";
}

// 🎯 IMPORTANT: Backend na section-module.ts ma je ROLE_CODES.SECTION_HEAD
// value che, exact e j value ahi nakhvi. Jo alag hoy to badalvu.
export const SECTION_HEAD_ROLE_CODE = "SECTION_HEAD";