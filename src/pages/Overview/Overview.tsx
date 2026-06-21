import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ThemeToggle from "../../components/theme/ThemeToggle";
import { useTheme } from "../../components/theme/ThemeContext";
import { Link } from "react-router-dom";

import impc from "../../assets/Gurukulimg/vison/impc.jpeg";
import Allmember from "../../assets/Gurukulimg/vison/All-member.jpeg";
import Students from "../../assets/Gurukulimg/Class/Students.jpeg";

const STATIC_DATA = {
  section1: {
    images: [Allmember, impc, Students],
    menuOptions: [
      { id: 1, label: "અમૃતનું આચમન" },
      { id: 2, label: "ડેઈલી દર્શન" },
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
      "અદ્યતન ટેક્નોલોજી દ્વારા પૂરું પાડવામાં આવતું ઑફલાઇન કન્ટેન્ટ મેનેજમેન્ટ, જે ઇન્ટરનેટ વગર પણ વિદ્યાર્થીઓ સુધી શ્રેષ્ઠ શિક્ષણ પહોંચાડે છે.",
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

// 🌟 Reusable mask gradient — image ne bottom taraf gradually fade kare.
// `toColor` decide kare chhe ke mask ni niche j section nu background
// kayu rang dekhashe — etle theme switch thay tyare fade na color pan
// section sathe sync rahe chhe.
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
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const { section1, section2, section3, footer } = STATIC_DATA;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prevIndex) => (prevIndex + 1) % section1.images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [section1.images.length]);

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-white [&::-webkit-scrollbar]:none [-ms-overflow-style:none] scrollbar-none">

      {/* ---------------- SECTION 1: HERO WITH ROTATING IMAGES ---------------- */}
      <section
        className={`h-screen w-full snap-start relative flex flex-col justify-between p-6 overflow-hidden transition-colors duration-500 ${
          theme ? "bg-slate-950" : "bg-white"
        }`}
      >

        <div className="absolute inset-0 z-0" style={maskFade(40)}>
          {section1.images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentImgIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        {/* ટોપ હેડર બાર */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-30 flex justify-between items-center w-full"
        >
          <div className="flex items-center gap-6">
            <ThemeToggle />

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`flex flex-col justify-center items-center gap-1 w-10 h-10 bg-white rounded-xl shadow-md border transition-all active:scale-90 cursor-pointer ${
                  theme ? "border-red-200" : "border-blue-200"
                }`}
              >
                <div className={`h-0.5 w-5 transition-all rounded-2xl ${theme ? "bg-red-600" : "bg-blue-600"} ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <div className={`h-0.5 w-5 transition-all rounded-2xl ${theme ? "bg-red-600" : "bg-blue-600"} ${isMenuOpen ? 'opacity-0' : ''}`} />
                <div className={`h-0.5 w-5 transition-all rounded-2xl ${theme ? "bg-red-600" : "bg-blue-600"} ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </button>

              <div className={`absolute top-12 left-0 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-top-left z-50 ${
                theme ? "border border-red-200" : "border border-blue-200"
              } ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                <div className="flex flex-col p-2 gap-1">
                  {section1.menuOptions.map((option, idx) => (
                    <div key={option.id}>
                      <button className={`w-full flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-colors hover:bg-gray-50 font-bold text-sm ${theme ? "text-red-600" : "text-blue-600"}`}>
                        <span className={`w-2 h-2 rounded-full ${theme ? "bg-red-600" : "bg-blue-600"}`} />
                        {option.label}
                      </button>
                      {idx !== section1.menuOptions.length - 1 && (
                        <div className={`h-px w-full opacity-10 ${theme ? "bg-red-600" : "bg-blue-600"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link to={"/login"} className={`flex items-center justify-center px-4 py-2 bg-white rounded-xl shadow-md border font-bold text-sm transition-all active:scale-90 ${theme ? "border-red-200 text-red-600 hover:bg-red-50/30" : "border-blue-200 text-blue-600 hover:bg-blue-50/30"}`}>
            Login
          </Link>
        </motion.div>

        {/* બોટમ ઇન્ડિકેટર્સ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-3 mt-auto mb-2"
        >
          <div className="flex justify-center gap-2">
            {section1.images.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImgIndex ? (theme ? "w-6 bg-red-500" : "w-6 bg-blue-500") : "w-2 bg-white/40"}`} />
            ))}
          </div>

          <div className="flex flex-col items-center">
            <span className={`text-xs font-bold mb-1 ${theme ? "text-white/80" : "text-slate-900/70"}`}>
              Scroll Down
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className={`w-1 h-4 rounded-full ${theme ? "bg-red-500" : "bg-blue-500"}`}
            />
          </div>
        </motion.div>
      </section>

      {/* ---------------- SECTION 2: TEXT INTRODUCTION ---------------- */}
      <section
        className={`relative h-screen w-full snap-start flex flex-col items-center justify-center text-center px-6 transition-colors duration-500 ${
          theme ? "bg-slate-950" : "bg-white"
        }`}
      >
        <div className="relative z-20">
          <Reveal>
            <h1
              className={`text-4xl md:text-5xl font-black mb-4 tracking-wide transition-colors ${
                theme ? "text-red-600" : "text-blue-600"
              }`}
            >
              {section2.title}
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className={`font-medium max-w-xl leading-relaxed ${theme ? "text-gray-400" : "text-gray-500"}`}>
              {section2.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- SECTION 3: TEXT-ONLY INFO BLOCK ---------------- */}
      <section
        className={`h-screen w-full snap-start relative flex items-center justify-center transition-colors duration-500 ${
          theme ? "bg-slate-950" : "bg-white"
        }`}
      >
        <Reveal
          className={`relative z-10 text-center px-6 max-w-2xl p-6 rounded-3xl shadow-xl border ${
            theme ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-gray-100"
          }`}
        >
          <span className={`text-xs font-black tracking-widest uppercase ${theme ? "text-red-500" : "text-blue-500"}`}>
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

      {/* ---------------- SECTION 4: FOOTER SECTION ---------------- */}
      <section className="h-screen w-full snap-start relative flex flex-col justify-between p-10 bg-slate-950 text-gray-400">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-auto max-w-6xl w-full mx-auto">

          <Reveal className="flex flex-col gap-3">
            <h3 className={`text-2xl font-black ${theme ? "text-red-500" : "text-blue-500"}`}>
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
            <a href={`mailto:${footer.contactEmail}`} className={`text-sm font-bold ${theme ? "text-red-400 hover:text-red-300" : "text-blue-400 hover:text-blue-300"}`}>
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