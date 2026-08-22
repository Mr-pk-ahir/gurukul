import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export interface UserProgress {
  suid: number;
  name: string;
  avatar: string | null;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
}

export interface SectionProgress {
  section_id: number;
  name: string;
  department_id: number;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  users: UserProgress[];
}

export interface DepartmentProgress {
  department_id: number;
  department_name: string;
  totalTasks: number;
  completedTasks: number;
  percentage: number;
  sections: SectionProgress[];
}

export interface DepartmentSummary {
  department_id: number;
  department_name: string;
  percentage: number;
}

export const progressService = {
  getAllDepartmentsProgress: async (): Promise<{ success: boolean; data: DepartmentSummary[] }> => {
    try {
      const response = await axios.get(`${API_URL}/progress/departments`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch departments progress');
    }
  },

  getDepartmentProgress: async (departmentId: number): Promise<{ success: boolean; data: DepartmentProgress }> => {
    try {
      const response = await axios.get(`${API_URL}/progress/department/${departmentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch department progress');
    }
  },

  getSectionProgress: async (sectionId: number): Promise<{ success: boolean; data: SectionProgress }> => {
    try {
      const response = await axios.get(`${API_URL}/progress/section/${sectionId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch section progress');
    }
  },

  getUserProgress: async (suid: number): Promise<{ success: boolean; data: UserProgress }> => {
    try {
      const response = await axios.get(`${API_URL}/progress/user/${suid}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user progress');
    }
  },
};