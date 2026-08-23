import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import ThemeToggle from "../../components/theme/ThemeToggle";
import { useTheme } from "../../components/theme/ThemeContext";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "./overview-constants";
import { quoteService, type QuoteData } from "../../services/Quoteservice";

function Reveal({
    children,
    delay = 0,
    className = "",
    yOffset = 35,
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
    yOffset?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: yOffset, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
                duration: 0.7,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// 🎯 Backend QuoteData ne Activities card na shape ma convert karo
interface ActivityCard {
    id: number;
    title: string;
    date: string;
    image: string;
}

function mapQuoteToActivityCard(q: QuoteData): ActivityCard {
    const dateObj = new Date(q.event_date);
    return {
        id: q.id,
        title: q.description?.trim() || "Gurukul Activity",
        date: dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
        image: q.image_url,
    };
}

// 🎯 Backend QuoteData ne Events card na shape ma convert karo
interface EventCard {
    id: number;
    day: string;
    month: string;
    title: string;
    thumbnail: string;
}

function mapQuoteToEventCard(q: QuoteData): EventCard {
    const dateObj = new Date(q.event_date);
    return {
        id: q.id,
        day: dateObj.getDate().toString().padStart(2, "0"),
        month: dateObj.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
        title: q.description?.trim() || "Upcoming Event",
        thumbnail: q.image_url,
    };
}

// 🎯 NAVU: Daily Darshan backend DTO ne home page card na shape ma convert karo
interface DarshanCard {
    id: number;
    title: string;
    date: string;
    image: string;
}

interface DarshanDTO {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
    date: string; // "YYYY-MM-DD"
}

function mapDarshanToCard(d: DarshanDTO): DarshanCard {
    const dateObj = new Date(d.date);
    return {
        id: d.id,
        title: d.title,
        date: dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
        image: d.imageUrl,
    };
}

const LATEST_QUOTES = [
    {
        id: 1,
        title: "Love and compassion are the true essence of spirituality.",
        date: "19 AUG 2026",
        image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=500"
    },
    {
        id: 2,
        title: "Service to parents is the true worship of God.",
        date: "18 AUG 2026",
        image: "https://images.unsplash.com/photo-1544200502-6652e105f865?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 3,
        title: "Satsang from the heart brings peace in thoughts.",
        date: "17 AUG 2026",
        image: "https://images.unsplash.com/photo-1786748012490-1fdddb1b52dd?q=80&w=1213&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
];

export default function Overview() {
    const { theme } = useTheme();
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [overviewImages, setOverviewImages] = useState<string[]>([
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1616080409883-a96ae084a7e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ]);

    const [activities, setActivities] = useState<ActivityCard[]>([]);
    const [activitiesLoading, setActivitiesLoading] = useState<boolean>(true);

    const [events, setEvents] = useState<EventCard[]>([]);
    const [eventsLoading, setEventsLoading] = useState<boolean>(true);

    const [darshanItems, setDarshanItems] = useState<DarshanCard[]>([]);
    const [darshanLoading, setDarshanLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOverviewData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/overview`);
                const result = await res.json();
                if (result.success && result.data.heroSlider?.length) {
                    const urls = result.data.heroSlider.map((img: { id: number; url: string }) => img.url);
                    setOverviewImages(urls);
                }
            } catch (error) {
                console.error("Error fetching overview data:", error);
            }
        };
        fetchOverviewData();
    }, []);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setActivitiesLoading(true);
                const result = await quoteService.getQuotesByType("activity");
                if (result.success) {
                    setActivities(result.data.map(mapQuoteToActivityCard).slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching activities:", error);
            } finally {
                setActivitiesLoading(false);
            }
        };
        fetchActivities();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setEventsLoading(true);
                const result = await quoteService.getQuotesByType("event");
                if (result.success) {
                    setEvents(result.data.map(mapQuoteToEventCard).slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setEventsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        const fetchDarshan = async () => {
            try {
                setDarshanLoading(true);
                const res = await fetch(`${API_BASE_URL}/daily-darshan`, { cache: "no-store" });
                const result = await res.json();
                if (result.success) {
                    setDarshanItems((result.data as DarshanDTO[]).map(mapDarshanToCard).slice(0, 3));
                }
            } catch (error) {
                console.error("Error fetching daily darshan:", error);
            } finally {
                setDarshanLoading(false);
            }
        };
        fetchDarshan();
    }, []);

    useEffect(() => {
        if (overviewImages.length === 0) return;
        const timer = setInterval(() => {
            setCurrentImgIndex((prev) => (prev + 1) % overviewImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [overviewImages.length]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
        setMobileMenuOpen(false);
    };

    const navItems = [
        { name: "Activities", id: "section-activities" },
        { name: "Events", id: "section-events" },
        { name: "Daily Quotes", id: "section-quotes" },
        { name: "Daily Darshan", id: "section-darshan" },
    ];

    return (
        <div className={`w-full h-dvh overflow-y-auto overflow-x-hidden font-sans transition-colors duration-500 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none ${theme ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}>

            {/* ---------------- TRANSPARENT HEADER ---------------- */}
            <header className="absolute top-0 left-0 z-50 w-full bg-transparent pt-4 sm:pt-6 pb-4">
                <div className="w-full px-4 sm:px-6 lg:px-12 flex items-center justify-between relative">

                    {/* Left Side: Dark/Light Mode Switch + Brand Logo */}
                    <div className="flex items-center gap-4 sm:gap-6 lg:gap-10 shrink-0 z-10">
                        <div className="shrink-0">
                            <ThemeToggle />
                        </div>

                        <Link to="/" className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 shrink-0 group">
                            <span className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full transition-all duration-300 group-hover:scale-125 ${theme ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" : "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"}`} />
                            <span className="text-white drop-shadow-md">Gurukul</span>
                        </Link>
                    </div>

                    {/* Right Side: Nav (desktop) + Hamburger (mobile) + Login */}
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0 z-10">

                        <nav className="hidden lg:flex items-center gap-3">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide backdrop-blur-md border shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 cursor-pointer ${theme
                                        ? "bg-slate-900/60 border-slate-700/60 text-slate-100 hover:bg-slate-800/90 hover:border-blue-500/60 hover:shadow-blue-500/20"
                                        : "bg-white/50 border-white/70 text-slate-900 hover:bg-white/80 hover:border-red-500/50 hover:shadow-red-500/20"
                                        }`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </nav>

                        <button
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            aria-label="Toggle navigation menu"
                            className={`lg:hidden flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl backdrop-blur-md border shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${theme
                                ? "bg-slate-900/60 border-slate-700/60 text-white hover:bg-slate-800/90"
                                : "bg-white/50 border-white/70 text-slate-900 hover:bg-white/80"
                                }`}
                        >
                            {mobileMenuOpen ? <HiX size={20} /> : <HiMenu size={20} />}
                        </button>

                        <Link
                            to="/login"
                            className={`px-5 sm:px-7 py-2 sm:py-2.5 rounded-xl font-bold text-sm shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 border ${theme
                                ? "bg-blue-600/90 border-blue-400/50 text-white hover:bg-blue-500 hover:shadow-blue-500/40"
                                : "bg-red-600/90 border-red-500/50 text-white hover:bg-red-500 hover:shadow-red-500/40"
                                }`}
                        >
                            Login
                        </Link>
                    </div>
                </div>

                {/* Mobile dropdown menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden w-full px-4 sm:px-6 mt-3 absolute z-40"
                        >
                            <div
                                className={`flex flex-col gap-2 p-3 rounded-2xl backdrop-blur-md border shadow-xl ${theme
                                    ? "bg-slate-900/95 border-slate-700/60"
                                    : "bg-white/95 border-white/70"
                                    }`}
                            >
                                {navItems.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${theme
                                            ? "text-slate-100 hover:bg-slate-800/90 hover:text-blue-300"
                                            : "text-slate-900 hover:bg-red-50 hover:text-red-600"
                                            }`}
                                    >
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ---------------- SECTION 1: HERO SLIDER ---------------- */}
            <section className="relative h-dvh min-h-100 md:min-h-150 w-full flex items-center justify-center overflow-hidden shrink-0">
                <div className="absolute inset-0 z-0">
                    {overviewImages.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: index === currentImgIndex ? 1 : 0 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${img})` }}
                        />
                    ))}
                    <div className={`absolute inset-0 transition-colors duration-500 ${theme ? "bg-slate-950/60" : "bg-slate-900/40"}`} />
                </div>

                {/* Dots indicator */}
                <div className="absolute bottom-8 md:bottom-10 left-0 right-0 z-10 flex justify-center gap-2 sm:gap-3">
                    {overviewImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImgIndex(idx)}
                            className={`h-2.5 rounded-full transition-all duration-300 hover:scale-125 ${idx === currentImgIndex
                                ? (theme ? "w-8 sm:w-10 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)]" : "w-8 sm:w-10 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]")
                                : "w-2.5 bg-white/50 hover:bg-white"
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* ---------------- SECTION 2: ACTIVITIES ---------------- */}
            <section id="section-activities" className="w-full min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-16 md:py-24 lg:py-32 scroll-mt-0">
                <Reveal>
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 border-b pb-4 border-slate-200/20 group gap-4">
                        <div>
                            <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${theme ? "text-blue-400 group-hover:text-blue-300" : "text-red-600 group-hover:text-red-500"}`}>
                                Gurukul Highlights
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">ACTIVITIES</h2>
                        </div>
                        <Link
                            to="/activities"
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border w-full sm:w-auto text-center ${theme ? "bg-blue-600/20 text-blue-400 border-blue-500/40 hover:bg-blue-600/30 hover:shadow-blue-900/30 hover:border-blue-500/60" : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:shadow-red-200 hover:border-red-300"
                                }`}
                        >
                            VIEW ALL ACTIVITIES
                        </Link>
                    </div>
                </Reveal>

                {activitiesLoading ? (
                    <div className="flex justify-center py-16">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-t-transparent animate-spin ${theme ? "border-blue-500" : "border-red-600"}`} />
                    </div>
                ) : activities.length === 0 ? (
                    <p className={`text-center py-16 text-sm ${theme ? "text-slate-500" : "text-slate-400"}`}>
                        No activities added yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {activities.map((act, idx) => (
                            <Reveal key={act.id} delay={idx * 0.12} yOffset={45}>
                                <motion.div
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className={`group rounded-2xl overflow-hidden border shadow-xs transition-all duration-300 ${theme ? "bg-slate-900/60 border-slate-800 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-900/20" : "bg-white border-slate-200 hover:shadow-xl hover:border-red-200"
                                        }`}
                                >
                                    <div className="h-56 sm:h-64 overflow-hidden relative">
                                        <img
                                            src={act.image}
                                            alt={act.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                        <span className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs transition-transform duration-300 group-hover:scale-105 group-hover:bg-black/90">
                                            {act.date}
                                        </span>
                                    </div>
                                    <div className="p-5 sm:p-6">
                                        <span className={`text-[11px] sm:text-xs font-bold transition-colors duration-300 ${theme ? "text-blue-400 group-hover:text-blue-300" : "text-red-600 group-hover:text-red-500"}`}>
                                            Gurukul Highlights
                                        </span>
                                        <h3 className="font-bold text-base sm:text-lg mt-1 sm:mt-2 line-clamp-2 leading-snug">
                                            {act.title}
                                        </h3>
                                    </div>
                                </motion.div>
                            </Reveal>
                        ))}
                    </div>
                )}
            </section>

            {/* ---------------- SECTION 3: UPCOMING EVENTS ---------------- */}
            <section id="section-events" className={`w-full min-h-screen flex flex-col justify-center py-16 md:py-24 lg:py-32 scroll-mt-0 transition-colors duration-500 ${theme ? "bg-slate-900/40" : "bg-slate-100/60"}`}>
                <div className="w-full px-4 sm:px-8 lg:px-16">
                    <Reveal>
                        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 border-b pb-4 border-slate-200/20 group gap-4">
                            <div>
                                <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${theme ? "text-blue-400 group-hover:text-blue-300" : "text-red-600 group-hover:text-red-500"}`}>
                                    Gurukul Events
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">UPCOMING EVENTS</h2>
                            </div>
                            <Link
                                to="/events"
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border w-full sm:w-auto text-center ${theme ? "bg-blue-600/20 text-blue-400 border-blue-500/40 hover:bg-blue-600/30 hover:shadow-blue-900/30 hover:border-blue-500/60" : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:shadow-red-200 hover:border-red-300"
                                    }`}
                            >
                                VIEW ALL EVENTS
                            </Link>
                        </div>
                    </Reveal>

                    {eventsLoading ? (
                        <div className="flex justify-center py-16">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-t-transparent animate-spin ${theme ? "border-blue-500" : "border-red-600"}`} />
                        </div>
                    ) : events.length === 0 ? (
                        <p className={`text-center py-16 text-sm ${theme ? "text-slate-500" : "text-slate-400"}`}>
                            No upcoming events added yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                            {events.map((item, idx) => (
                                <Reveal key={item.id} delay={idx * 0.12} yOffset={40}>
                                    <Link to="/events">
                                        <motion.div
                                            whileHover={{ scale: 1.02, x: 4 }}
                                            transition={{ duration: 0.3 }}
                                            className={`group flex items-center p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${theme
                                                ? "bg-slate-900/80 border-slate-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/30"
                                                : "bg-white border-slate-200/80 hover:shadow-xl hover:border-red-300"
                                                }`}
                                        >
                                            <div className={`flex flex-col items-center justify-center min-w-18 h-18 sm:min-w-20 sm:h-20 rounded-xl font-bold p-2 sm:p-3 mr-4 sm:mr-6 transition-all duration-300 group-hover:scale-105 ${theme ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 group-hover:bg-blue-600/30" : "bg-red-50 text-red-600 border border-red-200 group-hover:bg-red-100"
                                                }`}>
                                                <span className="text-xl sm:text-2xl font-black leading-none">{item.day}</span>
                                                <span className="text-[10px] sm:text-xs tracking-widest mt-1">{item.month}</span>
                                            </div>

                                            <div className="flex-1 min-w-0 pr-3 sm:pr-4">
                                                <h3 className="font-bold text-base sm:text-lg truncate mt-1">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            <div className="overflow-hidden rounded-xl w-16 h-16 sm:w-24 sm:h-24 shrink-0">
                                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125" />
                                            </div>
                                        </motion.div>
                                    </Link>
                                </Reveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ---------------- SECTION 4: DAILY QUOTES ---------------- */}
            <section id="section-quotes" className="w-full min-h-screen flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-16 md:py-24 lg:py-32 scroll-mt-0">
                <Reveal>
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 border-b pb-4 border-slate-200/20 group gap-4">
                        <div>
                            <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${theme ? "text-blue-400 group-hover:text-blue-300" : "text-red-600 group-hover:text-red-500"}`}>
                                Daily Inspiration
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">DAILY QUOTES</h2>
                        </div>
                        <Link
                            to="/amrut-aachaman"
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border w-full sm:w-auto text-center ${theme ? "bg-blue-600/20 text-blue-400 border-blue-500/40 hover:bg-blue-600/30 hover:shadow-blue-900/30 hover:border-blue-500/60" : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:shadow-red-200 hover:border-red-300"
                                }`}
                        >
                            VIEW MORE QUOTES
                        </Link>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {LATEST_QUOTES.map((q, idx) => (
                        <Reveal key={q.id} delay={idx * 0.1}>
                            <motion.div
                                whileHover={{ y: -6, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                className={`group rounded-2xl overflow-hidden border transition-all duration-300 ${theme ? "bg-slate-900/60 border-slate-800 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-900/20" : "bg-white border-slate-200 shadow-xs hover:shadow-xl hover:border-red-200"
                                    }`}
                            >
                                <div className="h-64 sm:h-72 overflow-hidden relative">
                                    <img src={q.image} alt={q.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                                </div>
                                <div className="p-5 sm:p-6">
                                    <span className={`text-[11px] sm:text-xs font-medium transition-colors duration-300 ${theme ? "text-slate-400 group-hover:text-blue-400" : "text-slate-500 group-hover:text-red-500"}`}>{q.date}</span>
                                    <p className="font-bold text-lg sm:text-xl mt-2 leading-snug">
                                        "{q.title}"
                                    </p>
                                </div>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ---------------- SECTION 5: DAILY DARSHAN ---------------- */}
            <section id="section-darshan" className={`w-full min-h-screen flex flex-col justify-center py-16 md:py-24 lg:py-32 scroll-mt-0 transition-colors duration-500 ${theme ? "bg-slate-900/30" : "bg-slate-100/50"}`}>
                <div className="w-full px-4 sm:px-8 lg:px-16">
                    <Reveal>
                        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 border-b pb-4 border-slate-200/20 group gap-4">
                            <div>
                                <span className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${theme ? "text-blue-400 group-hover:text-blue-300" : "text-red-600 group-hover:text-red-500"}`}>
                                    Nitya Darshan
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight">DAILY DARSHAN</h2>
                            </div>
                            <Link
                                to="/daily-darshan"
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border w-full sm:w-auto text-center ${theme ? "bg-blue-600/20 text-blue-400 border-blue-500/40 hover:bg-blue-600/30 hover:shadow-blue-900/30 hover:border-blue-500/60" : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:shadow-red-200 hover:border-red-300"
                                    }`}
                            >
                                VIEW MORE DARSHAN
                            </Link>
                        </div>
                    </Reveal>

                    {darshanLoading ? (
                        <div className="flex justify-center py-16">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-t-transparent animate-spin ${theme ? "border-blue-500" : "border-red-600"}`} />
                        </div>
                    ) : darshanItems.length === 0 ? (
                        <p className={`text-center py-16 text-sm ${theme ? "text-slate-500" : "text-slate-400"}`}>
                            No darshan added yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            {darshanItems.map((d, idx) => (
                                <Reveal key={d.id} delay={idx * 0.1}>
                                    <motion.div
                                        whileHover={{ y: -6, scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                        className={`group rounded-2xl overflow-hidden border transition-all duration-300 ${theme ? "bg-slate-900/60 border-slate-800 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-900/20" : "bg-white border-slate-200 shadow-xs hover:shadow-xl hover:border-red-200"
                                            }`}
                                    >
                                        <div className="h-64 sm:h-80 overflow-hidden relative">
                                            <img src={d.image} alt={d.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                                        </div>
                                        <div className="p-5 sm:p-6">
                                            <span className={`text-[11px] sm:text-xs font-medium transition-colors duration-300 ${theme ? "text-slate-400 group-hover:text-blue-400" : "text-slate-500 group-hover:text-red-500"}`}>{d.date}</span>
                                            <h3 className="font-bold text-base sm:text-lg mt-1 sm:mt-2 leading-snug">
                                                {d.title}
                                            </h3>
                                        </div>
                                    </motion.div>
                                </Reveal>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ---------------- SECTION 6: FOOTER ---------------- */}
            <footer className={`w-full pt-12 md:pt-16 pb-8 md:pb-12 border-t transition-colors duration-500 ${theme ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-900 border-slate-800 text-slate-200"}`}>
                <div className="w-full px-4 sm:px-8 lg:px-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pb-10 border-b border-slate-800">
                        <Reveal>
                            <h3 className={`text-xl sm:text-2xl font-black mb-3 transition-colors duration-300 ${theme ? "text-blue-400 hover:text-blue-300" : "text-red-500 hover:text-red-400"}`}>
                                Shree Swaminarayan Gurukul - Bhayavadar
                            </h3>
                            <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                                Padvala Road, Ta.Upleta, Dist. Rajkot, Bhayavadar (Gujarat)<br />
                                Establishing true education with moral values and divine devotion for societal welfare.
                            </p>
                        </Reveal>

                        <Reveal delay={0.1}>
                            <h4 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">Quick Navigation</h4>
                            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400">
                                <li><button onClick={() => scrollToSection("section-quotes")} className={`inline-block transition-all duration-300 hover:translate-x-2 cursor-pointer ${theme ? "hover:text-blue-400" : "hover:text-red-400"}`}>Daily Quotes</button></li>
                                <li><button onClick={() => scrollToSection("section-darshan")} className={`inline-block transition-all duration-300 hover:translate-x-2 cursor-pointer ${theme ? "hover:text-blue-400" : "hover:text-red-400"}`}>Daily Darshan</button></li>
                                <li><button onClick={() => scrollToSection("section-activities")} className={`inline-block transition-all duration-300 hover:translate-x-2 cursor-pointer ${theme ? "hover:text-blue-400" : "hover:text-red-400"}`}>Activities</button></li>
                                <li><button onClick={() => scrollToSection("section-events")} className={`inline-block transition-all duration-300 hover:translate-x-2 cursor-pointer ${theme ? "hover:text-blue-400" : "hover:text-red-400"}`}>Upcoming Events</button></li>
                            </ul>
                        </Reveal>

                        <Reveal delay={0.2}>
                            <h4 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">Contact & Support</h4>
                            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-400">
                                <p className="transition-colors duration-300 hover:text-white"><strong className={theme ? "text-blue-400" : "text-red-400"}>Phone:</strong> +91 70484 80003/4</p>
                                <p className="transition-colors duration-300 hover:text-white"><strong className={theme ? "text-blue-400" : "text-red-400"}>Email:</strong> BhayavarGurukul@gmail.com</p>
                                <p className="transition-colors duration-300 hover:text-white"><strong className={theme ? "text-blue-400" : "text-red-400"}>Support:</strong> support@RajkotSansthan.com</p>
                            </div>
                        </Reveal>
                    </div>

                    <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-slate-500 gap-4 text-center sm:text-left">
                        <p>© {new Date().getFullYear()} Swaminarayan Gurukul Rajkot Sansthan. All Rights Reserved.</p>
                        <div className="flex gap-4 sm:gap-6">
                            <span className="hover:text-slate-300 transition-colors duration-300 cursor-pointer">Privacy Policy</span>
                            <span className="hover:text-slate-300 transition-colors duration-300 cursor-pointer">Terms of Service</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}