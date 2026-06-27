import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/gurukul.png";
import Input from "../components/common/Input";
import { useTheme } from "../components/theme/ThemeContext";
import { HiOutlineMail } from "react-icons/hi";
import { IoIosLock } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";



export default function Login() {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    console.log("API_URL =", API_URL);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();


            console.log("Backend Login Response:", result);

            if (result.success) {

                if (!result.user) {
                    setError("લોગિન સફળ થયું, પણ યુઝર પ્રોફાઈલ ડેટા મળ્યો નથી!");
                    return;
                }

                toast.success("Login Succesfully")

                const isSuperAdmin =
                    result.user?.roleCode === "SUPER_ADMIN";

                // જો બેકએન્ડમાંથી કોઈ કારણસર પરમિશન ન આવે તો જ આ ફોલબેક કામ કરશે
                const defaultPermissions = isSuperAdmin
                    ? {
                        "Users": { create: true, edit: true, view: true, delete: true },
                        "Department": { create: true, edit: true, view: true, delete: true },
                        "Roles & Permissions": { create: true, edit: true, view: true, delete: true },
                        "overview-management": { create: true, edit: true, view: true, delete: true }
                    }
                    : {
                        "Users": { create: false, edit: false, view: true, delete: false },
                        "Department": { create: false, edit: false, view: true, delete: false },
                        "Roles & Permissions": { create: false, edit: false, view: false, delete: false }
                    };

                // 🎯 ડાયનેમિક અને સેફ ડેટા સ્ટ્રક્ચર (ટોકન અહીંથી સંપૂર્ણપણે રિમૂવ કરી દીધું છે)
                const loggedInUserData = {
                    id: result.user?.suid || result.user?.id || 0,
                    username: result.user?.name || result.user?.username || username,
                    roleName: result.user?.roleName || (isSuperAdmin ? "Super Admin" : "Teacher"),
                    roleCode: result.user?.roleCode || (isSuperAdmin ? "SUPER_ADMIN" : "HEAD100"),
                    departmentId: result.user?.departmentId || (isSuperAdmin ? 4 : 10),
                    permissions: result.user?.permissions || defaultPermissions
                };

                // 🤝 માત્ર એક જ કી ("user") માં આખો મર્જ થયેલો ડેટા લોકલ સ્ટોરેજમાં સેવ થશે
                localStorage.setItem("user", JSON.stringify(loggedInUserData));

                // 🚀 ડાબી/જમણી બાજુ બીજા કોઈ સિંગલ ટોકન સેવ કરવાની જરૂર નથી
                // સીધા ડેશબોર્ડ પર રીડાયરેક્ટ
                navigate("/dashboard");

            } else {
                // બેકએન્ડ તરફથી આવતી વેલિડેશન એરર
                setError(result.message || "લોગિન આઈડી અથવા પાસવર્ડ ખોટો છે!");
            }

        } catch (err) {
            console.error("Login Connection Error:", err);
            setError("સર્વર કનેક્શન ફેલ થયું અથવા કોડમાં કોઈ ભૂલ આવી છે!");
        }
    };

    return (
        <div className={`relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden font-sans transition-colors duration-300 ${theme ? "bg-gray-900" : "bg-red-50"
            }`}>

            {/* --- Background Floating Shapes --- */}
            <div className={`absolute top-10 left-20 w-40 h-40 rounded-full blur-3xl animate-pulse ${theme ? "bg-blue-600/20" : "bg-red-200"
                }`}></div>
            <div className={`absolute bottom-20 right-32 w-72 h-72 rounded-full blur-3xl ${theme ? "bg-indigo-600/20" : "bg-red-300/30"
                }`}></div>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl z-0 ${theme ? "bg-gray-800/60" : "bg-white/60"
                }`}></div>

            {/* --- Main Glass Container --- */}
            <div className={`relative z-10 w-full max-w-250 min-h-150 rounded-[40px] flex flex-col md:flex-row overflow-hidden border transition-all duration-300 ${theme
                ? "bg-gray-900/70 backdrop-blur-xl border-gray-800 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                : "bg-white/80 backdrop-blur-xl border-white shadow-[0_20px_60px_rgba(239,68,68,0.08)]"
                }`}>

                {/* --- Left Side: Login Form --- */}
                <div className={`w-full md:w-1/2 p-10 sm:p-14 md:p-16 flex flex-col justify-center z-20 transition-colors duration-300 ${theme ? "bg-gray-900/50" : "bg-white/80"
                    }`}>
                    <div className="flex flex-col items-center">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 hover:rotate-12 ${theme ? "bg-gray-800 text-blue-400 border border-gray-700" : "bg-red-600 text-white shadow-red-600/20"
                            }`}>
                            <FaLock size={20} />
                        </div>
                        <div className="mb-8 text-center">
                            <h2 className={`text-3xl font-black tracking-tight ${theme ? "text-white" : "text-neutral-800"
                                }`}>
                                Sign In
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">Access your ERP master dashboard</p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-xs text-red-600 dark:text-red-400 text-center font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-5">

                        {/* Username/Email Input */}
                        <div>
                            <label htmlFor="username" className={`block text-xs font-bold mb-2 ml-1 tracking-wide uppercase ${theme ? "text-gray-400" : "text-neutral-500"
                                }`}>
                                Email / Username
                            </label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. super-admin or teacher"
                                required
                                className="w-full"
                                icon={<HiOutlineMail className="text-xl text-gray-400" />}
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className={`block text-xs font-bold mb-2 ml-1 tracking-wide uppercase ${theme ? "text-gray-400" : "text-neutral-500"
                                }`}>
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full tracking-widest"
                                icon={<IoIosLock className="text-xl text-gray-400" />}
                                autoComplete="current-password"
                            />
                        </div>

                        <div className="flex justify-end pt-1">
                            <button type="button" className={`text-xs font-bold transition-colors cursor-pointer ${theme ? "text-blue-400 hover:text-blue-300" : "text-red-600 hover:text-red-700"
                                }`}>
                                Forgot Password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`w-full mt-2 py-3.5 rounded-2xl font-bold text-sm transition-all transform active:scale-[0.98] cursor-pointer shadow-md ${theme
                                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/10"
                                : "bg-red-600 hover:bg-red-700 text-white shadow-red-600/20"
                                }`}
                        >
                            Log In to System
                        </button>
                    </form>
                </div>

                {/* --- Right Side: Gurukul Branding --- */}
                <div className={`w-full md:w-1/2 relative hidden md:flex flex-col items-center justify-center p-10 text-center transition-colors duration-300 ${theme ? "bg-gray-900/20" : "bg-red-50/30"
                    }`}>

                    <div className={`absolute w-64 h-64 rounded-full blur-3xl -z-10 ${theme ? "bg-blue-600/15" : "bg-red-100"
                        }`}></div>

                    <img
                        src={Logo}
                        alt="Gurukul Logo"
                        className="w-full max-w-55 object-contain drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500"
                    />

                    <div className="mt-8 z-10">
                        <h1 className={`text-3xl font-black tracking-tight mb-2 ${theme ? "text-white" : "text-neutral-800"
                            }`}>
                            Welcome to Gurukul
                        </h1>
                        <h2 className={`text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full border inline-block ${theme
                            ? "text-blue-300 bg-blue-500/10 border-blue-500/20"
                            : "text-red-600 bg-red-100/50 border-red-200"
                            }`}>
                            I Am Gurukul Sevak
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}