import { createContext, useContext, useState, type ReactNode } from "react";

interface SidebarViewContextType {
    activeDepartmentId: number | null;
    activeDepartmentName: string | null;
    setActiveDepartment: (id: number | null, name: string | null) => void;
}

const SidebarViewContext = createContext<SidebarViewContextType | undefined>(undefined);

export function SidebarViewProvider({ children }: { children: ReactNode }) {
    const [activeDepartmentId, setActiveDepartmentId] = useState<number | null>(null);
    const [activeDepartmentName, setActiveDepartmentName] = useState<string | null>(null);

    const setActiveDepartment = (id: number | null, name: string | null) => {
        setActiveDepartmentId(id);
        setActiveDepartmentName(name);
    };

    return (
        <SidebarViewContext.Provider value={{ activeDepartmentId, activeDepartmentName, setActiveDepartment }}>
            {children}
        </SidebarViewContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSidebarView() {
    const context = useContext(SidebarViewContext);

    if (!context) {
        throw new Error("useSidebarView must be used within SidebarViewProvider");
    }

    return context;
}
