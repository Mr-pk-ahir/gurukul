import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || fallback;
};

export const departmentService = {
  // 1. ડિપાર્ટમેન્ટ ક્રિએટ કરવા માટે
  createDepartment: async (data: { departmentName: string; departmentHeadId?: number | string; description?: string }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/departments/create`, data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to create department'), { cause: error });
    }
  },

  // 2. bonke ડિપાર્ટમેન્ટ લાવવા માટે (ડ્રોપડાઉન કે લિસ્ટમાં બતાવવા)
  getAllDepartments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments`);
      return response.data; // { success: true, data: [...] }
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch departments'), { cause: error });
    }
  },

  // 3. ડિપાર્ટમેન્ટ મુજબ યુઝર્સ લાવવા માટે (Section Head સિલેક્ટ કરવા)
  getUsersByDepartment: async (departmentId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/departments/${departmentId}/users`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch department users'), { cause: error });
    }
  }
};