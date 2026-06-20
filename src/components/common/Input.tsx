import { useState } from "react";
import { useTheme } from "../theme/ThemeContext"; // તમારી ThemeContext ફાઇલ પાથ અહીં કન્ફર્મ કરી લેવો

// React.InputHTMLAttributes વાપરવાથી HTML input ના બધા જ એટ્રીબ્યુટ્સ ઓટોમેટિક સપોર્ટ થઈ જશે
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
}

export default function Input({
    type,
    value,
    onChange,
    icon,
    className = "",
    ...props
}: InputProps) {
    const { theme } = useTheme(); // ડાર્ક/લાઇટ થીમ લેવા માટે
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordField = type === "password";
    const inputType = isPasswordField && showPassword ? "text" : type;

    return (
        /* className ને અહી ડાર્ક અને લાઇટ થીમ મુજબ મર્જ કરી દીધી છે */
        <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition border outline-none ${
            theme 
                ? "bg-gray-800 border-gray-700 text-white focus-within:border-blue-200 focus-within:ring-2 focus-within:ring-blue-200/20 focus-within:bg-gray-900" 
                : "bg-neutral-50 border-neutral-200 text-neutral-900 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 focus-within:bg-white"
        } ${className}`}>

            {/* Left Side Icon */}
            {icon && (
                <span className={`flex items-center shrink-0 ${theme ? "text-gray-400" : "text-neutral-400"}`}>
                    {icon}
                </span>
            )}

            <input
                type={inputType}
                value={value}
                onChange={onChange}
                className={`w-full bg-transparent outline-none ${
                    theme ? "placeholder:text-gray-500 text-white" : "placeholder:text-neutral-400 text-neutral-900"
                }`}
                {...props}
            />

            {/* Password Toggle Icon */}
            {isPasswordField && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`flex items-center transition shrink-0 focus:outline-none cursor-pointer ${
                        theme 
                            ? "text-gray-400 hover:text-gray-200" 
                            : "text-neutral-400 hover:text-neutral-600"
                    }`}
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
    );
}