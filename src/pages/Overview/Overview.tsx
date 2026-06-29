import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "../../components/theme/ThemeToggle";
import { useTheme } from "../../components/theme/ThemeContext";
import { Link } from "react-router-dom";
import EventCalendarPopup, { eventsData } from "../../components/Event-Calendar/Event-Calendar";

const STATIC_DATA = {
    section1: {
        images: [],
        menuOptions: [
            { id: 1, label: "Amrut Nu Aachaman" },
            { id: 2, label: "Daily Darshan" },
        ],
    },
    section2: {
        title: "Revolutionizing Education with AI",
        description:
            "An AI-Powered LMS bridging the digital divide in schools, colleges, coaching centres, and rural institutions — even offline.",
    },
    section3: {
        tagline: "AI-POWERED LEARNING",
        title: "Smart & Offline Infrastructure",
        description:
            "Offline content management powered by cutting-edge technology, which delivers the best education to students even without the internet.",
    },
    footer: {
        brandName: "RuralSpark",
        brandDescription:
            "Empowering rural education through cutting-edge AI technology, bringing digital content where it matters most.",
        contactEmail: "support@ruralspark.com",
        links: [
            { label: "About Us", href: "#about" },
            { label: "Features", href: "#features" },
            { label: "Contact", href: "#contact" },
        ],
    },
};

function maskFade(fromPercent: number) {
    return {
        maskImage: `linear-gradient(to bottom, black ${fromPercent}%, transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to bottom, black ${fromPercent}%, transparent 100%)`,
    };
}

function Reveal({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function Overview() {
    const { theme } = useTheme(); // theme = true (Dark), theme = false (Light)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    // કેલેન્ડર પોપઅપ માટે state
    const [isEventCalendarOpen, setIsEventCalendarOpen] = useState(false);

    // નવી સિલેક્ટ કરેલી તારીખ સાચવવા માટે state (Default આજની તારીખ)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // ફોર્મ માટેના States
    const [formData, setFormData] = useState({ suid: "", fullName: "", std: "", grNo: "" });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const { section1, section2, section3, footer } = STATIC_DATA;

    // સિલેક્ટ કરેલા દિવસ અને મહિનાની માહિતી
    const dayNumber = selectedDate.getDate().toString().padStart(2, '0');
    const monthShort = selectedDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();

    const yearStr = selectedDate.getFullYear();
    const monthStr = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dateStr = String(selectedDate.getDate()).padStart(2, '0');
    const todayStr = `${yearStr}-${monthStr}-${dateStr}`;

    const todayEvent = eventsData ? eventsData[todayStr] : null;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImgIndex((prevIndex) => (prevIndex + 1) % (section1.images.length || 1));
        }, 3000);
        return () => clearInterval(timer);
    }, [section1.images.length]);

    // ફોટો અપલોડ હેન્ડલર
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Student details submitted successfully!");
        setFormData({ suid: "", fullName: "", std: "", grNo: "" });
        setPhotoPreview(null);
    };

    // Ultra Premium Luxury Inputs Styling 
    const inputClasses = `w-full px-5 py-3.5 rounded-2xl text-sm font-medium transition-all duration-500 outline-none border backdrop-blur-md shadow-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield] ${theme
            ? "bg-slate-900/40 border-slate-800 text-slate-100 placeholder-slate-500 hover:border-blue-900/60 focus:border-blue-500 focus:bg-slate-900/80 focus:shadow-[0_0_20px_rgba(37,99,235,0.07)]"
            : "bg-white/70 border-slate-200/60 text-slate-800 placeholder-slate-400 hover:border-red-300/60 focus:border-red-600 focus:bg-white focus:shadow-[0_0_20px_rgba(239,68,68,0.06)]"
        }`;

    return (
        <div className={`h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth [&::-webkit-scrollbar]:none [-ms-overflow-style:none] scrollbar-none relative transition-colors duration-500 ${theme ? "bg-slate-950" : "bg-slate-50/50"}`}>

            {/* ---------------- SECTION 1: HERO / IMAGES ---------------- */}
            <section className={`h-screen w-full snap-start relative flex flex-col justify-between p-6 overflow-hidden transition-colors duration-500 ${theme ? "bg-slate-950" : "bg-white"}`}>
                <div className="absolute inset-0 z-0" style={maskFade(40)}>
                    {section1.images.map((img, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImgIndex ? "opacity-100" : "opacity-0"}`}
                            style={{ backgroundImage: `url(${img})` }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative z-30 flex justify-between items-center w-full"
                >
                    <div className="flex items-center gap-4 sm:gap-6">
                        <ThemeToggle />

                        <div className="relative">
                            <button
                                onClick={() => { setIsMenuOpen(!isMenuOpen); setIsEventCalendarOpen(false); }}
                                className={`flex flex-col justify-center items-center gap-1 w-10 h-10 bg-white rounded-xl shadow-md border transition-all active:scale-90 cursor-pointer ${theme ? "border-blue-200" : "border-red-200"}`}
                            >
                                <div className={`h-0.5 w-5 transition-all rounded-2xl ${theme ? "bg-blue-600" : "bg-red-600"} ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                                <div className={`h-0.5 w-5 transition-all rounded-2xl ${theme ? "bg-blue-600" : "bg-red-600"} ${isMenuOpen ? 'opacity-0' : ''}`} />
                                <div className={`h-0.5 w-5 transition-all rounded-2xl ${theme ? "bg-blue-600" : "bg-red-600"} ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                            </button>

                            <div className={`absolute top-12 left-0 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-top-left z-50 ${theme ? "border border-blue-200" : "border border-red-200"} ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                                <div className="flex flex-col p-2 gap-1">
                                    {section1.menuOptions.map((option, idx) => (
                                        <div key={option.id}>
                                            <button className={`w-full flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-colors hover:bg-gray-50 font-bold text-sm ${theme ? "text-blue-600" : "text-red-600"}`}>
                                                <span className={`w-2 h-2 rounded-full ${theme ? "bg-blue-600" : "bg-red-600"}`} />
                                                {option.label}
                                            </button>
                                            {idx !== section1.menuOptions.length - 1 && (
                                                <div className={`h-px w-full opacity-10 ${theme ? "bg-blue-600" : "bg-red-600"}`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link to={"/login"} className={`flex items-center justify-center px-4 py-2 bg-white rounded-xl shadow-md border font-bold text-sm transition-all active:scale-90 ${theme ? "border-blue-200 text-blue-600 hover:bg-blue-50/30" : "border-red-200 text-red-600 hover:bg-red-50/30"}`}>
                        Login
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="relative z-10 flex flex-col items-center gap-3 mt-auto mb-2"
                >
                    <div className="flex justify-center gap-2">
                        {(section1.images.length > 0 ? section1.images : [1, 2, 3]).map((_, idx) => (
                            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImgIndex ? (theme ? "w-6 bg-blue-500" : "w-6 bg-red-500") : "w-2 bg-white/40"}`} />
                        ))}
                    </div>

                    <div className="flex flex-col items-center">
                        <span className={`text-xs font-bold mb-1 ${theme ? "text-white/80" : "text-slate-900/70"}`}>
                            Scroll Down
                        </span>
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                            className={`w-1 h-4 rounded-full ${theme ? "bg-blue-500" : "bg-red-500"}`}
                        />
                    </div>
                </motion.div>
            </section>

            {/* ---------------- SECTION 2: TEXT INTRODUCTION ---------------- */}
            <section className={`relative h-screen w-full snap-start flex flex-col items-center gap-10 justify-center text-center px-6 transition-colors duration-500 ${theme ? "bg-slate-950" : "bg-white"}`}>
                <div className="relative z-20">
                    <Reveal>
                        <h1 className={`text-4xl md:text-5xl font-black mb-4 tracking-wide transition-colors ${theme ? "text-blue-600" : "text-red-600"}`}>
                            {section2.title}
                        </h1>
                    </Reveal>
                    <Reveal delay={0.15}>
                        <p className={`font-medium max-w-xl leading-relaxed ${theme ? "text-gray-400" : "text-gray-500"}`}>
                            {section2.description}
                        </p>
                    </Reveal>
                </div>
                <div className={`w-200 h-150 p-5 rounded-[50px] bg-amber-300`}>
                    <div className={`w-full h-full rounded-[40px] bg-gray-900`}></div>
                </div>
            </section>

            {/* ---------------- SECTION 3: NEW 70% - 30% LUXURY LAYOUT ---------------- */}
            <section className="h-screen w-full snap-start relative flex flex-col lg:flex-row gap-6 p-6 lg:p-8 overflow-hidden">

                {/* --- 70% LEFT PART --- */}
                <div className={`relative flex-1 lg:w-[70%] h-[50%] lg:h-full rounded-4xl p-8 flex items-center justify-center shadow-[0_22px_50px_rgba(0,0,0,0.03)] border transition-all duration-500 ${theme ? "bg-slate-900/95 border-slate-800 shadow-black/40" : "bg-white border-slate-100"
                    }`}>
                    {/* Your 70% content goes here */}
                </div>

                {/* --- 30% RIGHT PART: ULTRA PREMIUM REGISTRATION BOX --- */}
                <div className={`relative w-full lg:w-[30%] h-[50%] lg:h-full rounded-4xl p-8 flex flex-col justify-between shadow-[0_25px_60px_-15px_rgba(0,0,0,0.04)] border transition-all duration-500 backdrop-blur-xl ${theme
                        ? "bg-slate-900/20 border-slate-800/60 shadow-black/50"
                        : "bg-white/90 border-slate-200/50"
                    }`}>

                    {/* --- HEADER & CALENDAR BAR --- */}
                    <div className="flex justify-between items-center w-full mb-8 relative z-30">
                        {/* Ultra Premium Header */}
                        <div className="flex flex-col gap-0.5">
                            <h3 className={`text-sm font-black tracking-tight leading-tight uppercase ${theme ? "text-blue-500" : "text-red-600"}`}>
                                Join Us
                            </h3>
                            <p className={`text-lg font-bold tracking-tight ${theme ? "text-slate-200" : "text-slate-800"}`}>
                                Student Entry
                            </p>
                        </div>

                        {/* Calendar Button */}
                        <div className="relative flex flex-col items-end">
                            <button
                                onClick={() => setIsEventCalendarOpen(!isEventCalendarOpen)}
                                className={`group relative flex items-center justify-center h-11 px-4 rounded-2xl shadow-sm border transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-md ${theme
                                        ? "bg-slate-900/80 border-slate-800 text-slate-100 hover:border-blue-500/50 hover:bg-slate-900"
                                        : "bg-white border-slate-200/80 text-slate-800 hover:border-red-500/40 hover:shadow-md"
                                    }`}
                            >
                                <div className="flex items-center">
                                    <span className={`text-[16px] font-black tracking-tight ${theme ? "text-blue-500" : "text-red-600"}`}>
                                        {dayNumber}
                                    </span>

                                    <span className={`text-[12px] font-light mx-2 ${theme ? "text-slate-700" : "text-slate-300"}`}>|</span>

                                    <span className="text-[11px] font-black tracking-widest mt-0.5 opacity-80">
                                        {monthShort}
                                    </span>
                                </div>

                                {/* Dynamic Event Pulse Dot */}
                                {todayEvent && (
                                    <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 animate-pulse border-white ${todayEvent.category === 'event' ? "bg-emerald-500" : "bg-blue-500"
                                        }`}></span>
                                )}
                            </button>

                            {/* Calendar Popup */}
                            <div className="absolute top-14 right-0 origin-top-right">
                                <EventCalendarPopup
                                    isOpen={isEventCalendarOpen}
                                    onClose={() => setIsEventCalendarOpen(false)}
                                    selectedDate={selectedDate}
                                    onSelectDate={(date: Date) => {
                                        setSelectedDate(date);
                                        setIsEventCalendarOpen(false);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- REGISTRATION FORM --- */}
                    <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 gap-5 overflow-y-auto scrollbar-none pb-1">

                        {/* Student Photo Luxury Avatar Picker */}
                        <div className="flex justify-center mb-4">
                            <label className="relative cursor-pointer group">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.3 }}
                                    className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-500 overflow-hidden ${theme
                                            ? "border-slate-800 group-hover:border-blue-500 bg-slate-900/30 group-hover:bg-slate-900/60"
                                            : "border-slate-200 group-hover:border-red-600 bg-slate-50/60 group-hover:bg-white"
                                        }`}
                                >
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Student Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-1.5">
                                            <svg className={`w-6 h-6 transition-colors duration-300 ${theme ? "text-slate-600 group-hover:text-blue-400" : "text-slate-400 group-hover:text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className={`text-[9px] font-black tracking-[0.15em] uppercase ${theme ? "text-slate-500" : "text-slate-400"}`}>Upload</span>
                                        </div>
                                    )}
                                </motion.div>
                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                            </label>
                        </div>

                        {/* SUID Field */}
                        <div className="w-full">
                            <input
                                type="number"
                                required
                                placeholder="SUID *"
                                value={formData.suid}
                                onChange={(e) => setFormData({ ...formData, suid: e.target.value })}
                                className={inputClasses}
                            />
                        </div>

                        {/* Full Name Field */}
                        <div className="w-full">
                            <input
                                type="text"
                                required
                                placeholder="Full Name *"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className={inputClasses}
                            />
                        </div>

                        {/* STD & G.R. No. Row */}
                        <div className="flex gap-4 w-full">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="STD "
                                    value={formData.std}
                                    onChange={(e) => setFormData({ ...formData, std: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="number"
                                    placeholder="G.R. Number"
                                    value={formData.grNo}
                                    onChange={(e) => setFormData({ ...formData, grNo: e.target.value })}
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        {/* Luxury Calm Submit Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className={`w-full mt-4 py-4 rounded-2xl font-bold tracking-wide text-white text-sm transition-all duration-500 cursor-pointer ${theme
                                    ? "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_15px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.35)]"
                                    : "bg-linear-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-[0_15px_30px_rgba(239,68,68,0.2)] hover:shadow-[0_15px_35px_rgba(239,68,68,0.35)]"
                                }`}
                        >
                            Submit Application
                        </motion.button>
                    </form>
                </div>
            </section>

            {/* ---------------- SECTION 4: SMART & OFFLINE INFRASTRUCTURE ---------------- */}
            <section className={`h-screen w-full snap-start relative flex items-center justify-center transition-colors duration-500 ${theme ? "bg-slate-950" : "bg-white"}`}>
                <Reveal className={`relative z-10 text-center px-6 max-w-2xl p-6 rounded-3xl shadow-xl border ${theme ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-gray-100"}`}>
                    <span className={`text-xs font-black tracking-widest uppercase ${theme ? "text-blue-500" : "text-red-500"}`}>
                        {section3.tagline}
                    </span>
                    <h2 className={`text-3xl md:text-4xl font-extrabold mt-2 mb-4 ${theme ? "text-white" : "text-slate-800"}`}>
                        {section3.title}
                    </h2>
                    <p className={`text-sm md:text-base leading-relaxed ${theme ? "text-gray-400" : "text-gray-600"}`}>
                        {section3.description}
                    </p>
                </Reveal>
            </section>

            {/* ---------------- SECTION 5: FOOTER SECTION ---------------- */}
            <section className="h-screen w-full snap-start relative flex flex-col justify-between p-10 bg-slate-950 text-gray-400">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-auto max-w-6xl w-full mx-auto">
                    <Reveal className="flex flex-col gap-3">
                        <h3 className={`text-2xl font-black ${theme ? "text-blue-500" : "text-red-500"}`}>
                            {footer.brandName}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-xs">
                            {footer.brandDescription}
                        </p>
                    </Reveal>

                    <Reveal delay={0.1} className="flex flex-col gap-2">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Links</h4>
                        <nav className="flex flex-col gap-1 text-sm">
                            {footer.links.map((link, idx) => (
                                <a key={idx} href={link.href} className="hover:text-white transition-colors">
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </Reveal>

                    <Reveal delay={0.2} className="flex flex-col gap-2">
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contact Support</h4>
                        <p className="text-sm text-gray-500">Have questions? Reach out to us at:</p>
                        <a href={`mailto:${footer.contactEmail}`} className={`text-sm font-bold ${theme ? "text-blue-400 hover:text-blue-300" : "text-red-400 hover:text-red-300"}`}>
                            {footer.contactEmail}
                        </a>
                    </Reveal>
                </div>

                <div className="border-t border-gray-800/60 pt-6 mt-10 max-w-6xl w-full mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <p>© {new Date().getFullYear()} {footer.brandName}. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
                        <a href="#terms" className="hover:text-gray-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </section>
        </div>
    );
}