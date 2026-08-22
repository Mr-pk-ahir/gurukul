/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "../../../components/theme/ThemeContext";
import SearchableDropdown from "../../../components/common/SearchableDropdown";
import { userService } from "../../../services/userService";
import { groupService } from "../../../services/groupService";
import { IoClose, IoArrowBack } from "react-icons/io5";

// 👑 users table nu actual primary key "suid" chhe — "user_id" nathi
interface UserOption {
    suid: number;
    name: string;
    role_code?: string;
}

interface DropdownOption {
    value: string | number;
    label: string;
}

export default function CreateGroup() {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { groupId } = useParams<{ groupId: string }>();
    const isEditMode = !!groupId;

    const [groupName, setGroupName] = useState("");
    const [description, setDescription] = useState("");

    const [allUsers, setAllUsers] = useState<UserOption[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingGroup, setLoadingGroup] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);

    const [currentSelect, setCurrentSelect] = useState<string | number>("");
    const [selectedMembers, setSelectedMembers] = useState<UserOption[]>([]);

    // ➜ Users fetch (real API)
    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            try {
                const result = await userService.getAllUsers();
                if (result.success && Array.isArray(result.data)) {
                    const mapped: UserOption[] = result.data.map((u: any) => ({
                        suid: u.suid,
                        name: u.name,
                        role_code: u.role_code ?? u.roleCode,
                    }));
                    setAllUsers(mapped);
                } else {
                    toast.error(result.message || "Users fetch karva ma error");
                }
            } catch (error: any) {
                toast.error(error.message || "Users fetch karva ma error");
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    // 🆕 Edit mode — existing group data fetch karine form prefill karo
    useEffect(() => {
        if (!isEditMode) return;

        const fetchGroup = async () => {
            setLoadingGroup(true);
            try {
                const result = await groupService.getGroupById(Number(groupId));
                if (result.success && result.data) {
                    const g = result.data;
                    setGroupName(g.group_name || "");
                    setDescription(g.description || "");
                    const members: UserOption[] = (g.members || []).map((m: any) => ({
                        suid: m.suid,
                        name: m.name,
                        role_code: m.role_code,
                    }));
                    setSelectedMembers(members);
                } else {
                    toast.error(result.message || "Group fetch karva ma error");
                    navigate("/dashboard/groups/list");
                }
            } catch (error: any) {
                toast.error(error.message || "Group fetch karva ma error");
            } finally {
                setLoadingGroup(false);
            }
        };
        fetchGroup();
    }, [isEditMode, groupId, navigate]);

    // ➜ Dropdown na options — je users already select thai gaya chhe tene list ma thi hide karo
    const dropdownOptions: DropdownOption[] = useMemo(() => {
        const selectedIds = new Set(selectedMembers.map((m) => m.suid));
        return allUsers
            .filter((u) => !selectedIds.has(u.suid))
            .map((u) => ({
                value: u.suid,
                label: u.role_code ? `${u.name} (${u.role_code})` : u.name,
            }));
    }, [allUsers, selectedMembers]);

    // 👑 Dropdown ma user select karta j direct add thai jay chhe
    const handleSelectUser = (val: string | number) => {
        const user = allUsers.find((u) => String(u.suid) === String(val));
        if (!user) return;

        setSelectedMembers((prev) => [...prev, user]);
        setCurrentSelect("");
    };

    const handleRemoveMember = (suid: number) => {
        setSelectedMembers((prev) => prev.filter((m) => m.suid !== suid));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!groupName.trim()) {
            toast.error("Group name aapavu jaruri chhe");
            return;
        }
        if (selectedMembers.length === 0) {
            toast.error("Ochha ma ochhu ek member select karo");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                group_name: groupName.trim(),
                description: description.trim(),
                member_ids: selectedMembers.map((m) => m.suid),
            };

            const result = isEditMode
                ? await groupService.updateGroup(Number(groupId), payload)
                : await groupService.createGroup(payload);

            if (result.success) {
                toast.success(isEditMode ? "Group successfully update thayu!" : "Group successfully banyu!");
                navigate("/dashboard/groups/list");
            } else {
                toast.error(result.message || (isEditMode ? "Group update karva ma error" : "Group create karva ma error"));
            }
        } catch (error: any) {
            toast.error(error.message || "Kaink khotu thayu");
        } finally {
            setSubmitting(false);
        }
    };

    // 👑 Avatar mate name na pahela 1-2 letters
    const getInitials = (name: string) => {
        if (!name) return "?";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    if (loadingGroup) {
        return (
            <div className={`w-full max-w-6xl mx-auto p-6 rounded-2xl ${theme ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
                <p className="opacity-60 text-sm">Group data load thai rahyu chhe...</p>
            </div>
        );
    }

    return (
        <div className={`w-full max-w-6xl mx-auto p-6 rounded-2xl ${theme ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
            <button
                type="button"
                onClick={() => navigate("/dashboard/groups/list")}
                className={`flex items-center gap-2 text-sm font-medium mb-4 ${theme ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}
            >
                <IoArrowBack /> Back
            </button>

            <h1 className="text-2xl font-bold mb-6">{isEditMode ? "Edit Group" : "Create Group"}</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ---------- LEFT PART: FORM ---------- */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold mb-1.5">Group Name</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="e.g. Semester 3 - CS Batch"
                            className={`w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-red-500 ${
                                theme ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200"
                            }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1.5">Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            placeholder="Group ni short details..."
                            className={`w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-red-500 ${
                                theme ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-200"
                            }`}
                        />
                    </div>

                    {/* Member picker: select karta j direct add thai jay chhe */}
                    <div>
                        <label className="block text-sm font-semibold mb-1.5">Add Members</label>

                        <SearchableDropdown
                            placeholder={loadingUsers ? "Loading users..." : "Select a user"}
                            searchPlaceholder="Search users..."
                            options={dropdownOptions}
                            selectedValue={currentSelect}
                            onSelect={handleSelectUser}
                            disabled={loadingUsers}
                        />
                        <p className={`text-xs mt-1.5 ${theme ? "text-gray-500" : "text-gray-400"}`}>
                            User pasand karo — automatic right side ni list ma umerai jashe.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
                        >
                            {submitting
                                ? (isEditMode ? "Updating..." : "Creating...")
                                : (isEditMode ? "Update Group" : "Create Group")}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard/groups/list")}
                            className={`px-6 py-2.5 rounded-xl font-semibold ${theme ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600"}`}
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* ---------- RIGHT PART: SELECTED MEMBERS LIST ---------- */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold">Selected Members</label>
                        <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                theme ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {selectedMembers.length}
                        </span>
                    </div>

                    <div
                        className={`rounded-xl border h-105 overflow-y-auto ${
                            theme ? "border-gray-700 bg-gray-800/40" : "border-gray-200 bg-gray-50"
                        }`}
                    >
                        {selectedMembers.length === 0 ? (
                            <div className="h-full flex items-center justify-center p-6">
                                <p className="text-sm opacity-50 text-center">
                                    Haju koi member select nathi karyu.
                                    <br />
                                    Left side thi dropdown vaparine members umero.
                                </p>
                            </div>
                        ) : (
                            <div className={`divide-y ${theme ? "divide-gray-700" : "divide-gray-200"}`}>
                                {selectedMembers.map((m) => (
                                    <div
                                        key={m.suid}
                                        className={`flex items-center gap-3 px-4 py-3 ${
                                            theme ? "hover:bg-gray-800" : "hover:bg-white"
                                        }`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                                                theme ? "bg-gray-700 text-blue-200" : "bg-red-100 text-red-600"
                                            }`}
                                        >
                                            {getInitials(m.name)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{m.name}</p>
                                            {m.role_code && (
                                                <p className="text-xs opacity-50">{m.role_code}</p>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMember(m.suid)}
                                            title="Remove member"
                                            className={`p-1.5 rounded-full shrink-0 ${
                                                theme ? "hover:bg-gray-700 text-gray-400" : "hover:bg-red-50 text-gray-400 hover:text-red-600"
                                            }`}
                                        >
                                            <IoClose className="text-base" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}