import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
    label?: string;
}

export default function Input({
    type,
    value,
    onChange,
    icon,
    label,
    className = "",
    ...props
}: InputProps) {
    const { theme } = useTheme();
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordField = type === "password";
    const inputType = isPasswordField && showPassword ? "text" : type;

    // 1. Wrapper Classes
    const inputWrapperClasses = "relative group transition-all duration-300 w-full";

    // 2. Input Classes (Padding dynamic made for icon and password field)
    const inputClasses = `w-full border rounded-xl py-3 ${
        icon ? "pl-11" : "pl-4"
    } ${
        isPasswordField ? "pr-11" : "pr-4"
    } focus:outline-none transition-all duration-500 ease-out transform group-hover:-translate-y-1 focus-within:-translate-y-1 ${
        theme 
            ? "bg-[#1f2937]/80 border-gray-700/60 text-white placeholder-gray-500 group-hover:border-blue-500/50 group-hover:bg-[#1f2937] group-hover:shadow-[0_8px_20px_-5px_rgba(59,130,246,0.15)] focus:border-blue-500 focus:bg-[#1f2937] focus:shadow-[0_8px_25px_-5px_rgba(59,130,246,0.2)] focus:ring-2 focus:ring-blue-500/20"
            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 group-hover:border-red-400/60 group-hover:bg-white group-hover:shadow-[0_8px_20px_-5px_rgba(239,68,68,0.1)] focus:border-red-500 focus:bg-white focus:shadow-[0_8px_25px_-5px_rgba(239,68,68,0.15)] focus:ring-2 focus:ring-red-500/10" 
    } ${className}`;
    
    // 3. Left Icon Classes
    const iconClasses = `absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-500 z-10 ${
        theme 
            ? "text-gray-500 group-focus-within:text-blue-400 group-hover:text-blue-400" 
            : "text-slate-400 group-focus-within:text-red-500 group-hover:text-red-500"
    }`;

    // 4. Right Password Toggle Icon Classes
    const rightIconClasses = `absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-500 z-10 focus:outline-none cursor-pointer ${
        theme 
            ? "text-gray-500 hover:text-blue-400 group-focus-within:text-blue-400 group-hover:text-blue-400" 
            : "text-slate-400 hover:text-red-500 group-focus-within:text-red-500 group-hover:text-red-500"
    }`;

    return (
        <div className="w-full">
            {/* લેબલ */}
            {label && (
                <label className={`block text-sm font-medium mb-1.5 ${
                    theme ? "text-gray-300" : "text-neutral-700"
                }`}>
                    {label}
                </label>
            )}

            {/* નવું ઇનપુટ રેપર */}
            <div className={inputWrapperClasses}>
                
                {/* Left Side Icon */}
                {icon && (
                    <span className={iconClasses}>
                        {icon}
                    </span>
                )}

                {/* Main Input */}
                <input
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    className={inputClasses}
                    {...props}
                />

                {/* Password Toggle Icon */}
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={rightIconClasses}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                <line x1="2" y1="2" x2="22" y2="22" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}