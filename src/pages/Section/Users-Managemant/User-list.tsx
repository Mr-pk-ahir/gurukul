import { useState } from "react";
import Table from "../../../components/common/Table";
import { useTheme } from "../../../components/theme/ThemeContext";
import DataCruding from "../../../components/common/DataCruding";
import { HiOutlineUsers } from "react-icons/hi";

interface UserData {
    suid: number;
    avatar: string;
    name: string;
    performance: string;
    requestDate: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
}

export default function UserList() {
    const { theme } = useTheme();

    // ૧. ડેટાને useState માં રાખ્યો જેથી લોકલ લેવલે ડિલીટ (ફિલ્ટર) કરી શકાય
    const [users, setUsers] = useState<UserData[]>([
        {
            suid: 2,
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
            name: "Marakna Priyank",
            performance: "HIGH PERF.",
            requestDate: "27/05/2026",
            status: "APPROVED",
        },
        {
            suid: 3,
            avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100",
            name: "Ankit Patel",
            performance: "AVERAGE",
            requestDate: "15/06/2026",
            status: "PENDING",
        },
        {
            suid: 4,
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
            name: "Pooja Sharma",
            performance: "HIGH PERF.",
            requestDate: "18/06/2026",
            status: "APPROVED",
        },
    ]);

    // ૨. ટેમ્પરરી ડિલીટ હેન્ડલર ફંક્શન
    const handleDeleteUser = (suid: number) => {
        // જે આઈડી સિલેક્ટ થયો છે તેના સિવાયના બાકીના યુઝર્સ ફિલ્ટર થઈને સ્ટેટમાં સેટ થશે
        setUsers((prevUsers) => prevUsers.filter((user) => user.suid !== suid));
        console.log(`SUID ${suid} લોકલ સ્ટેટમાંથી ટેમ્પરરી ડિલીટ થયો.`);
    };

    const handleEditUser = (suid: number) => {
        console.log("Edit કરાયેલ SUID:", suid);
    };

    // 🌟 Performance બેજ માટે રંગ-મેપિંગ — "HIGH PERF." ને બાકીના કરતાં
    // દૃષ્ટિની રીતે અલગ તારવી શકાય તે માટે (પહેલા બધા badges સરખા જ ગ્રે હતા)
    const getPerformanceStyle = (performance: string) => {
        if (performance === "HIGH PERF.") {
            return theme
                ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400"
                : "bg-emerald-50 border-emerald-200 text-emerald-600";
        }
        return theme
            ? "bg-gray-700 border-gray-600 text-gray-300"
            : "bg-neutral-50 border-neutral-200 text-neutral-600";
    };

    const columns = [
        {
            header: "Profile",
            className: "w-16 text-center",
            accessor: (user: UserData) => (
                <img
                    src={user.avatar}
                    alt={user.name}
                    className={`w-10 h-10 rounded-full object-cover mx-auto border-2 ${theme ? "border-gray-700" : "border-white"
                        } shadow-sm ring-1 ${theme ? "ring-gray-700" : "ring-neutral-200"}`}
                />
            ),
        },
        {
            header: "Sevak Name",
            className: "text-left font-bold",
            accessor: (user: UserData) => (
                <span className={theme ? "text-white" : "text-neutral-900"}>{user.name}</span>
            ),
        },
        {
            header: "Performance",
            accessor: (user: UserData) => (
                <span
                    className={`inline-block px-3 py-1 text-xs font-bold rounded-full border tracking-wide ${getPerformanceStyle(
                        user.performance
                    )}`}
                >
                    {user.performance}
                </span>
            ),
        },
        {
            header: "SUID / Code",
            className: "text-center",
            accessor: (user: UserData) => (
                <span
                    className={`inline-block px-2.5 py-1 rounded-full font-bold text-xs tabular-nums ${theme ? "bg-blue-950/40 text-blue-400" : "bg-red-50 text-red-600"
                        }`}
                >
                    #{user.suid}
                </span>
            ),
        },
        {
            header: "Request Date",
            accessor: (user: UserData) => (
                <span className={`text-sm tabular-nums ${theme ? "text-gray-400" : "text-neutral-500"}`}>
                    {user.requestDate}
                </span>
            ),
        },
        {
            header: "Status",
            accessor: (user: UserData) => (
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${user.status === "APPROVED"
                            ? theme
                                ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400"
                                : "bg-emerald-50 border-emerald-200 text-emerald-600"
                            : theme
                                ? "bg-amber-950/30 border-amber-900/50 text-amber-400"
                                : "bg-amber-50 border-amber-200 text-amber-600"
                        }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${user.status === "APPROVED" ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                    />
                    {user.status}
                </span>
            ),
        },
        {
            header: "Actions",
            className: "w-16 text-center",
            accessor: (user: UserData) => (
                /* આપણા રીયુઝેબલ કમ્પોનન્ટમાં ફંક્શન્સ પાસ કર્યા */
                <DataCruding
                    onEdit={() => handleEditUser(user.suid)}
                    onDelete={() => handleDeleteUser(user.suid)} // અહીંથી ડિલીટ ફંક્શન કોલ થશે
                />
            ),
        },
    ];

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span
                        className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${theme ? "bg-blue-500/10 text-blue-300" : "bg-[#9b001c]/10 text-[#9b001c]"
                            }`}
                    >
                        <HiOutlineUsers size={18} />
                    </span>
                    <div>
                        <h2 className={`text-xl font-bold leading-tight ${theme ? "text-blue-200" : "text-[#9b001c]"}`}>
                            User List
                        </h2>
                        <p className={`text-xs ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                            {users.length} {users.length === 1 ? "user" : "users"} on record
                        </p>
                    </div>
                </div>
            </div>

            {/* 🌟 Table એ પોતે જ card-style rows (border-spacing + shadow) આપે છે,
          એટલે અહીં વધારાનું border/rounded wrapper નથી મૂક્યું — નહીંતર
          ડબલ-બોર્ડર/ડબલ-radius effect આવત */}
            <Table
                columns={columns}
                data={users} // મોક ડેટાની જગ્યાએ હવે `users` સ્ટેટ પાસ કર્યો
                keyExtractor={(user) => user.suid}
                emptyMessage="No users found!"
            />
        </div>
    );
}