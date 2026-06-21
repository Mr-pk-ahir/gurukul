import React, { useState } from "react";
import Table from "../../../components/common/Table";
import { useTheme } from "../../../components/theme/ThemeContext";
import DataCruding from "../../../components/common/DataCruding";

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

  const columns = [
    {
      header: "Profile",
      className: "w-16 text-center",
      accessor: (user: UserData) => (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border border-neutral-200 mx-auto"
        />
      ),
    },
    {
      header: "Sevak Name",
      className: "text-left font-bold",
      accessor: (user: UserData) => user.name,
    },
    {
      header: "Performance",
      accessor: (user: UserData) => (
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
          theme 
            ? "bg-gray-700 border-gray-600 text-gray-300" 
            : "bg-neutral-50 border-neutral-200 text-neutral-600"
        }`}>
          {user.performance}
        </span>
      ),
    },
    {
      header: "SUID / Code",
      className: "text-center",
      accessor: (user: UserData) => (
        <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 font-bold text-xs dark:bg-red-950/40 dark:text-red-400">
          {user.suid}
        </span>
      ),
    },
    {
      header: "Request Date",
      accessor: (user: UserData) => user.requestDate,
    },
    {
      header: "Status",
      accessor: (user: UserData) => (
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
          user.status === "APPROVED"
            ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400"
            : "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-400"
        }`}>
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className={`text-xl font-bold ${theme ? "text-blue-200" : "text-red-600"}`}>
          User List
        </h2>
      </div>

      <Table
        columns={columns}
        data={users} // મોક ડેટાની જગ્યાએ હવે `users` સ્ટેટ પાસ કર્યો
        keyExtractor={(user) => user.suid}
        emptyMessage="No users found!"
      />
    </div>
  );
}