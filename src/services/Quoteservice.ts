import axios from 'axios';
import { API_BASE_URL } from './OverviewService';

export type QuoteType = "activity" | "event";
export type EventApprovalStatus = "Approved" | "Rejected" | "Pending";
export type EventStatus = "Active" | "Inactive";
export type HeroSectionChoice = "Yes" | "No";

export interface UpcomingEventMetadata {
  name?: string;
  displayStartDate?: string;
  displayEndDate?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  isApproved?: EventApprovalStatus;
  status?: EventStatus;
  addToHero?: HeroSectionChoice;
}

export interface QuoteData {
  id: number;
  type: QuoteType;
  image_url: string;
  public_id: string;
  description: string | null;
  event_date: string;
  created_at: string;
  name?: string | null;
  display_start_date?: string | null;
  display_end_date?: string | null;
  event_start_date?: string | null;
  event_end_date?: string | null;
  is_approved?: EventApprovalStatus | null;
  status?: EventStatus | null;
  add_to_hero?: HeroSectionChoice | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

function getApiError(error: unknown, fallback: string) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export const quoteService = {
  // 1. Naya activity/event create karo (image + description + date)
  createQuote: async (
    type: QuoteType,
    file: File,
    date: string,
    description?: string,
    metadata?: UpcomingEventMetadata
  ): Promise<ApiResponse<QuoteData>> => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);
      formData.append("date", date);
      if (description) formData.append("description", description);
      if (metadata?.name) formData.append("name", metadata.name);
      if (metadata?.displayStartDate) formData.append("display_start_date", metadata.displayStartDate);
      if (metadata?.displayEndDate) formData.append("display_end_date", metadata.displayEndDate);
      if (metadata?.eventStartDate) formData.append("event_start_date", metadata.eventStartDate);
      if (metadata?.eventEndDate) formData.append("event_end_date", metadata.eventEndDate);
      if (metadata?.isApproved) formData.append("is_approved", metadata.isApproved);
      if (metadata?.status) formData.append("status", metadata.status);
      if (metadata?.addToHero) formData.append("add_to_hero", metadata.addToHero);

      const response = await axios.post(`${API_BASE_URL}/quotes/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiError(error, "Failed to create"), { cause: error });
    }
  },

  // 2. Type pramane badha fetch karo
  getQuotesByType: async (type: QuoteType, includeUnapproved = false): Promise<ApiResponse<QuoteData[]>> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/quotes/type/${encodeURIComponent(type)}`, {
        params: includeUnapproved ? { includeUnapproved: "true" } : undefined,
      });
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiError(error, "Failed to fetch"), { cause: error });
    }
  },

  // 3. Delete karo
  deleteQuote: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/quotes/${id}`);
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiError(error, "Failed to delete"), { cause: error });
    }
  },

  updateQuote: async (
    id: number,
    file: File | null,
    date: string,
    description: string,
    metadata: UpcomingEventMetadata
  ): Promise<ApiResponse<QuoteData>> => {
    try {
      const formData = new FormData();
      if (file) formData.append("image", file);
      formData.append("date", date);
      formData.append("description", description);
      if (metadata.name) formData.append("name", metadata.name);
      if (metadata.displayStartDate) formData.append("display_start_date", metadata.displayStartDate);
      if (metadata.displayEndDate) formData.append("display_end_date", metadata.displayEndDate);
      if (metadata.eventStartDate) formData.append("event_start_date", metadata.eventStartDate);
      if (metadata.eventEndDate) formData.append("event_end_date", metadata.eventEndDate);
      if (metadata.isApproved) formData.append("is_approved", metadata.isApproved);
      if (metadata.status) formData.append("status", metadata.status);
      if (metadata.addToHero) formData.append("add_to_hero", metadata.addToHero);

      const response = await axios.put(`${API_BASE_URL}/quotes/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: unknown) {
      throw new Error(getApiError(error, "Failed to update"), { cause: error });
    }
  },
};