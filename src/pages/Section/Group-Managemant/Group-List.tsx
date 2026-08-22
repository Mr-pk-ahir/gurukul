/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "../../../components/theme/ThemeContext";
import { groupService, type GroupData } from "../../../services/groupService";
import { IoCreateOutline } from "react-icons/io5";
import DataCruding from "../../../components/common/DataCruding"; // 👈 3-dot Edit/Delete component

export default function GroupList() {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const [groups, setGroups] = useState<GroupData[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // ➜ Real API thi groups fetch karo
    const fetchGroups = async () => {
        setLoading(true);
        try {
            const result = await groupService.getAllGroups();
            if (result.success && Array.isArray(result.data)) {
                setGroups(result.data);
            } else {
                toast.error(result.message || "Groups fetch karva ma error");
            }
        } catch (error: any) {
            toast.error(error.message || "Groups fetch karva ma error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleEdit = (groupId: number) => {
        // 🎯 Edit ma click karta j Create Group na j form ma "Edit mode" khuli jay chhe
        navigate(`/dashboard/groups/edit/${groupId}`);
    };

    const handleDelete = async (groupId: number) => {
        if (!window.confirm("Aa group delete karvu chhe?")) return;
        setDeletingId(groupId);
        try {
            const result = await groupService.deleteGroup(groupId);
            if (result.success) {
                toast.success("Group delete thayu");
                setGroups((prev) => prev.filter((g) => g.group_id !== groupId));
            } else {
                toast.error(result.message || "Delete karva ma error");
            }
        } catch (error: any) {
            toast.error(error.message || "Delete karva ma error");
        } finally {
            setDeletingId(null);
        }
    };

    // 👑 Avatar mate name na pahela 1-2 letters
    const getInitials = (name: string) => {
        if (!name) return "?";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    return (
        <div className={`w-full p-6 rounded-2xl ${theme ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Groups</h1>
                <button
                    onClick={() => navigate("/dashboard/groups/create")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                >
                    <IoCreateOutline className="text-lg" />
                    New Group
                </button>
            </div>

            {loading ? (
                <p className="opacity-60 text-sm">Loading groups...</p>
            ) : groups.length === 0 ? (
                <p className="opacity-60 text-sm">Haju sudhi koi group banelu nathi.</p>
            ) : (
                <div className="space-y-3">
                    {groups.map((g) => (
                        <div
                            key={g.group_id}
                            className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-opacity ${
                                deletingId === g.group_id ? "opacity-50 pointer-events-none" : ""
                            } ${theme ? "border-gray-800 bg-gray-800/50" : "border-gray-100 bg-gray-50"}`}
                        >
                            <div className="flex-1 min-w-0">
                                <h2 className="font-semibold text-base">{g.group_name}</h2>
                                {g.description && (
                                    <p className="text-sm opacity-60 mt-0.5">{g.description}</p>
                                )}

                                {/* 👑 Members — avatar chips (WhatsApp jevu) */}
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {(g.members || []).slice(0, 8).map((m) => (
                                        <span
                                            key={m.suid}
                                            title={m.role_code ? `${m.name} (${m.role_code})` : m.name}
                                            className={`flex items-center gap-1.5 text-[11px] pl-1 pr-2.5 py-1 rounded-full font-medium ${
                                                theme ? "bg-gray-900 text-gray-300" : "bg-white text-gray-600 border border-gray-200"
                                            }`}
                                        >
                                            <span
                                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                                                    theme ? "bg-gray-700 text-blue-200" : "bg-red-100 text-red-600"
                                                }`}
                                            >
                                                {getInitials(m.name)}
                                            </span>
                                            {m.name}
                                        </span>
                                    ))}
                                    {(g.members?.length || 0) > 8 && (
                                        <span className="text-[11px] px-2.5 py-1 opacity-60">
                                            +{g.members.length - 8} more
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs opacity-40 mt-2">
                                    {g.members?.length || 0} members {g.created_by_name ? `· Created by ${g.created_by_name}` : ""}
                                </p>
                            </div>

                            {/* 🎯 3-dot menu — Edit / Delete */}
                            <DataCruding
                                onEdit={() => handleEdit(g.group_id)}
                                onDelete={() => handleDelete(g.group_id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}