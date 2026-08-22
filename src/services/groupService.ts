/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"; // 👈 tamara existing api client no actual path check kari levo

export interface GroupMember {
    suid: number;
    name: string;
    role_code?: string;
}

export interface GroupData {
    group_id: number;
    group_name: string;
    description: string | null;
    created_by: number;
    created_by_name?: string;
    members: GroupMember[];
    created_at?: string;
}

export interface CreateGroupPayload {
    group_name: string;
    description?: string;
    member_ids: number[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// 🎯 NAVU: "pehla add thay te leader" — created_by j group no leader chhe (group banavnar).
// Navbar/GroupMemberDetail banne j helper thi consistent rite gold-star nakki karshe.
export const isGroupLeader = (group: Pick<GroupData, "created_by">, suid?: number | null): boolean => {
    if (!suid) return false;
    return group.created_by === suid;
};

export const groupService = {
    createGroup: async (payload: CreateGroupPayload) => {
        try {
            const res = await axios.post(`${API_URL}/groups/create`, payload);
            return { success: true, data: res.data?.data ?? res.data };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || "Error creating group" };
        }
    },

    getAllGroups: async () => {
        try {
            const res = await axios.get(`${API_URL}/groups/list`);
            return { success: true, data: res.data?.data ?? res.data };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || "Error fetching groups" };
        }
    },

    // 🆕 Logged-in user je je groups no member chhe te — Navbar "My Groups" mate
    getGroupsByMember: async (suid: number) => {
        try {
            const res = await axios.get(`${API_URL}/groups/member/${suid}`);
            return { success: true, data: res.data?.data ?? res.data };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || "Error fetching your groups" };
        }
    },

    // 🆕 Edit page prefill karva mate / Group Member Detail page mate
    getGroupById: async (groupId: number) => {
        try {
            const res = await axios.get(`${API_URL}/groups/${groupId}`);
            return { success: true, data: res.data?.data ?? res.data };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || "Error fetching group" };
        }
    },

    updateGroup: async (groupId: number, payload: Partial<CreateGroupPayload>) => {
        try {
            const res = await axios.put(`${API_URL}/groups/${groupId}`, payload);
            return { success: true, data: res.data?.data ?? res.data };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || "Error updating group" };
        }
    },

    deleteGroup: async (groupId: number) => {
        try {
            const res = await axios.delete(`${API_URL}/groups/${groupId}`);
            return { success: true, data: res.data };
        } catch (error: any) {
            return { success: false, message: error?.response?.data?.message || "Error deleting group" };
        }
    },
};