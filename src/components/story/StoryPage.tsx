import { Fragment, useEffect, useMemo, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Beaker,
  Brain,
  CheckCircle2,
  ChevronRight,
  Database,
  FileWarning,
  FlaskConical,
  GitBranch,
  HeartPulse,
  LineChart as LineChartIcon,
  ListChecks,
  Quote,
  Sparkles,
  Stethoscope,
  TrendingUp,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Slider } from "@/components/ui/slider";

// ---------- Data ----------
const CHAPTERS = [
  { id: "about", label: "About Dataset" },
  { id: "raw", label: "Raw Data" },
  { id: "cleaning", label: "Data Cleaning" },
  { id: "missing", label: "Missing Values" },
  { id: "removed", label: "Removed Features" },
  { id: "eda", label: "Exploratory Analysis" },
  { id: "accepted", label: "Accepted Findings" },
  { id: "rejected", label: "Rejected Findings" },
  { id: "correlation", label: "Correlation Matrix" },
  { id: "summary", label: "Executive Summary" },
  { id: "recommendations", label: "Recommendations" },
  { id: "simulation", label: "Interactive Simulation" },
  { id: "ml", label: "Future Machine Learning" },
];

const AGE_DATA = [
  { age: "0–10", patients: 161 },
  { age: "10–20", patients: 691 },
  { age: "20–30", patients: 1657 },
  { age: "30–40", patients: 3775 },
  { age: "40–50", patients: 9685 },
  { age: "50–60", patients: 17256 },
  { age: "60–70", patients: 22483 },
  { age: "70–80", patients: 26068 },
  { age: "80–90", patients: 17197 },
  { age: "90–100", patients: 2793 },
];

const STAY_DATA = [
  { days: "1", patients: 14208 },
  { days: "2", patients: 17224 },
  { days: "3", patients: 17756 },
  { days: "4", patients: 13924 },
  { days: "5", patients: 9966 },
  { days: "6", patients: 7539 },
  { days: "7", patients: 5859 },
  { days: "8", patients: 4391 },
  { days: "9", patients: 3002 },
  { days: "10+", patients: 7897 },
];

const MEDS_DATA = [
  { meds: "1–5", patients: 9842 },
  { meds: "6–10", patients: 27355 },
  { meds: "11–15", patients: 30412 },
  { meds: "16–20", patients: 19874 },
  { meds: "21–25", patients: 9421 },
  { meds: "26+", patients: 4862 },
];

const DIAG_DATA = [
  { dx: "1", patients: 5210 },
  { dx: "3", patients: 7841 },
  { dx: "5", patients: 11320 },
  { dx: "7", patients: 24102 },
  { dx: "9", patients: 41203 },
  { dx: "11+", patients: 12090 },
];

const PREV_ADMIT = [
  { x: "0", rate: 8.4 },
  { x: "1", rate: 12.9 },
  { x: "2", rate: 16.5 },
  { x: "3", rate: 20.3 },
  { x: "4", rate: 25.7 },
  { x: "5+", rate: 31.4 },
];
const DIAG_RATE = [
  { x: "1", rate: 5.9 },
  { x: "3", rate: 7.4 },
  { x: "5", rate: 9.1 },
  { x: "7", rate: 12.0 },
  { x: "9", rate: 15.1 },
  { x: "10+", rate: 17.6 },
];
const MED_RATE = [
  { x: "5", rate: 7.4 },
  { x: "10", rate: 10.0 },
  { x: "15", rate: 11.7 },
  { x: "20", rate: 13.1 },
];
const STAY_RATE = [
  { x: "1", rate: 8.2 },
  { x: "4", rate: 11.8 },
  { x: "8", rate: 14.2 },
  { x: "10+", rate: 14.3 },
];

const CORR_FEATURES = [
  "Prev. Admissions",
  "# Diagnoses",
  "# Medications",
  "Length of Stay",
  "Age",
  "Readmitted",
];
const CORR_MATRIX = [
  [1.0, 0.34, 0.21, 0.19, 0.05, 0.31],
  [0.34, 1.0, 0.47, 0.35, 0.07, 0.27],
  [0.21, 0.47, 1.0, 0.42, 0.04, 0.18],
  [0.19, 0.35, 0.42, 1.0, 0.09, 0.16],
  [0.05, 0.07, 0.04, 0.09, 1.0, 0.03],
  [0.31, 0.27, 0.18, 0.16, 0.03, 1.0],
];

// ---------- Helpers ----------
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 py-20 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="mb-12 max-w-3xl"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {eyebrow}
        </div>
        <h2 className="font-display text-balance text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.025em] text-foreground md:text-[3.25rem] md:leading-[1.08]">
          {title}
        </h2>
        {intro && (
          <p className="mt-6 max-w-[62ch] text-balance text-[1.15rem] leading-[1.7] text-muted-foreground md:text-[1.25rem] md:leading-[1.65]">
            {intro}
          </p>
        )}
      </motion.div>
      {children}
    </section>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent = "primary",
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "primary" | "success" | "warning" | "danger";
}) {
  const ring =
    accent === "success"
      ? "from-[color:var(--success)]/30"
      : accent === "warning"
        ? "from-[color:var(--warning)]/30"
        : accent === "danger"
          ? "from-[color:var(--danger)]/30"
          : "from-primary/30";
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative overflow-hidden rounded-[20px] border border-border bg-card p-6 shadow-[0_1px_2px_rgba(46,42,38,0.04),0_8px_24px_-12px_rgba(46,42,38,0.08)]"
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${ring} to-transparent blur-2xl`}
      />
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-3 font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        {value}
      </div>
      {hint && <div className="mt-2 text-sm text-muted-foreground">{hint}</div>}
    </motion.div>
  );
}

const tooltipStyle = {
  background: "#FFFDF9",
  border: "1px solid #E8DED1",
  borderRadius: 12,
  color: "#2E2A26",
  fontSize: 12,
  padding: "10px 14px",
  boxShadow: "0 12px 32px -16px rgba(46,42,38,0.18)",
  fontFamily: "Inter, system-ui, sans-serif",
};

function ChartCard({
  title,
  observation,
  children,
}: {
  title: string;
  observation: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-[20px] border border-border bg-card p-6 md:p-8"
    >
      <div className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Chart
      </div>
      <h3 className="font-display text-2xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-prose text-sm text-muted-foreground">{observation}</p>
      <div className="mt-6 h-[280px] w-full">{children}</div>
    </motion.div>
  );
}

// ---------- Sidebar ----------
function Sidebar({ active }: { active: string }) {
  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-64 shrink-0 overflow-y-auto pr-4 lg:block">
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Chapters
      </div>
      <nav className="mt-4 space-y-1">
        {CHAPTERS.map((c, i) => {
          const isActive = active === c.id;
          return (
            <a
              key={c.id}
              href={`#${c.id}`}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] tabular-nums ${
                  isActive
                    ? "border-primary/50 bg-primary/20 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="truncate">{c.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

// ---------- Page ----------
export default function StoryPage() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const progressX = useTransform(progress, (v) => `${v * 100}%`);

  const [active, setActive] = useState<string>("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive((visible[0].target as HTMLElement).id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    CHAPTERS.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Simulation state
  const [prev, setPrev] = useState(1);
  const [meds, setMeds] = useState(12);
  const [stay, setStay] = useState(4);
  const [dx, setDx] = useState(7);

  const risk = useMemo(() => {
    // Weighted score, clamped 0..100
    const score =
      6 +
      prev * 4.6 +
      Math.max(0, meds - 5) * 0.55 +
      Math.max(0, stay - 2) * 0.95 +
      Math.max(0, dx - 3) * 1.25;
    return Math.max(3, Math.min(95, +score.toFixed(1)));
  }, [prev, meds, stay, dx]);

  const riskLabel =
    risk < 10 ? "LOW" : risk < 18 ? "MEDIUM" : risk < 28 ? "HIGH" : "VERY HIGH";
  const riskColor =
    risk < 10
      ? "var(--success)"
      : risk < 18
        ? "var(--warning)"
        : risk < 28
          ? "#C49A6C"
          : "var(--danger)";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Scroll progress */}
      <motion.div
        style={{ width: progressX }}
        className="fixed left-0 top-0 z-50 h-[2px] bg-gradient-to-r from-primary via-accent to-primary"
      />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium tracking-tight">Readmit / Study</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#about" className="hover:text-foreground">Article</a>
            <a href="#simulation" className="hover:text-foreground">Simulation</a>
            <a href="#ml" className="hover:text-foreground">Roadmap</a>
          </nav>
          <a
            href="#about"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-transform hover:scale-[1.02]"
          >
            Read study <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
          <div className="absolute right-[-10%] top-[20%] h-[420px] w-[420px] rounded-full bg-accent/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            A long-form data story · 12 min read
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="font-display mt-6 max-w-4xl text-balance text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[5rem] md:leading-[1.02]"
          >
            Hospital Readmission Analysis
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-7 max-w-[60ch] text-balance text-[1.2rem] leading-[1.7] text-muted-foreground md:text-[1.35rem] md:leading-[1.6]"
          >
            Analyzing <span className="text-foreground">101,766 diabetic patient records</span> to
            understand what actually drives 30-day hospital readmission — and what hospitals
            should do about it.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.08, delayChildren: 0.25 }}
            className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            <StatCard label="Total Patients" value="101,766" hint="diabetic encounters" />
            <StatCard label="Readmission Rate" value="11.16%" hint="within 30 days" accent="warning" />
            <StatCard label="Avg. Length of Stay" value="4.4 days" accent="success" />
            <StatCard label="Avg. Diagnoses" value="7.42" hint="per patient" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center gap-3"
          >
            <a
              href="#about"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-[0_10px_40px_-10px_rgba(166,124,82,0.25)] transition-transform hover:scale-[1.02]"
            >
              Explore Analysis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#simulation"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-3 text-sm font-medium text-foreground hover:bg-card"
            >
              Try the simulator
            </a>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto flex max-w-7xl gap-10 px-6">
        <Sidebar active={active} />
        <main className="min-w-0 flex-1 pb-32">
          {/* About */}
          <Section
            id="about"
            eyebrow="01 · About the dataset"
            title="A decade of diabetic hospital encounters, in one file."
            intro="The dataset captures 101,766 patient encounters across 130 US hospitals over 10 years. Our north star: predict whether a patient returns within 30 days."
          >
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.08 }}
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            >
              {[
                { icon: Database, t: "Dataset", v: "101,766 patients", d: "Diabetic encounters across 130 hospitals." },
                { icon: Stethoscope, t: "Objective", v: "Predict 30-day risk", d: "Find drivers of early readmission." },
                { icon: TrendingUp, t: "Target Variable", v: "readmitted", d: "<30, >30, NO — modeled as binary." },
                { icon: FileWarning, t: "Why it matters", v: "Cost & care", d: "Early returns are expensive and avoidable." },
              ].map((c) => (
                <motion.div
                  key={c.t}
                  variants={fadeUp}
                  whileHover={{ y: -3 }}
                  className="rounded-[20px] border border-border bg-card p-6"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {c.t}
                  </div>
                  <div className="mt-1 font-display text-xl font-semibold">{c.v}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-10 rounded-[20px] border border-border bg-card p-8">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Problem Statement
              </div>
              <p className="mt-3 font-display text-2xl leading-snug text-foreground md:text-3xl">
                Hospitals incur significant costs when patients return within 30 days.
                Reducing that rate — even slightly — has outsized financial and clinical impact.
              </p>
            </div>
          </Section>

          {/* Raw data */}
          <Section
            id="raw"
            eyebrow="02 · Raw data"
            title="Real-world data is messy. This one was no exception."
            intro="Missing values came disguised as five different things. Before we could analyze, we had to teach the data to be honest."
          >
            <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
              <RawCard
                title="Raw dataset"
                tone="danger"
                rows={[
                  ["weight", "?"],
                  ["medical_specialty", "Unknown"],
                  ["race", "?"],
                  ["payer_code", "NA"],
                  ["max_glu_serum", "None"],
                  ["A1Cresult", " "],
                ]}
              />
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="hidden h-14 w-14 place-items-center rounded-full border border-border bg-card text-primary md:grid"
                >
                  <ArrowRight className="h-6 w-6" />
                </motion.div>
              </div>
              <RawCard
                title="Clean dataset"
                tone="success"
                rows={[
                  ["weight", "NaN"],
                  ["medical_specialty", "NaN"],
                  ["race", "NaN"],
                  ["payer_code", "NaN"],
                  ["max_glu_serum", "NaN"],
                  ["A1Cresult", "NaN"],
                ]}
              />
            </div>
          </Section>

          {/* Cleaning timeline */}
          <Section
            id="cleaning"
            eyebrow="03 · Cleaning"
            title="Six steps from chaos to a model-ready table."
          >
            <ol className="relative ml-3 border-l border-border">
              {[
                { t: "Loaded the dataset", d: "101,766 rows × 50 columns into a single DataFrame." },
                { t: "Inspected columns", d: "Types, ranges, cardinalities — and obvious sentinel values." },
                { t: "Found missing values", d: "Disguised as ?, Unknown, None, NA and blanks." },
                {
                  t: "Standardized to NaN",
                  d: "? → NaN · Unknown → NaN · None → NaN · NA → NaN · '' → NaN",
                },
                { t: "Calculated missing %", d: "Per-column missingness ranked from worst to best." },
                { t: "Removed high-missing columns", d: "Anything above ~35% lost more signal than it carried." },
              ].map((s, i) => (
                <motion.li
                  key={s.t}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="mb-8 ml-6"
                >
                  <span className="absolute -left-3 grid h-6 w-6 place-items-center rounded-full border border-primary/40 bg-background text-[10px] font-medium text-primary">
                    {i + 1}
                  </span>
                  <h4 className="font-display text-xl font-semibold text-foreground">{s.t}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </motion.li>
              ))}
            </ol>
          </Section>

          {/* Missing values quick visual */}
          <Section
            id="missing"
            eyebrow="04 · Missing values"
            title="Where the data simply wasn't there."
            intro="Some columns were nearly empty. We made the call to remove anything above ~35% missing — the rest we kept and imputed where appropriate."
          >
            <div className="rounded-[20px] border border-border bg-card p-6 md:p-8">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { col: "weight", pct: 96 },
                    { col: "max_glu_serum", pct: 94 },
                    { col: "A1Cresult", pct: 83 },
                    { col: "payer_code", pct: 39 },
                    { col: "medical_specialty", pct: 49 },
                    { col: "race", pct: 2 },
                  ]}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="rgba(122,114,105,0.1)" vertical={false} />
                  <XAxis dataKey="col" stroke="#7A7269" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#7A7269" tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(166,124,82,0.08)" }} />
                  <Bar dataKey="pct" radius={[8, 8, 0, 0]}>
                    {[96, 94, 83, 39, 49, 2].map((v, i) => (
                      <Cell key={i} fill={v >= 35 ? "#B5704A" : "#A67C52"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#B5704A]" /> removed
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" /> kept
                </span>
              </div>
            </div>
          </Section>

          {/* Removed features */}
          <Section id="removed" eyebrow="05 · Removed features" title="Four columns that had to go.">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.08 }}
              className="grid gap-4 md:grid-cols-2"
            >
              {[
                { t: "Weight", pct: 96, reason: "Insufficient data — only 4% of rows had values." },
                { t: "Max Glucose Serum", pct: 94, reason: "Low availability across the cohort." },
                { t: "A1C Result", pct: 83, reason: "Would introduce noise if imputed." },
                { t: "Payer Code", pct: 39, reason: "Incomplete information; weak signal." },
              ].map((f) => (
                <motion.div
                  key={f.t}
                  variants={fadeUp}
                  whileHover={{ y: -3 }}
                  className="group flex items-center justify-between gap-6 rounded-[20px] border border-border bg-card p-6"
                >
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      Feature
                    </div>
                    <div className="mt-1 font-display text-2xl font-semibold">{f.t}</div>
                    <p className="mt-2 max-w-md text-sm text-muted-foreground">{f.reason}</p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs text-destructive">
                      <XCircle className="h-3.5 w-3.5" /> Removed
                    </div>
                  </div>
                  <div className="relative grid h-24 w-24 shrink-0 place-items-center">
                    <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
                      <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(122,114,105,0.15)" strokeWidth="3" />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        fill="none"
                        stroke="#B5704A"
                        strokeWidth="3"
                        strokeDasharray={`${f.pct}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="text-center">
                      <div className="font-display text-xl font-semibold">{f.pct}%</div>
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        missing
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Section>

          {/* EDA */}
          <Section
            id="eda"
            eyebrow="06 · Exploratory analysis"
            title="The shape of the cohort."
            intro="Before drawing conclusions, we let the data describe itself."
          >
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.1 }}
              className="grid gap-6 md:grid-cols-2"
            >
              <ChartCard
                title="Age distribution"
                observation="Most patients are elderly — the 60–90 brackets dominate."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={AGE_DATA}>
                    <defs>
                      <linearGradient id="ageG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A67C52" stopOpacity={0.55} />
                        <stop offset="100%" stopColor="#A67C52" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(122,114,105,0.1)" vertical={false} />
                    <XAxis dataKey="age" stroke="#7A7269" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#7A7269" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="patients"
                      stroke="#A67C52"
                      strokeWidth={2}
                      fill="url(#ageG)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Length of stay"
                observation="Most stays are short — the average sits at 4.4 days, with a long tail."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={STAY_DATA}>
                    <CartesianGrid stroke="rgba(122,114,105,0.1)" vertical={false} />
                    <XAxis dataKey="days" stroke="#7A7269" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#7A7269" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(107,142,107,0.06)" }} />
                    <Bar dataKey="patients" fill="#6B8E6B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Medication distribution"
                observation="Average medications per patient ≈ 16."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MEDS_DATA}>
                    <CartesianGrid stroke="rgba(122,114,105,0.1)" vertical={false} />
                    <XAxis dataKey="meds" stroke="#7A7269" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#7A7269" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(166,124,82,0.06)" }} />
                    <Bar dataKey="patients" fill="#A67C52" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Diagnoses distribution"
                observation="Most patients carry 7+ diagnoses — disease complexity is the norm."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={DIAG_DATA}>
                    <defs>
                      <linearGradient id="dxG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C49A6C" stopOpacity={0.55} />
                        <stop offset="100%" stopColor="#C49A6C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(122,114,105,0.1)" vertical={false} />
                    <XAxis dataKey="dx" stroke="#7A7269" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#7A7269" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="patients"
                      stroke="#C49A6C"
                      strokeWidth={2}
                      fill="url(#dxG)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </motion.div>
          </Section>

          {/* Accepted findings */}
          <Section
            id="accepted"
            eyebrow="07 · Accepted findings"
            title="Four signals strong enough to act on."
          >
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.08 }}
              className="grid gap-6 lg:grid-cols-2"
            >
              <FindingCard
                title="Previous admissions"
                conclusion="Repeated admissions strongly increase readmission risk."
                stars={5}
                data={PREV_ADMIT}
                color="#6B8E6B"
                metric="prev. admissions"
              />
              <FindingCard
                title="Number of diagnoses"
                conclusion="Disease complexity matters — more dx, higher risk."
                stars={5}
                data={DIAG_RATE}
                color="#A67C52"
                metric="# diagnoses"
              />
              <FindingCard
                title="Medication count"
                conclusion="Medication burden steadily increases risk."
                stars={4}
                data={MED_RATE}
                color="#C49A6C"
                metric="# medications"
              />
              <FindingCard
                title="Length of stay"
                conclusion="Longer stays correlate with higher readmission rates."
                stars={4}
                data={STAY_RATE}
                color="#8B9A8B"
                metric="days in hospital"
              />
            </motion.div>
          </Section>

          {/* Rejected findings */}
          <Section
            id="rejected"
            eyebrow="08 · Rejected findings"
            title="Findings we intentionally rejected."
            intro="Not every chart deserves a conclusion. These looked compelling — and weren't."
          >
            <div className="rounded-[20px] border border-warning/30 bg-warning/[0.06] p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    t: "Emergency visits",
                    r: "Extreme spikes caused by very small sample sizes at the high end.",
                  },
                  {
                    t: "Outpatient visits",
                    r: "A few outliers created misleading percentage swings.",
                  },
                  {
                    t: "Rare medication counts",
                    r: "Too few patients to draw any defensible conclusion.",
                  },
                  {
                    t: "Age 20–30 spike",
                    r: "Population size much smaller than elderly groups — variance, not signal.",
                  },
                ].map((c) => (
                  <motion.div
                    key={c.t}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-warning/25 bg-card/60 p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-warning/15 text-warning">
                        <FileWarning className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-display text-lg font-semibold">{c.t}</div>
                        <p className="mt-1 text-sm text-muted-foreground">{c.r}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 flex items-start gap-4 rounded-2xl border border-border bg-background/40 p-6">
                <Quote className="h-6 w-6 shrink-0 text-warning" />
                <p className="font-display text-xl leading-snug text-foreground md:text-2xl">
                  Good analysts do not force conclusions from weak evidence.
                </p>
              </div>
            </div>
          </Section>

          {/* Correlation matrix */}
          <Section
            id="correlation"
            eyebrow="09 · Correlation matrix"
            title="Relationships between variables, at a glance."
            intro="Correlation shows relationships — it does not prove causation. Read this map as a starting point for questions, not as answers."
          >
            <div className="rounded-[20px] border border-border bg-card p-6 md:p-8">
              <div className="overflow-x-auto">
                <div
                  className="grid gap-1 text-xs"
                  style={{
                    gridTemplateColumns: `160px repeat(${CORR_FEATURES.length}, minmax(72px, 1fr))`,
                  }}
                >
                  <div />
                  {CORR_FEATURES.map((f) => (
                    <div
                      key={f}
                      className="px-2 pb-2 text-center text-[11px] text-muted-foreground"
                    >
                      {f}
                    </div>
                  ))}
                  {CORR_MATRIX.map((row, i) => (
                    <Fragment key={`row-${i}`}>
                      <div className="flex items-center pr-3 text-[11px] text-muted-foreground">
                        {CORR_FEATURES[i]}
                      </div>
                      {row.map((v, j) => {
                        const bg = `rgba(166,124,82,${Math.max(0.06, Math.abs(v))})`;
                        return (
                          <div
                            key={`c-${i}-${j}`}
                            className="grid aspect-square place-items-center rounded-md text-[11px] font-medium tabular-nums text-foreground"
                            style={{ backgroundColor: bg }}
                          >
                            {v.toFixed(2)}
                          </div>
                        );
                      })}
                    </Fragment>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span>weak</span>
                <div className="h-2 flex-1 rounded-full bg-gradient-to-r from-primary/10 to-primary" />
                <span>strong</span>
              </div>
            </div>
          </Section>

          {/* Executive summary */}
          <Section
            id="summary"
            eyebrow="10 · Executive summary"
            title="The headline numbers, and what predicts them."
          >
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ staggerChildren: 0.06 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
            >
              <StatCard label="Total Patients" value="101,766" />
              <StatCard label="Readmission Rate" value="11.16%" accent="warning" />
              <StatCard label="Avg. Stay" value="4.4 days" accent="success" />
              <StatCard label="Avg. Medications" value="16.0" />
              <StatCard label="Avg. Diagnoses" value="7.42" />
            </motion.div>

            <div className="mt-12">
              <h3 className="font-display text-2xl font-semibold">Key drivers, ranked</h3>
              <div className="mt-6 grid gap-3">
                {[
                  { r: 1, t: "Previous admissions", d: "Strongest predictor — by a wide margin.", w: 100, c: "#6B8E6B" },
                  { r: 2, t: "Number of diagnoses", d: "Second strongest — complexity compounds.", w: 78, c: "#A67C52" },
                  { r: 3, t: "Medication count", d: "Moderate, steady impact.", w: 55, c: "#C49A6C" },
                  { r: 4, t: "Length of stay", d: "Moderate — partially a proxy for severity.", w: 42, c: "#8B9A8B" },
                ].map((k) => (
                  <motion.div
                    key={k.r}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: k.r * 0.06 }}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-5 rounded-2xl border border-border bg-card p-5"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-background font-display text-lg font-semibold">
                      #{k.r}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-lg font-semibold">{k.t}</div>
                      <div className="text-sm text-muted-foreground">{k.d}</div>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-background">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${k.w}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: k.c }}
                        />
                      </div>
                    </div>
                    <div className="tabular-nums text-sm text-muted-foreground">{k.w}%</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>

          {/* Recommendations */}
          <Section
            id="recommendations"
            eyebrow="11 · Recommendations"
            title="What hospitals should do with this."
          >
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-[20px] border border-border bg-card p-8">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  For hospitals
                </div>
                <h3 className="mt-2 font-display text-2xl font-semibold">
                  Flag high-risk patients early. Monitor when:
                </h3>
                <ul className="mt-6 space-y-3">
                  {[
                    "Multiple previous admissions in the last year",
                    "Many concurrent diagnoses (≥ 9)",
                    "Heavy medication burden (≥ 15 meds)",
                    "Long hospital stays (≥ 8 days)",
                  ].map((r) => (
                    <li key={r} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span className="text-foreground">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative overflow-hidden rounded-[20px] border border-border bg-card p-8">
                <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-success/20 blur-3xl" />
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Financial impact
                </div>
                <div className="mt-2 font-display text-3xl font-semibold leading-tight">
                  Reducing readmissions by 5% could meaningfully lower hospital costs.
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-background/40 p-5">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Est. avg. cost / readmit
                    </div>
                    <div className="font-display mt-1 text-2xl font-semibold">$15,200</div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/40 p-5">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Annual savings (5%)
                    </div>
                    <div className="font-display mt-1 text-2xl font-semibold text-success">
                      ~$8.6M
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Simulation */}
          <Section
            id="simulation"
            eyebrow="12 · Interactive simulation"
            title="Build a patient. See the risk move."
            intro="A simplified model — for storytelling, not diagnosis."
          >
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
              <div className="rounded-[20px] border border-border bg-card p-8">
                <SliderRow
                  label="Previous admissions"
                  value={prev}
                  min={0}
                  max={8}
                  step={1}
                  onChange={setPrev}
                  suffix=""
                />
                <SliderRow
                  label="Medication count"
                  value={meds}
                  min={1}
                  max={30}
                  step={1}
                  onChange={setMeds}
                />
                <SliderRow
                  label="Length of stay"
                  value={stay}
                  min={1}
                  max={14}
                  step={1}
                  onChange={setStay}
                  suffix=" days"
                />
                <SliderRow
                  label="Number of diagnoses"
                  value={dx}
                  min={1}
                  max={16}
                  step={1}
                  onChange={setDx}
                />
              </div>

              <div className="relative overflow-hidden rounded-[20px] border border-border bg-card p-8">
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl transition-colors"
                  style={{ backgroundColor: `${riskColor}`, opacity: 0.22 }}
                />
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Predicted 30-day risk
                </div>
                <div className="mt-6 grid grid-cols-[auto_1fr] items-center gap-6">
                  <RiskRing value={risk} color={riskColor} />
                  <div>
                    <div
                      className="font-display text-3xl font-semibold"
                      style={{ color: riskColor }}
                    >
                      {riskLabel}
                    </div>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                      Based on the four strongest predictors from the analysis. Move the sliders
                      to see how each factor shifts the score.
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-4 gap-2 text-[10px] uppercase tracking-wide">
                  {["Low", "Medium", "High", "Very High"].map((t, i) => {
                    const colors = ["#6B8E6B", "#C49A6C", "#C49A6C", "#B5704A"];
                    const ranges = [10, 18, 28, 100];
                    const isActive = risk < ranges[i] && (i === 0 || risk >= ranges[i - 1]);
                    return (
                      <div
                        key={t}
                        className={`rounded-lg border px-2 py-2 text-center transition ${
                          isActive ? "border-transparent text-background" : "border-border text-muted-foreground"
                        }`}
                        style={isActive ? { backgroundColor: colors[i] } : {}}
                      >
                        {t}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Section>

          {/* ML Roadmap */}
          <Section
            id="ml"
            eyebrow="13 · Future machine learning"
            title="Coming soon: models we'll layer on top."
          >
            <div className="glass rounded-[20px] p-8">
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  { icon: GitBranch, t: "Logistic Regression", d: "Interpretable baseline — coefficient-level explanations." },
                  { icon: FlaskConical, t: "Random Forest", d: "Captures non-linear interactions between predictors." },
                  { icon: Brain, t: "XGBoost", d: "Gradient boosting for top-end predictive performance." },
                ].map((m) => (
                  <div key={m.t} className="rounded-2xl border border-border bg-card/60 p-6">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                      <m.icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 font-display text-lg font-semibold">{m.t}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{m.d}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Roadmap
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-4">
                  {[
                    { q: "Q1", t: "Feature engineering" },
                    { q: "Q2", t: "Baseline + LR" },
                    { q: "Q3", t: "Tree ensembles" },
                    { q: "Q4", t: "Deployed risk API" },
                  ].map((s, i) => (
                    <div key={s.q} className="relative rounded-2xl border border-border bg-card/60 p-5">
                      <div className="text-xs text-muted-foreground">{s.q}</div>
                      <div className="mt-1 font-display text-base font-semibold">{s.t}</div>
                      {i < 3 && (
                        <ChevronRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground md:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center">
          <div>
            <div className="font-display text-lg font-semibold">Hospital Readmission Analysis</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Created as a complete data storytelling project.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {["Python", "Pandas", "Matplotlib", "Seaborn", "Jupyter", "Lovable", "Recharts", "Framer Motion"].map(
              (t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-card px-2.5 py-1"
                >
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ---------- Sub-components ----------
function RawCard({
  title,
  tone,
  rows,
}: {
  title: string;
  tone: "danger" | "success";
  rows: [string, string][];
}) {
  const accent = tone === "danger" ? "#B5704A" : "#6B8E6B";
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-[20px] border border-border bg-card"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">.csv</span>
      </div>
      <div className="divide-y divide-border">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3 text-sm">
            <span className="truncate text-muted-foreground">{k}</span>
            <span
              className="rounded-md px-2 py-0.5 font-mono text-xs"
              style={{
                color: accent,
                backgroundColor: `${accent}1A`,
              }}
            >
              {v.trim() === "" ? "·" : v}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function FindingCard({
  title,
  conclusion,
  stars,
  data,
  color,
  metric,
}: {
  title: string;
  conclusion: string;
  stars: number;
  data: { x: string; rate: number }[];
  color: string;
  metric: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      className="rounded-[20px] border border-border bg-card p-6 md:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Accepted finding
          </div>
          <h3 className="mt-1 font-display text-2xl font-semibold">{title}</h3>
        </div>
        <div
          className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
          style={{ borderColor: `${color}55`, color, backgroundColor: `${color}14` }}
        >
          {"★".repeat(stars)}
          <span className="text-muted-foreground">{"☆".repeat(5 - stars)}</span>
        </div>
      </div>
      <div className="mt-5 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="rgba(122,114,105,0.1)" vertical={false} />
            <XAxis
              dataKey="x"
              stroke="#7A7269"
              tick={{ fontSize: 11 }}
              label={{ value: metric, position: "insideBottom", offset: -5, fill: "#7A7269", fontSize: 10 }}
            />
            <YAxis stroke="#7A7269" tick={{ fontSize: 11 }} unit="%" />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke={color}
              strokeWidth={2.5}
              dot={{ r: 4, fill: color, stroke: "transparent" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{conclusion}</p>
    </motion.div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  suffix?: string;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-display text-lg font-semibold tabular-nums">
          {value}
          {suffix}
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0]!)}
      />
    </div>
  );
}

function RiskRing({ value, color }: { value: number; color: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(122,114,105,0.15)" strokeWidth="10" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display text-3xl font-semibold tabular-nums">{value}%</div>
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">risk</div>
        </div>
      </div>
    </div>
  );
}