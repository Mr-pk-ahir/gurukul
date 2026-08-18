import axios, { AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || fallback;
};

export const sectionService = {
  // 1. સેક્શન ક્રિએટ કરવા માટે
  createSection: async (data: {
    name: string;
    departmentId: number;
    description?: string;
    sectionHead?: number | string | null;
  }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/sections/create`, data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to create section'), { cause: error });
    }
  },

  // 2. સેક્શન અપડેટ કરવા માટે (name / description / section head बदलવા)
  updateSection: async (
    sectionId: number,
    data: {
      name?: string;
      description?: string;
      sectionHead?: number | string | null;
    }
  ) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/sections/update/${sectionId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to update section'), { cause: error });
    }
  },

  // 3. બધા સેક્શન લાવવા માટે (List page માટે)
  getAllSections: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sections`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch sections'), { cause: error });
    }
  },

  // 4. એક Section ID પ્રમાણે લાવવા માટે
  getSectionById: async (sectionId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sections/${sectionId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch section'), { cause: error });
    }
  },

  // 5. Department પ્રમાણે Sections લાવવા માટે (User-Create dropdown માટે પણ વાપરી શકાય)
  getSectionsByDepartment: async (departmentId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sections/department/${departmentId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch sections for department'), { cause: error });
    }
  },

  // 6. Section ડિલીટ કરવા માટે
  deleteSection: async (sectionId: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/sections/${sectionId}`);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to delete section'), { cause: error });
    }
  },
};