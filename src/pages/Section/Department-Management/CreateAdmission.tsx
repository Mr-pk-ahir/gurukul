import React, { useState } from "react";
import { useParams } from "react-router-dom"; // 👈 URL માંથી departmentId મેળવવા માટે
import { useTheme } from "../../../components/theme/ThemeContext";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

import type { CreateAdmissionInput, AdmissionApiResponse, AdmissionRequest } from "../../../Types/Admission-request";

import {
    HiOutlineUser,
    HiOutlineDocumentText,
    HiOutlineIdentification,
} from "react-icons/hi";
import { FaUserGraduate } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function SectionHeading({
    icon,
    title,
    theme,
}: {
    icon: React.ReactNode;
    title: string;
    theme: boolean;
}) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <span
                className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${theme ? "bg-blue-500/10 text-blue-300" : "bg-red-500/10 text-red-600"
                    }`}
            >
                {icon}
            </span>
            <h3
                className={`text-xs font-semibold uppercase tracking-wider ${theme ? "text-gray-400" : "text-neutral-500"
                    }`}
            >
                {title}
            </h3>
            <div className={`flex-1 h-px ${theme ? "bg-gray-800" : "bg-neutral-200"}`} />
        </div>
    );
}

export default function CreateAdmission() {
    const { theme } = useTheme();
    
    // 📍 URL માંથી departmentId મેળવ્યો (ધારો કે રાઉટ /departments/:departmentId/create-admission છે)
    const { departmentId } = useParams<{ departmentId: string }>();

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMsg, setSuccessMsg] = useState<string>("");

    // ફોર્મ સ્ટેટ્સ (departmentId હટાવી દીધું)
    const [applicantName, setApplicantName] = useState<string>("");
    const [applicantSuid, setApplicantSuid] = useState<string>("");
    const [additionalDetails, setAdditionalDetails] = useState<string>(""); // 👈 નવું ડિસ્ક્રિપ્શન સ્ટેટ

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMsg("");

        // વેલિડેશન: ચેક કરો કે URL માં ID છે અને ફોર્મ ભરેલું છે
        if (!departmentId) {
            setErrorMessage("ડિપાર્ટમેન્ટ આઈડી યુઆરએલ (URL) માં મળ્યો નથી.");
            setLoading(false);
            return;
        }

        if (!applicantName.trim() || !applicantSuid) {
            setErrorMessage("બધી જ જરૂરી ફીલ્ડ્સ ભરવી ફરજિયાત છે.");
            setLoading(false);
            return;
        }

        try {
            // 📦 પેલોડ ડેટા: જે આપણે પાછલા સ્ટેપમાં મોડ્યુલર ટાઇપ બનાવ્યો હતો તે મુજબ
            const payload: CreateAdmissionInput = {
                applicantName: applicantName.trim(),
                applicantSuid: Number(applicantSuid),
                departmentId: Number(departmentId),
                requestedRole: "STUDENT", // સ્કૂલના ડેટાબેઝ મુજબ બાય-ડિફોલ્ટ STUDENT
                departmentName: `Department ${departmentId}`, // જો ફ્રન્ટએન્ડમાં નામ ન હોય તો આ રીતે અથવા બેકએન્ડથી હેન્ડલ થશે
                additionalDetails: additionalDetails.trim() || undefined // Optional ડિસ્ક્રિપ્શન
            };

            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/admissions/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result: AdmissionApiResponse<AdmissionRequest> = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "રિક્વેસ્ટ મોકલવામાં કોઈ ખામી સર્જાઈ છે.");
            }

            // 🎉 ફોર્મ ક્લિયર
            setApplicantName("");
            setApplicantSuid("");
            setAdditionalDetails("");
            setSuccessMsg("Admission request submitted successfully to Admin Pipeline!");
            
            setTimeout(() => setSuccessMsg(""), 4000);
        } catch (error: any) {
            console.error("Admission Error:", error);
            setErrorMessage(error.message || "સર્વર સાથે કનેક્ટ થવામાં પ્રોબ્લેમ છે. ફરી ટ્રાય કરો.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`max-w-7xl mx-auto p-6 sm:p-8 rounded-2xl shadow-sm mt-6 border transition-all duration-200 ${theme ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
                }`}
        >
            {/* ===== Header ===== */}
            <div className="mb-8 pb-6 border-b flex flex-col items-center text-center gap-2 border-neutral-200 dark:border-gray-800">
                <div
                    className={`w-16 h-16 text-white rounded-full shadow-lg ${theme
                            ? "bg-linear-to-bl from-blue-300 to-blue-900 shadow-blue-950/40"
                            : "bg-linear-to-bl from-red-300 to-red-900 shadow-red-950/20"
                        } flex items-center justify-center mb-1`}
                >
                    <FaUserGraduate size={24} />
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme ? "text-blue-200" : "text-red-600"}`}>
                    Create Admission Request
                </h2>
                <p className={`text-sm max-w-md ${theme ? "text-gray-400" : "text-neutral-500"}`}>
                    Submitting request for Department ID: <span className="font-bold underline">{departmentId}</span>
                </p>
            </div>

            {/* ===== Banners ===== */}
            {successMsg && (
                <div role="status" className={`mb-6 flex items-start gap-2.5 p-3.5 rounded-xl text-sm font-medium border ${theme ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}>
                    <span className="mt-0.5 shrink-0">✓</span>
                    <span>{successMsg}</span>
                </div>
            )}

            {errorMessage && (
                <div role="alert" className={`mb-6 flex items-start gap-2.5 p-3.5 rounded-xl text-sm font-medium border ${theme ? "bg-red-500/10 text-red-300 border-red-500/20" : "bg-red-50 text-red-700 border-red-100"}`}>
                    <span className="mt-0.5 shrink-0">⚠</span>
                    <span>{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleApply} className="space-y-8">

                {/* ===== Applicant Identity section ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineUser size={15} />} title="Applicant Identity" theme={theme} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                            <Input
                                type="text"
                                name="applicantName"
                                value={applicantName}
                                onChange={(e) => setApplicantName(e.target.value)}
                                icon={<HiOutlineUser className="text-lg" />}
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">SUID *</label>
                            <Input
                                type="number"
                                name="applicantSuid"
                                value={applicantSuid}
                                onChange={(e) => setApplicantSuid(e.target.value)}
                                icon={<HiOutlineIdentification className="text-lg" />}
                                placeholder="Ex: 5001"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* ===== Additional Info Section (નવું ડિસ્ક્રિપ્શન ફીલ્ડ) ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineDocumentText size={15} />} title="Application Details" theme={theme} />
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Description / Additional Details (Optional)</label>
                        <textarea
                            name="additionalDetails"
                            value={additionalDetails}
                            onChange={(e) => setAdditionalDetails(e.target.value)}
                            placeholder="Enter any additional remarks or notes here..."
                            rows={4}
                            className={`w-full text-sm p-3 rounded-xl border outline-hidden transition-all duration-150 ${
                                theme 
                                ? "bg-gray-800/50 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                                : "bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            }`}
                        />
                    </div>
                </div>

                {/* ===== Submit Button ===== */}
                <div className="flex justify-end items-center gap-3 pt-6 border-t border-neutral-200 dark:border-gray-800">
                    <p className={`text-xs mr-auto hidden sm:block ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                        Fields marked * are required.
                    </p>
                    <Button
                        type="submit"
                        disabled={loading}
                        className={`${theme ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"} min-w-45 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                Submitting...
                            </span>
                        ) : (
                            "Submit Admission Request"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}