import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


export const uploadService = {
  uploadAvatar: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.post(`${API_URL}/upload/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Upload failed");
      }
      return response.data.url;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to upload avatar");
    }
  },

  uploadSectionImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(`${API_URL}/upload/section`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Upload failed");
      }
      return response.data.url;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to upload image");
    }
  },
};