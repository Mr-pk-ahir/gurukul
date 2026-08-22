import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../../components/theme/ThemeContext";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}

interface ActivityItem {
    id: number;
    title: string;
    date: string;
    image: string;
    category: string;
    description: string;
}

// All Activities Data
const ALL_ACTIVITIES: ActivityItem[] = [
    {
        id: 1,
        title: "International Yoga Day Celebration",
        date: "21 JUL 2026",
        image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600",
        category: "Educational Activities",
        description: "Students and teachers participated in a grand yoga session, promoting physical and mental well-being, followed by a meditation workshop."
    },
    {
        id: 2,
        title: "Ghanshyam Maharaj Shantigram Darshan",
        date: "20 MAY 2026",
        image: "https://images.unsplash.com/photo-1609137860786-5812d8816c4c?auto=format&fit=crop&q=80&w=600",
        category: "Wallpaper",
        description: "Shri Ganesha Maharaj's Shantigram Darshan, a special event with unique decorations and a grand celebration."
    },
    {
        id: 3,
        title: "Sadguru Hariswarupdasji Swami Memorial",
        date: "23 APR 2026",
        image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600",
        category: "Spiritual Activities",
        description: "Pujable Sadguru Hariswarupdasji Swami's anniversary celebration, featuring a special satsang meeting, storytelling, and guru vandana."
    },
    {
        id: 4,
        title: "Gurukul Foundation Day Celebration 2026",
        date: "19 APR 2026",
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=600",
        category: "Cultural Activities",
        description: "Gurukul Foundation Day celebration, featuring cultural programs, folk dances, and a special play presented by students."
    },
    {
        id: 5,
        title: "Mega Blood Donation Camp",
        date: "10 MAR 2026",
        image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=600",
        category: "Social Service",
        description: "A grand blood donation camp organized to promote the cause of saving lives, with active participation from the community."
    },
    {
        id: 6,
        title: "Annual Sports Meet 2026",
        date: "25 FEB 2026",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600",
        category: "Sports Activities",
        description: "Students participate in various sports competitions, athletics, and awards ceremony."
    },
    {
        id: 7,
        title: "Vasant Panchami Mahotsav",
        date: "14 FEB 2026",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600",
        category: "Spiritual Activities",
        description: "A grand celebration of Vasant Panchami with Saraswati Puja, cultural programs, and devotional singing."
    },
    {
        id: 8,
        title: "Science & Innovation Fair",
        date: "28 JAN 2026",
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
        category: "Educational Activities",
        description: "Students showcase their scientific thinking and innovative projects in this grand fair."
    }
];

export default function ActivitiesPage() {
    const { theme } = useTheme();
    const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

    return (
        <div className={`w-full h-screen overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none font-sans transition-colors duration-500 ${theme ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>

            {/* 📌 Back Button (Premium Styled) */}
            <div className="w-full px-6 sm:px-12 lg:px-16 pt-8 flex justify-start">
                <Link
                    to="/"
                    className={`group inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full font-bold text-sm backdrop-blur-md border shadow-sm transition-all duration-300 ease-out active:scale-95 ${theme
                        ? "bg-[#151D2F]/80 text-slate-300 border-slate-700 hover:text-blue-400 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20"
                        : "bg-white/80 text-slate-700 border-slate-200 hover:text-red-600 hover:border-red-300 hover:shadow-lg hover:shadow-red-500/15"
                        }`}
                >
                    {/* Animated Arrow Icon */}
                    <svg
                        className="w-4 h-4 transform transition-transform duration-300 group-hover:-translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </Link>
            </div>

            {/* 📌 Main Content */}
            <main className="w-full px-6 sm:px-12 lg:px-16 py-8 pb-24">
                <Reveal>
                    <div className="text-center mb-16 relative">
                        {theme && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none"></div>
                        )}

                        <h1 className="relative z-10 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 pb-2 transition-all duration-500">
                            {/* Metallic Text for "All Past" */}
                            <span className={`bg-clip-text text-transparent ${theme
                                    ? "bg-linear-to-r from-white via-slate-200 to-slate-400 drop-shadow-[0_2px_15px_rgba(255,255,255,0.08)]"
                                    : "bg-linear-to-r from-slate-900 via-slate-700 to-slate-500"
                                }`}>
                                All Past{' '}
                            </span>

                            {/* Accent Gradient Text for "Activities" */}
                            <span className={`bg-clip-text text-transparent ${theme
                                    ? "bg-linear-to-r from-blue-400 to-indigo-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.3)]"
                                    : "bg-linear-to-r from-red-600 to-rose-500 drop-shadow-sm"
                                }`}>
                                Activities
                            </span>
                        </h1>

                        {/* Elegant Subtitle */}
                        <p className={`relative z-10 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed transition-colors duration-300 ${theme ? "text-slate-400" : "text-slate-500"
                            }`}>
                            Explore all the educational, spiritual, and cultural activities organized by Swaminarayan Gurukul.
                        </p>
                    </div>
                </Reveal>

                {/* 📌 Activities Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {ALL_ACTIVITIES.map((act, idx) => (
                        <Reveal key={act.id} delay={idx * 0.05}>
                            <motion.div
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                onClick={() => setSelectedActivity(act)}
                                className={`rounded-2xl overflow-hidden border shadow-xs h-full flex flex-col transition-all duration-300 cursor-pointer group ${theme
                                    ? "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-black/50"
                                    : "bg-white border-slate-200 hover:shadow-2xl"
                                    }`}
                            >
                                {/* Image Container with Hover Overlay */}
                                <div className="h-48 overflow-hidden relative shrink-0">
                                    <img
                                        src={act.image}
                                        alt={act.title}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    />

                                    {/* Hover Overlay Badge */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                        <span className="text-white text-xs font-semibold px-4 py-2 bg-black/60 rounded-full border border-white/20 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                            Click to View
                                        </span>
                                    </div>

                                    <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                                        {act.date}
                                    </span>
                                </div>

                                <div className="p-5 flex flex-col grow">
                                    <span className={`text-xs font-bold mb-1 ${theme ? "text-blue-400" : "text-red-600"}`}>
                                        {act.category}
                                    </span>
                                    <h3 className="font-bold text-base leading-snug line-clamp-2">
                                        {act.title}
                                    </h3>
                                </div>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>
            </main>

            {/* 🌟 Center Image & Details Modal Popup */}
            <AnimatePresence>
                {selectedActivity && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedActivity(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md cursor-pointer"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`relative w-full max-w-2xl rounded-3xl overflow-hidden border shadow-2xl cursor-default ${theme ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
                                }`}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedActivity(null)}
                                className={`absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 backdrop-blur-md shadow-md cursor-pointer hover:scale-110 active:scale-95 ${theme
                                    ? "bg-slate-800/80 text-slate-200 hover:bg-slate-600 hover:text-white border border-white/10"
                                    : "bg-white/90 text-slate-800 hover:bg-red-500 hover:text-white border border-slate-200"
                                    }`}
                                aria-label="Close modal"
                            >
                                ✕
                            </button>

                            <div className="flex flex-col">
                                {/* Popup Image */}
                                <div className="w-full h-64 sm:h-80 overflow-hidden bg-black flex items-center justify-center relative">
                                    <img
                                        src={selectedActivity.image}
                                        alt={selectedActivity.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <span className="absolute bottom-4 left-4 bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10">
                                        {selectedActivity.date}
                                    </span>
                                </div>

                                {/* Popup Content */}
                                <div className="p-6 sm:p-8">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${theme ? "text-blue-400" : "text-red-600"}`}>
                                        {selectedActivity.category}
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 leading-snug">
                                        {selectedActivity.title}
                                    </h2>
                                    <p className={`text-base mt-4 leading-relaxed ${theme ? "text-slate-300" : "text-slate-600"}`}>
                                        {selectedActivity.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}