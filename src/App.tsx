import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";

// Initialize EmailJS
emailjs.init("1EjZd8jxXQmpJJLXB");

// ─── CURSOR ────────────────────────────────────────────────────────────────
function Cursor() {
  const [p, setP] = useState({ x: -100, y: -100 });
  const [big, setBig] = useState(false);

  useEffect(() => {
    const mv = (e: MouseEvent) => setP({ x: e.clientX, y: e.clientY });
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setBig(!!(el.closest("a") || el.closest("button") || el.closest("[data-hover]")));
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseover", over); };
  }, []);

  return (
    <>
      <div
        className="cursor-dot"
        style={{
          top: p.y - (big ? 20 : 6),
          left: p.x - (big ? 20 : 6),
          width: big ? 40 : 12,
          height: big ? 40 : 12,
          background: big ? "transparent" : "#FF0022",
          border: big ? "2px solid #FF0022" : "none",
          transition: "width 0.2s, height 0.2s, top 0.05s, left 0.05s, background 0.2s",
        }}
      />
    </>
  );
}

// ─── MARQUEE ───────────────────────────────────────────────────────────────
function Marquee({ text, reverse = false }: { text: string; reverse?: boolean }) {
  const items = Array(8).fill(text);
  return (
    <div className="overflow-hidden py-3 border-t border-b border-white/10 bg-[#FF0022]">
      <div
        className="marquee-track"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        {items.concat(items).map((t, i) => (
          <span
            key={i}
            className="shrink-0 text-black font-display font-black text-sm tracking-widest uppercase px-8"
          >
            {t} <span className="opacity-50 mx-2">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── NAVBAR ────────────────────────────────────────────────────────────────
function Nav() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const LINKS = [
    { key: "about", label: t("nav.about") },
    { key: "skills", label: t("nav.skills") },
    { key: "works", label: t("nav.works") },
    { key: "experience", label: t("nav.experience") },
    { key: "contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setLangOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        background: scrolled ? "#000" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,0,34,0.3)" : "none",
        transition: "background 0.3s",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display font-black text-2xl text-white tracking-tight leading-none"
        >
          MD<span style={{ color: "#FF0022" }}>.</span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <button
              key={l.key}
              onClick={() => go(l.key)}
              className="font-mono text-xs tracking-[0.18em] uppercase text-white/50 hover:text-white transition-colors duration-150"
            >
              {l.label}
            </button>
          ))}
          <button onClick={() => go("contact")} className="hard-btn text-sm py-2.5 px-6">
            {t("nav.hireMe")}
          </button>
          
          {/* Language Switcher - Hidden by default */}
          <div className="relative ml-4 pl-4 border-l border-white/10">
            <motion.button
              onClick={() => setLangOpen(!langOpen)}
              className="cursor-pointer text-white/50 hover:text-[#FF0022] transition-all duration-200 p-1.5 hover:bg-white/5 rounded-sm flex flex-col items-center justify-center"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              title="Change language"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {/* Outer sphere */}
                <circle cx="12" cy="12" r="11" />
                {/* Horizontal lines */}
                <path d="M1 12h22" strokeWidth="1" />
                <path d="M2 6h20" strokeWidth="1" />
                <path d="M2 18h20" strokeWidth="1" />
                {/* Vertical lines (meridians) */}
                <path d="M12 1v22" strokeWidth="1" />
                <path d="M6 2a11 11 0 0 0 0 20" strokeWidth="1" />
                <path d="M18 2a11 11 0 0 1 0 20" strokeWidth="1" />
                {/* Continents suggestion - simple landmass shapes */}
                <path d="M5 9L7 7L8 9L9 8L10 10" fill="currentColor" opacity="0.4" />
                <path d="M14 7L16 6L17 8L16 10L15 9" fill="currentColor" opacity="0.4" />
              </svg>
              <span className="text-xs font-mono tracking-widest text-white/60 mt-0.5">{i18n.language.toUpperCase()}</span>
            </motion.button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 bg-black border border-white/20 rounded-sm shadow-xl z-50"
                  onClick={() => setLangOpen(false)}
                >
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`block w-full px-4 py-2 text-left font-mono text-xs tracking-widest uppercase transition-colors ${
                      i18n.language === "en" 
                        ? "bg-[#FF0022]/20 text-white border-b border-white/10" 
                        : "text-white/60 hover:text-white hover:bg-white/5 border-b border-white/10"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("fi")}
                    className={`block w-full px-4 py-2 text-left font-mono text-xs tracking-widest uppercase transition-colors ${
                      i18n.language === "fi" 
                        ? "bg-[#FF0022]/20 text-white" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Suomi
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          {/* Language Switcher Mobile - Hidden by default */}
          <div className="relative">
            <motion.button
              onClick={() => setLangOpen(!langOpen)}
              className="cursor-pointer text-white/50 hover:text-[#FF0022] transition-all duration-200 p-1.5 hover:bg-white/5 rounded-sm flex flex-col items-center justify-center"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              title="Change language"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {/* Outer sphere */}
                <circle cx="12" cy="12" r="11" />
                {/* Horizontal lines */}
                <path d="M1 12h22" strokeWidth="1" />
                <path d="M2 6h20" strokeWidth="1" />
                <path d="M2 18h20" strokeWidth="1" />
                {/* Vertical lines (meridians) */}
                <path d="M12 1v22" strokeWidth="1" />
                <path d="M6 2a11 11 0 0 0 0 20" strokeWidth="1" />
                <path d="M18 2a11 11 0 0 1 0 20" strokeWidth="1" />
                {/* Continents suggestion - simple landmass shapes */}
                <path d="M5 9L7 7L8 9L9 8L10 10" fill="currentColor" opacity="0.4" />
                <path d="M14 7L16 6L17 8L16 10L15 9" fill="currentColor" opacity="0.4" />
              </svg>
              <span className="text-xs font-mono tracking-widest text-white/60 -mt-1">{i18n.language.toUpperCase()}</span>
            </motion.button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 bg-black border border-white/20 rounded-sm shadow-xl z-50"
                  onClick={() => setLangOpen(false)}
                >
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`block w-full px-3 py-2 text-left font-mono text-xs tracking-widest uppercase transition-colors ${
                      i18n.language === "en" 
                        ? "bg-[#FF0022]/20 text-white border-b border-white/10" 
                        : "text-white/60 hover:text-white hover:bg-white/5 border-b border-white/10"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage("fi")}
                    className={`block w-full px-3 py-2 text-left font-mono text-xs tracking-widest uppercase transition-colors ${
                      i18n.language === "fi" 
                        ? "bg-[#FF0022]/20 text-white" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    Suomi
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="text-white" onClick={() => setOpen(!open)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {open ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden overflow-hidden bg-black border-t border-white/10"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {LINKS.map((l) => (
                <button key={l.key} onClick={() => go(l.key)} className="font-mono text-xs tracking-widest uppercase text-white/60 text-left">
                  {l.label}
                </button>
              ))}
              <button onClick={() => go("contact")} className="hard-btn py-3 text-center w-fit">
                {t("nav.hireMe")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────
function Hero() {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, -120]);

  return (
    <section
      id="home"
      className="relative min-h-screen bg-black overflow-hidden flex flex-col justify-center"
    >
      {/* Red vertical accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0, bottom: 0, left: 48,
          width: 3,
          background: "#FF0022",
          opacity: 0.5,
        }}
      />

      {/* Big diagonal label */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: -60,
          transform: "rotate(90deg)",
          fontFamily: "'JetBrains Mono'",
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "rgba(255,255,255,0.15)",
          whiteSpace: "nowrap",
          textTransform: "uppercase",
        }}
      >
        UI/UX Designer — Helsinki, Finland — 2024
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-32 pb-24 w-full">
        <motion.div style={{ y: yParallax }}>
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8"
          >
            <span className="tag">{t("hero.tag")}</span>
          </motion.div>

          {/* Giant heading */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black leading-none text-white"
              style={{ fontSize: "clamp(72px, 14vw, 180px)", lineHeight: 0.9 }}
            >
              {t("hero.firstName")}
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black italic leading-none outline-text-red"
              style={{ fontSize: "clamp(72px, 14vw, 180px)", lineHeight: 0.9 }}
            >
              {t("hero.lastName")}
            </motion.h1>
          </div>

          {/* Sub row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col md:flex-row md:items-end gap-8 mt-8"
          >
            <div className="flex-1">
              <p className="font-body text-white/40 text-sm max-w-sm leading-relaxed">
                {t("hero.description")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => document.getElementById("works")?.scrollIntoView({ behavior: "smooth" })}
                className="hard-btn"
              >
                {t("hero.viewWorks")}
              </button>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="ghost-btn"
              >
                {t("hero.getInTouch")}
              </button>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="flex gap-12 mt-16 pt-8 border-t border-white/10"
          >
            {[["30+", t("hero.projectsDelivered")], ["3+", t("hero.yearsExperience")], ["100%", t("hero.clientSatisfaction")]].map(([num, label]) => (
              <div key={label}>
                <div className="font-display font-black text-4xl text-white" style={{ lineHeight: 1 }}>
                  {num}
                </div>
                <div className="font-mono text-xs text-white/30 tracking-widest uppercase mt-1">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom red slash */}
      <div className="slash-divider" />
    </section>
  );
}

// ─── MARQUEE BAND ──────────────────────────────────────────────────────────
// ─── ABOUT ─────────────────────────────────────────────────────────────────
function About() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="bg-black py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-16 items-start"
        >
          {/* Left */}
          <div>
            <span className="tag mb-8 inline-block">{t("about.tag")}</span>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black text-white leading-none"
                style={{ fontSize: "clamp(52px, 8vw, 100px)", lineHeight: 0.92 }}
              >
                {t("about.heading1")}<br />
                <span className="outline-text">{t("about.heading2")}</span><br />
                {t("about.heading3")}
              </motion.h2>
            </div>

            <p className="font-body text-white/40 text-sm leading-relaxed mt-8 max-w-md">
              {t("about.description1")}
            </p>
            <p className="font-body text-white/40 text-sm leading-relaxed mt-4 max-w-md">
              {t("about.description2")}
            </p>

            <button
              onClick={() => window.open("/portfolio.v1.2/resume.html", "_blank")}
              className="hard-btn mt-10 flex items-center gap-3"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              {t("about.downloadResume")}
            </button>
          </div>

          {/* Right — details */}
          <div className="flex flex-col gap-0 border-t border-white/10 mt-4 md:mt-16">
            {[
              ["fullName", "fullNameValue"],
              ["location", "locationValue"],
              ["email", "emailValue"],
              ["phone", "phoneValue"],
              ["status", "statusValue"],
            ].map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                className="flex items-center justify-between py-4 border-b border-white/10"
              >
                <span className="font-mono text-xs text-white/30 tracking-widest uppercase">{t(`about.${k}`)}</span>
                <span className="font-body text-sm text-white">{t(`about.${v}`)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── SKILLS ────────────────────────────────────────────────────────────────
function SkillBar({ label, pct, delay = 0 }: { label: string; pct: number; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-display font-bold text-white tracking-wide uppercase text-sm">{label}</span>
        <span className="font-mono text-xs text-[#FF0022]">{pct}%</span>
      </div>
      <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.1)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.1, delay, ease: "easeOut" }}
          className="h-px"
          style={{ background: "#FF0022" }}
        />
      </div>
    </div>
  );
}

const TOOLS = [
  "Figma — 98%", "Adobe XD — 92%", "Photoshop — 85%",
  "Illustrator — 80%", "Tailwind CSS — 88%", "Motion / React — 82%",
];

function Skills() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="bg-[#0a0a0a] py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row gap-2 md:items-end justify-between mb-16">
          <div>
            <span className="tag mb-4 inline-block">{t("skills.tag")}</span>
            <h2
              className="font-display font-black text-white leading-none"
              style={{ fontSize: "clamp(48px, 7vw, 90px)", lineHeight: 0.92 }}
            >
              {t("skills.heading1")}<br />
              <span style={{ color: "#FF0022" }}>{t("skills.heading2")}</span>
            </h2>
          </div>
          <p className="font-body text-white/30 text-sm max-w-xs leading-relaxed">
            {t("skills.subtitle")}
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 gap-20">
          <div>
            <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-8">{t("skills.coreCompetencies")}</p>
            <SkillBar label={t("skills.uiDesign")} pct={95} delay={0.1} />
            <SkillBar label={t("skills.uxResearch")} pct={90} delay={0.2} />
            <SkillBar label={t("skills.wireframing")} pct={95} delay={0.3} />
            <SkillBar label={t("skills.prototyping")} pct={88} delay={0.4} />
          </div>

          <div>
            <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-8">{t("skills.toolStack")}</p>
            <div className="grid grid-cols-1 gap-0 border-t border-white/10">
              {TOOLS.map((t, i) => {
                const [tool, pct] = t.split(" — ");
                return (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                    data-hover="true"
                    className="flex items-center justify-between py-4 border-b border-white/10 group cursor-default"
                    style={{ transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,0,34,0.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span className="font-display font-bold text-white uppercase tracking-wide text-sm group-hover:text-[#FF0022] transition-colors">
                      {tool}
                    </span>
                    <span className="font-mono text-xs text-white/30">{pct}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── WORKS ─────────────────────────────────────────────────────────────────
const CATS = ["ALL", "WEB APPS", "MOBILE", "DASHBOARDS", "SYSTEMS"];
const PROJECTS = [
  { title: "ASAP AUTOHOULTO CAR REPAIR", cat: "WEB APPS", desc: "Professional car repair service landing page with contact form and service showcase.", num: "01", img: "/images/asap-autohuolto.png", link: "https://asapautohuolto.fi/" },
  { title: "LOTTADHIF PORTFOLIO", cat: "WEB APPS", desc: "Online portfolio and CV for veterinary professional showcasing qualifications, experience, and professional services.", num: "02", img: "https://s3-figma-hubfile-images-production-cdn-cgi.figma.com/cdn-cgi/image/format=auto,quality=85/hub/file/carousel/img/47cb162520a5cb6c736e65362526ab9b55082f74/e73c5cc3ec9ce4c8d6e28652542b6875753a226b", link: "https://www.lottadhif.online/" },
  { title: "AXA BARBER SHOP", cat: "WEB APPS", desc: "Full-stack barber booking platform with appointment dashboard, email notifications, and client management system.", num: "03", img: "https://www.sliderrevolution.com/wp-content/uploads/2021/09/Bardo.jpg", link: "https://www.axabarbershop.fi/" },
];

function ProjectCard({ p, i }: { p: typeof PROJECTS[0]; i: number }) {
  const { t } = useTranslation();
  const [hov, setHov] = useState(false);
  
  // Map project numbers to translation keys
  const descKey = p.num === "01" ? "asap" : p.num === "02" ? "lottadhif" : "axa";
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      data-hover="true"
      className={`relative overflow-hidden group ${p.link ? "cursor-pointer" : "cursor-default"}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => p.link && window.open(p.link, "_blank")}
      style={{ border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* image */}
      <div className="relative overflow-hidden" style={{ height: 240 }}>
        <motion.img
          src={p.img}
          alt={p.title}
          className="w-full h-full object-cover"
          animate={{ scale: hov ? 1.07 : 1 }}
          transition={{ duration: 0.5 }}
        />
        {/* Overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: hov ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "rgba(255,0,34,0.85)" }}
        >
          <span className="font-display font-black text-black text-lg tracking-widest uppercase">
            {t("works.viewProject")}
          </span>
        </motion.div>
        {/* Number */}
        <span
          className="absolute top-3 left-3 font-mono text-xs text-white/40"
          style={{ background: "#000", padding: "3px 8px" }}
        >
          {p.num}
        </span>
      </div>
      {/* Info */}
      <div className="p-5" style={{ background: "#0a0a0a" }}>
        <h3 className="font-display font-black text-white text-xl tracking-wide mb-1">{p.title}</h3>
        <p className="font-body text-white/35 text-xs leading-relaxed">{t(`works.projects.${descKey}`)}</p>
      </div>
    </motion.div>
  );
}

function Works() {
  const { t } = useTranslation();
  const [active, setActive] = useState("ALL");
  const filtered = active === "ALL" ? PROJECTS : PROJECTS.filter((p) => p.cat === active);

  return (
    <section id="works" className="bg-black py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row gap-4 md:items-end justify-between mb-12">
          <div>
            <span className="tag mb-4 inline-block">{t("works.tag")}</span>
            <h2
              className="font-display font-black text-white leading-none"
              style={{ fontSize: "clamp(48px, 7vw, 90px)", lineHeight: 0.92 }}
            >
              {t("works.heading1")}<br />
              <span className="outline-text">{t("works.heading2")}</span>
            </h2>
          </div>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-0 mb-12 border border-white/10">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className="font-mono text-xs tracking-widest uppercase px-5 py-3 transition-all"
              style={{
                background: active === c ? "#FF0022" : "transparent",
                color: active === c ? "#fff" : "rgba(255,255,255,0.35)",
                borderRight: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <div key={p.title} style={{ background: "#000" }}>
                <ProjectCard p={p} i={i} />
              </div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

// ─── GITHUB PROJECTS ──────────────────────────────────────────────────────────

function GitHubProjects() {
  const { t } = useTranslation();
  return (
    <section className="bg-black py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="tag mb-6 inline-block">{t("github.tag")}</span>
          <h2
            className="font-display font-black text-white leading-none mb-8"
            style={{ fontSize: "clamp(48px, 7vw, 90px)", lineHeight: 0.92 }}
          >
            {t("github.heading1")}<br />
            <span className="outline-text">{t("github.heading2")}</span>
          </h2>
          <p className="text-white/60 max-w-lg mb-12 text-lg">
            {t("github.description")}
          </p>
          <motion.a
            href="https://github.com/Dhif216"
            target="_blank"
            rel="noopener noreferrer"
            className="hard-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("github.visitGithub")}
          </motion.a>
        </div>
      </div>
    </section>
  );
}

// ─── MARQUEE BAND ──────────────────────────────────────────────────────────

// ─── EXPERIENCE ────────────────────────────────────────────────────────────
const EXP = [
  { year: "November 2024 – PRESENT", role: "Freelance UX/UI Designer", org: "Freelancer, Finland", desc: "Designing and developing custom web applications and digital solutions for clients. Creating wireframes, prototypes, and high-fidelity mockups in Figma. Conducting user research and usability testing to inform design decisions. Collaborating with clients to understand requirements and deliver tailored UX/UI solutions. Building responsive websites and booking platforms with focus on user experience." },
  { year: "October 2024 – PRESENT", role: "Logistics Coordinator", org: "Sol henkilöstöpalvelut, Finland", desc: "Coordinating warehouse management and logistics operations. Monitoring and optimizing inventory to improve efficiency. Ensuring communication between warehouse staff and delivery teams. Processing logistics documentation and entering data into the system. Developing workflow and improving efficiency in collaboration with the team." },
  { year: "March 2022 – December 2023", role: "Digital Security Specialist", org: "Thales Oy, Finland", desc: "Assessing information security risks and identifying system vulnerabilities. Designing and implementing security solutions, such as encryption and access control. Monitoring security logs and identifying threats. Responding to security incidents and conducting forensic investigations. Developing security policies and monitoring compliance." },
  { year: "May 2010 – 2012", role: "IT Support Specialist", org: "Sigma Conseil, Tunisia", desc: "Providing software support to customers via phone and email. Resolving software installation, configuration, and connectivity issues. Delivering excellent customer service and technical solutions." },
  { year: "June 2008 – 2010", role: "Receptionist", org: "Hexabyte, Tunisia", desc: "Receiving and assisting visitors with inquiries. Managing appointments and maintaining information systems. Providing excellent customer service and improving customer satisfaction." },
];

function Experience() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Map job index to translation key
  const jobKeys = ["freelance", "logistics", "security", "itsupport", "receptionist"];

  return (
    <section id="experience" className="bg-[#0a0a0a] py-32 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <span className="tag mb-8 inline-block">{t("experience.tag")}</span>
        <h2
          className="font-display font-black text-white leading-none mb-20"
          style={{ fontSize: "clamp(48px, 7vw, 90px)", lineHeight: 0.92 }}
        >
          {t("experience.heading1")}<br />
          <span style={{ color: "#FF0022" }}>{t("experience.heading2")}</span>
        </h2>

        <div ref={ref} className="relative pl-0">
          {EXP.map((e, i) => (
            <motion.div
              key={e.year}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.15 }}
              className="grid md:grid-cols-3 gap-6 mb-0 py-10 border-b border-white/10"
            >
              <div>
                <span className="font-mono text-xs text-[#FF0022] tracking-widest">{e.year}</span>
              </div>
              <div>
                <h3 className="font-display font-black text-white text-2xl tracking-wide uppercase mb-1">{e.role}</h3>
                <p className="font-mono text-xs text-white/30 tracking-widest">{e.org}</p>
              </div>
              <div>
                <p className="font-body text-sm text-white/40 leading-relaxed">{t(`experience.jobs.${jobKeys[i]}`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ─── CONTACT ───────────────────────────────────────────────────────────────
const PROJECT_CATS = ["Web App Design", "Mobile App UI", "Dashboard", "Design System", "Brand Identity", "Other"];
const BUDGETS = ["< €1,000", "€1,000 – €5,000", "€5,000 – €15,000", "€15,000+", "Let's discuss"];

function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", category: "", budget: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Send email to you
      await emailjs.send(
        "service_3vaphx4",
        "template_22xds5o",
        {
          user_name: form.name,
          user_email: form.email,
          subject: form.category,
          message_content: form.message,
          from_name: form.name,
          reply_to: form.email,
          to_email: "dhif_mouadh@hotmail.fr",
        }
      );

      // Send auto-reply to user
      await emailjs.send(
        "service_3vaphx4",
        "template_ug68729",
        {
          user_name: form.name,
          client_email: form.email,
        }
      );

      setStatus("sent");
      setForm({ name: "", email: "", category: "", budget: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Email failed to send:", error);
      setStatus("idle");
      alert("Failed to send message. Please try again.");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    padding: "12px 0",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <section id="contact" className="bg-[#0a0a0a] py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <span className="tag mb-8 inline-block">{t("contact.tag")}</span>
        <div className="grid md:grid-cols-2 gap-20 items-start">
          <div>
            <h2
              className="font-display font-black text-white leading-none mb-10"
              style={{ fontSize: "clamp(52px, 8vw, 110px)", lineHeight: 0.88 }}
            >
              {t("contact.heading1")}<br />
              <span style={{ color: "#FF0022" }}>{t("contact.heading2")}</span>
            </h2>
            {/* Contact details */}
            <div ref={ref} className="border-t border-white/10">
              {[
                ["📞 Phone", "+358 44970 314 9"],
                ["📧 Email", "dhif_mouadh@hotmail.fr"],
                ["📍 Location", "Helsinki, Finland"],
                ["🌐 Website", "www.mouadhdhif.com"],
              ].map(([k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="flex items-center justify-between py-4 border-b border-white/10"
                >
                  <span className="font-mono text-xs text-white/30 tracking-widest">{k}</span>
                  <span className="font-body text-sm text-white/70">{v}</span>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              {["LinkedIn", "Behance", "Figma"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="font-mono text-xs tracking-widest uppercase text-white/30 hover:text-[#FF0022] transition-colors border border-white/10 hover:border-[#FF0022] px-4 py-2"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={submit}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <input required placeholder={t("contact.nameInput")} style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} onFocus={(e) => (e.target.style.borderColor = "#FF0022")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")} />
              <input required type="email" placeholder={t("contact.emailInput")} style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onFocus={(e) => (e.target.style.borderColor = "#FF0022")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <select style={{ ...inputStyle, color: form.category ? "#fff" : "rgba(255,255,255,0.3)" }} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="" style={{ background: "#0a0a0a" }}>{t("contact.categoryInput")}</option>
                {PROJECT_CATS.map((c) => <option key={c} style={{ background: "#0a0a0a" }}>{c}</option>)}
              </select>
              <select style={{ ...inputStyle, color: form.budget ? "#fff" : "rgba(255,255,255,0.3)" }} value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                <option value="" style={{ background: "#0a0a0a" }}>{t("contact.budgetInput")}</option>
                {BUDGETS.map((b) => <option key={b} style={{ background: "#0a0a0a" }}>{b}</option>)}
              </select>
            </div>
            <textarea required rows={5} placeholder={t("contact.messageInput")} style={{ ...inputStyle, resize: "none" }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} onFocus={(e) => (e.target.style.borderColor = "#FF0022")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")} />

            <motion.button
              type="submit"
              disabled={status !== "idle"}
              whileHover={status === "idle" ? { x: 4 } : {}}
              className="hard-btn self-start flex items-center gap-3 disabled:opacity-50"
            >
              <AnimatePresence mode="wait">
                {status === "idle" && <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{t("contact.submitButton")}</motion.span>}
                {status === "sending" && <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{t("contact.submittingButton")}</motion.span>}
                {status === "sent" && <motion.span key="d" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>{t("contact.sentButton")}</motion.span>}
              </AnimatePresence>
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

// ─── MATRIX RAIN EFFECT ────────────────────────────────────────────────────────────
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    char: string;
    vy: number;
    life: number;
    color: string;
    size: number;
    isSettled: boolean;
  }>>([]);
  const particleIndexRef = useRef(0);

  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01Δ∆λ¤§¶¢ƒ€¥©®™℠°¹²³⁴⁵";
  const colors = ["#FF0022", "#00FF00", "#0088FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FF4400"];

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Spawn particles continuously
    const spawnInterval = setInterval(() => {
      const x = Math.random() * canvas.width;
      const y = -50;
      particlesRef.current.push({
        x,
        y,
        char: chars[Math.floor(Math.random() * chars.length)],
        vy: 1 + Math.random() * 2, // Initial fall speed
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 14 + Math.random() * 6,
        isSettled: false,
      });
    }, 100);

    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        // Physics
        if (!p.isSettled) {
          p.vy += 0.15; // gravity
          p.y += p.vy;

          // Hit the "floor" (near bottom)
          const floorY = canvas.height - 80;
          if (p.y > floorY) {
            p.isSettled = true;
            p.y = floorY;
            p.vy = 0;
          }
        } else {
          // Settled on floor - fade out
          p.life -= 0.015;
        }

        if (p.life > 0) {
          const opacity = Math.max(0, p.life);
          ctx.fillStyle = p.color.slice(0, 7) + Math.floor(opacity * 255).toString(16).padStart(2, "0");
          ctx.font = `bold ${p.size}px 'Courier New', monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.char, p.x, p.y);
          return true;
        }
        return false;
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(spawnInterval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full absolute inset-0"
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute inset-0"
        style={{ background: "transparent", display: "block" }}
      />
    </div>
  );
}

// ─── INTERACTIVE PARTICLES ────────────────────────────────────────────────────────────
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 300 + 50,
            height: Math.random() * 300 + 50,
            background: `radial-gradient(circle, rgba(255,0,34,${0.05 + Math.random() * 0.1}) 0%, transparent 70%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
            scale: [1, 1 + Math.random() * 0.3],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── THANK YOU SECTION (ENHANCED) ────────────────────────────────────────────────────────────
function ThankYou() {
  const [hoveredWord, setHoveredWord] = useState<number | null>(null);
  const words = ["Thank", "You", "for", "visiting"];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="bg-black py-40 border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0">
        <FloatingElements />
        <MatrixRain />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh]">
          {/* Main heading with animated words */}
          <motion.div
            className="mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
              {words.map((word, i) => (
                <motion.div
                  key={i}
                  variants={wordVariants}
                  onMouseEnter={() => setHoveredWord(i)}
                  onMouseLeave={() => setHoveredWord(null)}
                  className="cursor-pointer"
                >
                  <span
                    className="font-display font-black text-white leading-none transition-all duration-300"
                    style={{
                      fontSize: hoveredWord === i ? "clamp(48px, 12vw, 120px)" : "clamp(48px, 10vw, 100px)",
                      color: hoveredWord === i ? "#FF0022" : "#fff",
                      textShadow: hoveredWord === i ? "0 0 20px rgba(255,0,34,0.5)" : "none",
                    }}
                  >
                    {word}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Subtitle with reveal animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-2xl mx-auto mb-12"
          >
            <p className="font-body text-white/50 text-lg leading-relaxed mb-6">
              I've poured my passion into every pixel of this portfolio. Your attention means the world to me.
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-[#FF0022] to-transparent mb-8" />
            <p className="font-mono text-sm text-white/40 tracking-widest">
              LET'S CREATE SOMETHING EXTRAORDINARY TOGETHER
            </p>
          </motion.div>

          {/* Interactive CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.a
              href="#contact"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="hard-btn relative group overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span className="relative z-10">
                Start A Project ✦
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-white/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-20 grid grid-cols-3 gap-8 w-full"
          >
            {[
              { num: "30+", label: "Projects" },
              { num: "3+", label: "Years" },
              { num: "100%", label: "Dedication" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="border border-white/10 py-6 px-4 hover:border-[#FF0022] transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="font-display font-black text-[#FF0022] text-2xl mb-2">{stat.num}</div>
                <div className="font-mono text-xs text-white/40 tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  const { t } = useTranslation();
  
  const LINKS = [
    { key: "about", label: t("nav.about") },
    { key: "skills", label: t("nav.skills") },
    { key: "works", label: t("nav.works") },
    { key: "experience", label: t("nav.experience") },
    { key: "contact", label: t("nav.contact") },
  ];

  return (
    <footer style={{ background: "#000", borderTop: "1px solid rgba(255,0,34,0.2)" }}>
      <Marquee text="UI/UX DESIGN — PRODUCT STRATEGY — FIGMA — INTERACTION DESIGN — HELSINKI" />
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="font-display font-black text-2xl text-white cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          MD<span style={{ color: "#FF0022" }}>.</span>
        </span>
        <div className="flex flex-wrap justify-center gap-8">
          {LINKS.map((l) => (
            <button key={l.key} onClick={() => document.getElementById(l.key.toLowerCase())?.scrollIntoView({ behavior: "smooth" })} className="font-mono text-xs tracking-widest uppercase text-white/25 hover:text-white/70 transition-colors">
              {l.label}
            </button>
          ))}
        </div>
        <p className="font-mono text-xs text-white/20">
          © 2026 — Mouadh Dhif
        </p>
      </div>
    </footer>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const { t } = useTranslation();
  return (
    <>
      <div className="noise" />
      <Cursor />
      <Nav />
      <Hero />
      <Marquee text={t("marquee.marquee1")} reverse />
      <About />
      <Skills />
      <Works />
      <GitHubProjects />
      <Marquee text={t("marquee.marquee2")} />
      <Experience />
      <Contact />
      <ThankYou />
      <Footer />
    </>
  );
}
