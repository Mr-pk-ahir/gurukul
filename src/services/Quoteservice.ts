import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export type QuoteType = "activity" | "event";

export interface QuoteData {
  id: number;
  type: QuoteType;
  image_url: string;
  public_id: string;
  description: string | null;
  event_date: string;
  created_at: string;
}

export const quoteService = {
  // 1. Naya activity/event create karo (image + description + date)
  createQuote: async (type: QuoteType, file: File, date: string, description?: string) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);
      formData.append("date", date);
      if (description) formData.append("description", description);

      const response = await axios.post(`${API_BASE_URL}/quotes/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create");
    }
  },

  // 2. Type pramane badha fetch karo
  getQuotesByType: async (type: QuoteType) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quotes/type/${type}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch");
    }
  },

  // 3. Delete karo
  deleteQuote: async (id: number) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/quotes/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete");
    }
  },
};