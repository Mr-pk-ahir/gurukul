// Section-create.ts અથવા તમારી ફોર્મની ફાઇલ

export interface SectionOption {
    section_id: number;
    name: string;
    department_id: number;
}

export interface SectionFormState {
    name: string;
    departmentId: number | "";
    description?: string;
}

// તમારી જરૂરિયાત મુજબ અન્ય ટાઇપ્સ પણ અહીં રાખી શકો છો.