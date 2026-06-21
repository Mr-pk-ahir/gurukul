import { useState } from "react";
import Table from "../../../components/common/Table";
import { useTheme } from "../../../components/theme/ThemeContext";
import DataCruding from "../../../components/common/DataCruding";
import { HiOutlineUsers, HiSearch, HiFilter, HiChevronDown } from "react-icons/hi";

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

    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filterOptions = [
        { label: "All Fields", value: "all" },
        { label: "Name", value: "name" },
        { label: "SUID Code", value: "suid" },
        { label: "Status", value: "status" },
        { label: "Performance", value: "performance" },
        { label: "Request Date", value: "requestDate" },
    ];

    // 🌟 ડાયનેમિક પ્લેસહોલ્ડર (Date માટે હવે text રાખ્યું છે જેથી એક અક્ષરથી પણ સર્ચ થઈ શકે)
    const getSearchInputConfig = () => {
        switch (filterType) {
            case "suid":
                return { type: "number", placeholder: "Enter SUID number..." };
            case "requestDate":
                return { type: "text", placeholder: "Search Date " }; 
            case "status":
                return { type: "text", placeholder: "Search Status" };
            case "performance":
                return { type: "text", placeholder: "Search Performance" };
            case "name":
                return { type: "text", placeholder: "Search Name" };
            default:
                return { type: "text", placeholder: "Search Across All Records" };
        }
    };

    const inputConfig = getSearchInputConfig();

    // 🌟 સ્માર્ટ ફિલ્ટરિંગ લોજિક (હવે એક અક્ષરથી પરફેક્ટ કામ કરશે)
    const filteredUsers = users.filter((user) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        switch (filterType) {
            case "name":
                return user.name.toLowerCase().includes(query);
            case "suid":
                return user.suid.toString().includes(query);
            case "status":
                // 🌟 includes ની જગ્યાએ startsWith વાપર્યું છે, જેથી "p" લખવાથી "APPROVED" નહી પણ માત્ર "PENDING" જ આવે.
                return user.status.toLowerCase().startsWith(query);
            case "performance":
                return user.performance.toLowerCase().startsWith(query);
            case "requestDate": 
                // 🌟 હવે સીધું અડધું ટાઈપ કરવાથી પણ તારીખ શોધી લેશે
                return user.requestDate.toLowerCase().includes(query);
            default: // "all"
                return (
                    user.name.toLowerCase().includes(query) ||
                    user.suid.toString().includes(query) ||
                    user.status.toLowerCase().startsWith(query) || 
                    user.performance.toLowerCase().startsWith(query) ||
                    user.requestDate.toLowerCase().includes(query)
                );
        }
    });

    const handleDeleteUser = (suid: number) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user.suid !== suid));
    };

    const handleEditUser = (suid: number) => {
        console.log("Edit કરાયેલ SUID:", suid);
    };

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
                    className={`w-10 h-10 rounded-full object-cover mx-auto border-2 ${theme ? "border-gray-700" : "border-white"} shadow-sm ring-1 ${theme ? "ring-gray-700" : "ring-neutral-200"}`}
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
                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border tracking-wide ${getPerformanceStyle(user.performance)}`}>
                    {user.performance}
                </span>
            ),
        },
        {
            header: "SUID / Code",
            className: "text-center",
            accessor: (user: UserData) => (
                <span className={`inline-block px-2.5 py-1 rounded-full font-bold text-xs tabular-nums ${theme ? "bg-blue-950/40 text-blue-400" : "bg-red-50 text-red-600"}`}>
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
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${user.status === "APPROVED"
                    ? theme ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : theme ? "bg-amber-950/30 border-amber-900/50 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600"
                    }`}
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === "APPROVED" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {user.status}
                </span>
            ),
        },
        {
            header: "Actions",
            className: "w-16 text-center",
            accessor: (user: UserData) => (
                <DataCruding
                    onEdit={() => handleEditUser(user.suid)}
                    onDelete={() => handleDeleteUser(user.suid)}
                />
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors ${theme ? "bg-blue-500/10 text-blue-300" : "bg-[#9b001c]/10 text-[#9b001c]"}`}>
                        <HiOutlineUsers size={20} />
                    </span>
                    <div>
                        <h2 className={`text-xl font-bold leading-tight ${theme ? "text-blue-200" : "text-[#9b001c]"}`}>
                            User List
                        </h2>
                        <p className={`text-xs mt-0.5 ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                            Showing {filteredUsers.length} of {users.length} users
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-1">

                    <div className="relative group">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center justify-between pl-9 pr-3 py-2.5 w-36 sm:w-40 rounded-xl border text-sm font-medium outline-none transition-all duration-300 ${theme
                                    ? "bg-gray-800/60 border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500/50 hover:border-gray-600 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)]"
                                    : "bg-white border-gray-200/80 text-gray-700 focus:ring-2 focus:ring-[#9b001c]/20 hover:border-gray-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]"
                                }`}
                        >
                            <div className={`absolute left-3 flex items-center pointer-events-none transition-colors ${theme ? "text-gray-400 group-hover:text-blue-400" : "text-gray-500 group-hover:text-[#9b001c]"}`}>
                                <HiFilter className="w-4 h-4" />
                            </div>
                            <span className="truncate mr-2">
                                {filterOptions.find((opt) => opt.value === filterType)?.label}
                            </span>
                            <HiChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""} ${theme ? "text-gray-400" : "text-gray-500"}`} />
                        </button>

                        {isFilterOpen && (
                            <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                        )}

                        {isFilterOpen && (
                            <div className={`absolute right-0 z-20 mt-2 w-44 rounded-xl border py-1.5 shadow-xl backdrop-blur-md transform transition-all duration-200 origin-top-right ${theme
                                    ? "bg-gray-800/95 border-gray-700 text-gray-200 shadow-black/40"
                                    : "bg-white/95 border-gray-100 text-gray-700 shadow-gray-200/50"
                                }`}
                            >
                                {filterOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => {
                                            setFilterType(option.value);
                                            setSearchQuery(""); 
                                            setIsFilterOpen(false);
                                        }}
                                        className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between ${filterType === option.value
                                                ? theme ? "bg-blue-500/10 text-blue-400 font-bold" : "bg-[#9b001c]/5 text-[#9b001c] font-bold"
                                                : theme ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                                            }`}
                                    >
                                        {option.label}
                                        {filterType === option.value && (
                                            <span className={`w-1.5 h-1.5 rounded-full ${theme ? "bg-blue-400" : "bg-[#9b001c]"}`}></span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative group">
                        <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${theme ? "text-gray-400 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-[#9b001c]"}`}>
                            <HiSearch className="w-4 h-4" />
                        </div>
                        <input
                            type={inputConfig.type} 
                            placeholder={inputConfig.placeholder} 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-10 pr-4 py-2.5 w-full sm:w-48 lg:w-64 xl:w-72 rounded-xl border text-sm outline-none transition-all duration-300 ease-in-out focus:w-full sm:focus:w-56 lg:focus:w-72 xl:focus:w-80 ${theme
                                    ? "bg-gray-800/60 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-gray-600 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)]"
                                    : "bg-white border-gray-200/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#9b001c]/20 focus:border-[#9b001c] hover:border-gray-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]"
                                } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} 
                        />
                    </div>

                </div>
            </div>

            <Table
                columns={columns}
                data={filteredUsers}
                keyExtractor={(user) => user.suid}
                emptyMessage={
                    searchQuery
                        ? `No users found matching "${searchQuery}"`
                        : "No users found!"
                }
            />
        </div>
    );
}