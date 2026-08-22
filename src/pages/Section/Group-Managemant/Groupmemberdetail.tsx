import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { HiStar, HiOutlineArrowLeft, HiOutlineUserGroup } from "react-icons/hi";
import { useTheme } from "../../../components/theme/ThemeContext";
import { groupService, type GroupDetail } from "../../../services/groupService";

export default function GroupMemberDetail() {
    const { groupId } = useParams<{ groupId: string }>();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const [group, setGroup] = useState<GroupDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroup = async () => {
            if (!groupId) return;
            setLoading(true);
            const res = await groupService.getGroupMembers(Number(groupId));
            if (res.success) setGroup(res.data);
            setLoading(false);
        };
        fetchGroup();
    }, [groupId]);

    // 🎯 Leader pehla, baki members joining order ma
    const sortedMembers = group?.members
        ? [...group.members].sort((a, b) => (a.isLeader === b.isLeader ? 0 : a.isLeader ? -1 : 1))
        : [];

    return (
        <div className="p-6 space-y-6">
            <button
                onClick={() => navigate(-1)}
                className={`flex items-center gap-2 text-sm font-semibold ${theme ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}`}
            >
                <HiOutlineArrowLeft /> Back
            </button>

            <div className="flex items-center gap-3">
                <span className={`flex items-center justify-center w-11 h-11 rounded-xl ${theme ? "bg-blue-500/10 text-blue-300" : "bg-[#9b001c]/10 text-[#9b001c]"}`}>
                    <HiOutlineUserGroup size={21} />
                </span>
                <div>
                    <h1 className={`text-xl font-bold ${theme ? "text-white" : "text-gray-900"}`}>
                        {loading ? "Loading..." : group?.groupName || "Group"}
                    </h1>
                    <p className={`text-xs mt-0.5 ${theme ? "text-gray-500" : "text-gray-400"}`}>
                        {loading ? "" : `${sortedMembers.length} members`}
                    </p>
                </div>
            </div>

            <div className={`rounded-2xl border overflow-hidden ${theme ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                {loading ? (
                    <div className="p-4 space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className={`h-12 rounded-xl animate-pulse ${theme ? "bg-gray-800/60" : "bg-gray-100"}`} />
                        ))}
                    </div>
                ) : sortedMembers.length === 0 ? (
                    <p className={`text-sm py-10 text-center ${theme ? "text-gray-600" : "text-gray-400"}`}>No members in this group yet</p>
                ) : (
                    <ul className={`divide-y ${theme ? "divide-gray-800" : "divide-gray-100"}`}>
                        {sortedMembers.map((member) => (
                            <li key={member.suid} className="flex items-center justify-between px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold uppercase ${
                                            member.isLeader
                                                ? "bg-amber-400/15 text-amber-400"
                                                : theme ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
                                        }`}
                                    >
                                        {member.name?.slice(0, 2)}
                                    </span>
                                    <div>
                                        <p className={`text-sm font-semibold flex items-center gap-1.5 ${theme ? "text-gray-200" : "text-gray-800"}`}>
                                            {member.name}
                                            {member.isLeader && <HiStar className="text-amber-400" title="Group Leader" />}
                                        </p>
                                        <p className={`text-xs ${theme ? "text-gray-500" : "text-gray-400"}`}>@{member.username}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${theme ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                                    {member.roleCode}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}