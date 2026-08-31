import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../components/theme/ThemeContext";
import { quoteService, type QuoteData } from "../../services/Quoteservice";

const GROUP_PREFIX = "__GURUKUL_ACTIVITY_GROUP_V1__";

interface ActivityImage {
    id: number;
    url: string;
}

interface ActivityGroup {
    id: string;
    title: string;
    date: string;
    description: string;
    images: ActivityImage[];
}

interface GroupPayload {
    groupId: string;
    title: string;
    description: string;
}

interface ActivityGroupItem {
    id: number;
    groupId?: string;
    title: string;
    description: string;
    date: string;
    image: string;
}

function decodeGroupDescription(rawDescription?: string | null) {
    const raw = rawDescription || "";
    if (!raw.startsWith(GROUP_PREFIX)) {
        return {
            title: "Gurukul Activity",
            description: raw,
            groupId: undefined,
        };
    }

    try {
        const payload = JSON.parse(raw.slice(GROUP_PREFIX.length)) as GroupPayload;
        return {
            title: payload.title?.trim() || "Gurukul Activity",
            description: payload.description || "",
            groupId: payload.groupId,
        };
    } catch {
        return {
            title: "Gurukul Activity",
            description: raw,
            groupId: undefined,
        };
    }
}

function mapQuoteToActivityGroupItem(q: QuoteData): ActivityGroupItem {
    const metadata = decodeGroupDescription(q.description);
    const dateObj = new Date(`${q.event_date.split("T")[0]}T00:00:00`);

    return {
        id: q.id,
        groupId: metadata.groupId,
        title: metadata.title,
        description: metadata.description,
        date: dateObj.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).toUpperCase(),
        image: q.image_url,
    };
}

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

export default function ActivitiesPage() {
    const { theme } = useTheme();
    const [activities, setActivities] = useState<ActivityGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [selectedActivity, setSelectedActivity] = useState<ActivityGroup | null>(null);
    const [galleryIndex, setGalleryIndex] = useState(0);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                setLoadError(null);
                const result = await quoteService.getQuotesByType("activity");

                if (result.success) {
                    const groupMap = new Map<string, ActivityGroup>();

                    result.data.map(mapQuoteToActivityGroupItem).forEach((item: ActivityGroupItem) => {
                        const groupId = item.groupId || `legacy-activity-${item.id}`;
                        const existing = groupMap.get(groupId);

                        if (existing) {
                            if (!existing.images.some((image) => image.id === item.id)) {
                                existing.images.push({ id: item.id, url: item.image });
                            }
                            return;
                        }

                        groupMap.set(groupId, {
                            id: groupId,
                            title: item.title,
                            date: item.date,
                            description: item.description,
                            images: [{ id: item.id, url: item.image }],
                        });
                    });

                    setActivities(
                        Array.from(groupMap.values()).map((group) => ({
                            ...group,
                            images: [...group.images].sort((a, b) => a.id - b.id),
                        })),
                    );
                }
            } catch (error: unknown) {
                setLoadError(error instanceof Error ? error.message : "Unable to load activities.");
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const openActivity = (activity: ActivityGroup) => {
        setSelectedActivity(activity);
        setGalleryIndex(0);
    };

    const closeActivity = () => {
        setSelectedActivity(null);
        setGalleryIndex(0);
    };

    const handleNext = useCallback(() => {
        if (selectedActivity && galleryIndex < selectedActivity.images.length - 1) {
            setGalleryIndex((current) => current + 1);
        }
    }, [galleryIndex, selectedActivity]);

    const handlePrev = useCallback(() => {
        if (galleryIndex > 0) setGalleryIndex((current) => current - 1);
    }, [galleryIndex]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!selectedActivity) return;
            if (event.key === "ArrowRight") handleNext();
            if (event.key === "ArrowLeft") handlePrev();
            if (event.key === "Escape") closeActivity();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext, handlePrev, selectedActivity]);

    const headingClass = useMemo(
        () =>
            theme
                ? "bg-linear-to-r from-white via-slate-200 to-slate-400"
                : "bg-linear-to-r from-slate-900 via-slate-700 to-slate-500",
        [theme],
    );

    return (
        <div
            className={`h-screen w-full overflow-y-auto scroll-smooth font-sans transition-colors duration-500 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none ${
                theme ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
            }`}
        >
            <div className="mx-auto w-full max-w-360 px-5 pt-6 sm:px-10 sm:pt-8 lg:px-16">
                <Link
                    to="/"
                    className={`group inline-flex items-center gap-2.5 rounded-full border px-6 py-2.5 text-sm font-bold shadow-sm backdrop-blur-md transition-all duration-300 active:scale-95 ${
                        theme
                            ? "border-slate-700 bg-[#151D2F]/80 text-slate-300 hover:-translate-y-0.5 hover:border-blue-500/50 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
                            : "border-slate-200 bg-white/80 text-slate-700 hover:border-red-300 hover:text-red-600 hover:shadow-lg hover:shadow-red-500/15"
                    }`}
                >
                    <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    Back
                </Link>
            </div>

            <main className="mx-auto w-full max-w-360 px-5 py-8 pb-24 sm:px-10 lg:px-16">
                <Reveal>
                    <div className="relative mb-14 text-center sm:mb-16">
                        <p className={`relative z-10 mb-4 text-xs font-bold uppercase tracking-[0.3em] ${theme ? "text-blue-400" : "text-red-600"}`}>
                            The Gurukul collection
                        </p>
                        <h1 className="relative z-10 mb-5 pb-2 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            <span className={`bg-clip-text text-transparent ${headingClass}`}>All Past </span>
                            <span
                                className={`bg-clip-text text-transparent ${
                                    theme
                                        ? "bg-linear-to-r from-blue-400 to-indigo-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.3)]"
                                        : "bg-linear-to-r from-red-600 to-rose-500"
                                }`}
                            >
                                Activities
                            </span>
                        </h1>
                        <p className={`relative z-10 mx-auto max-w-2xl text-lg font-medium leading-relaxed sm:text-xl ${theme ? "text-slate-400" : "text-slate-500"}`}>
                            Explore the educational, spiritual, and cultural moments organized by Swaminarayan Gurukul.
                        </p>
                    </div>
                </Reveal>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className={`h-10 w-10 animate-spin rounded-full border-4 border-t-transparent ${theme ? "border-blue-500" : "border-red-600"}`} />
                    </div>
                ) : loadError ? (
                    <div className={`mx-auto max-w-lg rounded-2xl border px-6 py-10 text-center shadow-sm ${
                        theme ? "border-slate-800 bg-slate-900/60 text-slate-300" : "border-slate-200 bg-white text-slate-600"
                    }`}>
                        <p className="text-sm font-semibold">Unable to load activities</p>
                        <p className={`mt-2 text-sm ${theme ? "text-slate-500" : "text-slate-400"}`}>{loadError}</p>
                    </div>
                ) : activities.length === 0 ? (
                    <p className={`py-20 text-center text-sm ${theme ? "text-slate-500" : "text-slate-400"}`}>
                        No activities added yet.
                    </p>
                ) : (
                    <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {activities.map((activity, index) => (
                            <Reveal key={activity.id} delay={index * 0.05}>
                                <motion.button
                                    type="button"
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    onClick={() => openActivity(activity)}
                                    className={`group flex h-full w-full flex-col overflow-hidden rounded-2xl border text-left shadow-sm transition-all duration-300 hover:-translate-y-1 ${
                                        theme
                                            ? "border-slate-800 bg-slate-900/60 hover:border-blue-500/30 hover:shadow-xl hover:shadow-black/50"
                                            : "border-slate-200 bg-white hover:border-red-200 hover:shadow-2xl"
                                    }`}
                                >
                                    <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden">
                                        <img
                                            src={activity.images[0].url}
                                            alt={activity.title}
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
                                        {activity.images.length > 1 && (
                                            <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 px-2.5 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
                                                <Images size={13} /> {activity.images.length} images
                                            </span>
                                        )}
                                        <span className="absolute bottom-3 left-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                                            {activity.date}
                                        </span>
                                    </div>
                                    <div className="flex grow flex-col p-5 sm:p-6">
                                        <span className={`mb-1 text-xs font-bold uppercase tracking-wider ${theme ? "text-blue-400" : "text-red-600"}`}>
                                            Gurukul Highlights
                                        </span>
                                        <h2 className="line-clamp-2 text-base font-bold leading-snug">{activity.title}</h2>
                                        <p className={`mt-3 line-clamp-2 text-sm leading-relaxed ${theme ? "text-slate-400" : "text-slate-500"}`}>
                                            {activity.description || "No description provided."}
                                        </p>
                                    </div>
                                </motion.button>
                            </Reveal>
                        ))}
                    </div>
                )}
            </main>

            <AnimatePresence>
                {selectedActivity && (
                                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeActivity}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(event) => event.stopPropagation()}
                            className={`relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border shadow-2xl md:flex-row ${
                                theme ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900"
                            }`}
                        >
                                    <div className={`relative flex min-h-72 flex-1 items-center justify-center p-5 md:min-h-155 ${theme ? "bg-[#090F1C]" : "bg-slate-100"}`}>
                                <img
                                    src={selectedActivity.images[galleryIndex].url}
                                    alt=""
                                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-3xl"
                                />
                                <img
                                    src={selectedActivity.images[galleryIndex].url}
                                    alt={`${selectedActivity.title} image ${galleryIndex + 1}`}
                                    className="relative z-10 max-h-[65vh] max-w-full rounded-xl object-contain shadow-2xl"
                                />
                                <button
                                    type="button"
                                    onClick={closeActivity}
                                    className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900/75 text-white backdrop-blur-md transition hover:scale-105 hover:bg-slate-700"
                                    aria-label="Close modal"
                                >
                                    <X size={19} />
                                </button>
                                {galleryIndex > 0 && (
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-3 text-white backdrop-blur-md transition hover:scale-105"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                )}
                                {galleryIndex < selectedActivity.images.length - 1 && (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/50 p-3 text-white backdrop-blur-md transition hover:scale-105"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                )}
                            </div>

                            <div className="flex w-full flex-col p-6 sm:p-8 md:w-96">
                                <p className={`text-xs font-bold uppercase tracking-[0.22em] ${theme ? "text-blue-400" : "text-red-600"}`}>
                                    Gurukul Highlights
                                </p>
                                <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
                                    {selectedActivity.title}
                                </h2>
                                <p className={`mt-2 text-xs font-bold ${theme ? "text-slate-500" : "text-slate-400"}`}>
                                    {selectedActivity.date} · Image {galleryIndex + 1} of {selectedActivity.images.length}
                                </p>
                                <p className={`mt-6 grow whitespace-pre-line text-base leading-8 ${theme ? "text-slate-300" : "text-slate-600"}`}>
                                    {selectedActivity.description || "No description provided."}
                                </p>
                                {selectedActivity.images.length > 1 && (
                                    <div className="mt-6 grid grid-cols-5 gap-2 border-t pt-5">
                                        {selectedActivity.images.map((image, index) => (
                                            <button
                                                key={image.id}
                                                type="button"
                                                onClick={() => setGalleryIndex(index)}
                                                className={`aspect-square overflow-hidden rounded-lg border-2 transition ${
                                                    galleryIndex === index
                                                        ? theme
                                                            ? "border-blue-400"
                                                            : "border-red-500"
                                                        : "border-transparent opacity-60 hover:opacity-100"
                                                }`}
                                                aria-label={`View image ${index + 1}`}
                                            >
                                                <img src={image.url} alt="" className="h-full w-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}