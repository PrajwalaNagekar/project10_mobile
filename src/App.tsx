import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Screen =
  | "splash" | "role" | "login" | "otp"
  | "doc_home" | "doc_opd" | "doc_patient_detail" | "doc_ipd"
  | "doc_prescription" | "doc_video" | "doc_leave" | "doc_notifications"
  | "doc_reports" | "doc_profile"
  | "pat_home" | "pat_find_doctor" | "pat_book_slot" | "pat_appointments"
  | "pat_records" | "pat_lab" | "pat_pharmacy" | "pat_sos" | "pat_video"
  | "pat_vitals" | "pat_billing" | "pat_notifications" | "pat_family" | "pat_profile";

type Role = "doctor" | "patient" | null;

type Theme = {
  mode: "dark" | "light";
  bg: string;
  text: string;
  textSec: string;
  cardBg: string;
  cardBorder: string;
  headerBg: string;
  inputBg: string;
  inputBorder: string;
  navBg: string;
  accent: string;
  iconBg: string;
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const OPD_PATIENTS = [
  { id: "P10-2024-001", name: "Rahul Sharma", time: "09:00 AM", complaint: "Chest pain, shortness of breath", status: "In-Progress", age: 52, gender: "M", blood: "B+", bp: "148/92", spo2: "96%", pulse: "88 bpm", temp: "98.6°F", weight: "82 kg", rbs: "142 mg/dL", allergy: "Penicillin", diagnosis: "Hypertensive heart disease" },
  { id: "P10-2024-002", name: "Priya Mehta", time: "09:30 AM", complaint: "Fever, cough, body ache", status: "Waiting", age: 34, gender: "F", blood: "O+", bp: "110/70", spo2: "98%", pulse: "78 bpm", temp: "101.2°F", weight: "58 kg", rbs: "98 mg/dL", allergy: "None", diagnosis: "Viral URTl" },
  { id: "P10-2024-003", name: "Vikram Nair", time: "10:00 AM", complaint: "Knee pain, swelling", status: "Checked In", age: 67, gender: "M", blood: "A+", bp: "132/84", spo2: "97%", pulse: "72 bpm", temp: "98.2°F", weight: "76 kg", rbs: "118 mg/dL", allergy: "Sulfa", diagnosis: "Osteoarthritis" },
  { id: "P10-2024-004", name: "Ananya Patel", time: "10:30 AM", complaint: "Headache, visual disturbances", status: "Completed", age: 29, gender: "F", blood: "AB+", bp: "120/78", spo2: "99%", pulse: "68 bpm", temp: "98.4°F", weight: "54 kg", rbs: "88 mg/dL", allergy: "NSAIDs", diagnosis: "Migraine" },
  { id: "P10-2024-005", name: "Suresh Kumar", time: "11:00 AM", complaint: "Diabetes follow-up", status: "Waiting", age: 58, gender: "M", blood: "B-", bp: "138/88", spo2: "97%", pulse: "76 bpm", temp: "98.8°F", weight: "88 kg", rbs: "210 mg/dL", allergy: "None", diagnosis: "Type 2 DM" },
];

const IPD_PATIENTS = [
  { id: "IPD-001", name: "Mohan Gupta", bed: "C-204", ward: "Cardiac ICU", admit: "12 Feb", diagnosis: "AMI - Post angioplasty", status: "Critical", days: 6 },
  { id: "IPD-002", name: "Sunita Reddy", bed: "G-108", ward: "General", admit: "15 Feb", diagnosis: "Appendicitis - Post-op", status: "Stable", days: 3 },
  { id: "IPD-003", name: "Ramesh Joshi", bed: "N-302", ward: "Neuro ICU", admit: "10 Feb", diagnosis: "Ischemic stroke", status: "Critical", days: 8 },
  { id: "IPD-004", name: "Kavitha S.", bed: "O-205", ward: "Ortho", admit: "16 Feb", diagnosis: "Hip replacement", status: "Stable", days: 2 },
];

const DEPARTMENTS = [
  { name: "Cardiology", icon: "❤️", doctors: 8, color: "#ef4444" },
  { name: "Neurology", icon: "🧠", doctors: 6, color: "#8b5cf6" },
  { name: "Orthopedics", icon: "🦴", doctors: 10, color: "#f59e0b" },
  { name: "Pediatrics", icon: "👶", doctors: 7, color: "#10b981" },
  { name: "Gynecology", icon: "🌸", doctors: 9, color: "#ec4899" },
  { name: "ENT", icon: "👂", doctors: 5, color: "#06b6d4" },
  { name: "Ophthalmology", icon: "👁️", doctors: 4, color: "#6366f1" },
  { name: "Dermatology", icon: "🧬", doctors: 6, color: "#f97316" },
  { name: "Gastro", icon: "🫁", doctors: 5, color: "#14b8a6" },
  { name: "Oncology", icon: "🎗️", doctors: 8, color: "#a855f7" },
  { name: "Urology", icon: "💊", doctors: 4, color: "#0ea5e9" },
  { name: "Psychiatry", icon: "🧘", doctors: 3, color: "#84cc16" },
];

const DOCTORS_LIST = [
  { id: 1, name: "Dr. Arjun Mehta", dept: "Cardiology", exp: "18 yrs", fee: "₹800", rating: 4.9, available: true, slots: ["9:00 AM", "10:30 AM", "2:00 PM", "4:30 PM"] },
  { id: 2, name: "Dr. Sunita Rao", dept: "Neurology", exp: "14 yrs", fee: "₹900", rating: 4.8, available: true, slots: ["9:30 AM", "11:00 AM", "3:00 PM"] },
  { id: 3, name: "Dr. Rajesh Kumar", dept: "Orthopedics", exp: "22 yrs", fee: "₹750", rating: 4.7, available: false, slots: ["10:00 AM", "2:30 PM"] },
  { id: 4, name: "Dr. Meera Nair", dept: "Pediatrics", exp: "12 yrs", fee: "₹600", rating: 4.9, available: true, slots: ["8:30 AM", "11:30 AM", "4:00 PM"] },
];

const LAB_TESTS = [
  { name: "Complete Blood Count (CBC)", price: "₹350", time: "6 hrs", category: "Hematology" },
  { name: "Liver Function Test (LFT)", price: "₹650", time: "12 hrs", category: "Biochemistry" },
  { name: "Kidney Function Test (KFT)", price: "₹550", time: "8 hrs", category: "Biochemistry" },
  { name: "Thyroid Profile (TSH, T3, T4)", price: "₹800", time: "24 hrs", category: "Endocrinology" },
  { name: "HbA1c (Glycated Hemoglobin)", price: "₹450", time: "6 hrs", category: "Diabetology" },
  { name: "Lipid Profile", price: "₹500", time: "6 hrs", category: "Biochemistry" },
  { name: "Urine Routine", price: "₹150", time: "4 hrs", category: "Pathology" },
  { name: "ECG", price: "₹200", time: "Immediate", category: "Cardiology" },
];

const MEDICINES = [
  { name: "Amlodipine 5mg", category: "Antihypertensive", price: "₹12" },
  { name: "Metformin 500mg", category: "Antidiabetic", price: "₹8" },
  { name: "Atorvastatin 10mg", category: "Statin", price: "₹15" },
  { name: "Pantoprazole 40mg", category: "PPI", price: "₹10" },
  { name: "Azithromycin 500mg", category: "Antibiotic", price: "₹45" },
  { name: "Paracetamol 650mg", category: "Analgesic", price: "₹5" },
  { name: "Cetirizine 10mg", category: "Antihistamine", price: "₹6" },
  { name: "Omeprazole 20mg", category: "PPI", price: "₹8" },
];

const MONTHLY_OPD = [
  { month: "Sep", count: 1240 }, { month: "Oct", count: 1380 }, { month: "Nov", count: 1190 },
  { month: "Dec", count: 1050 }, { month: "Jan", count: 1420 }, { month: "Feb", count: 1580 },
];

const BP_DATA = [
  { day: "Mon", systolic: 138, diastolic: 88 }, { day: "Tue", systolic: 135, diastolic: 85 },
  { day: "Wed", systolic: 142, diastolic: 90 }, { day: "Thu", systolic: 128, diastolic: 82 },
  { day: "Fri", systolic: 132, diastolic: 84 }, { day: "Sat", systolic: 125, diastolic: 80 },
  { day: "Sun", systolic: 130, diastolic: 83 },
];

const DOC_NOTIFICATIONS = [
  { type: "critical", title: "Critical Lab Alert", msg: "Rahul Sharma — K⁺ 6.8 mEq/L (CRITICAL HIGH)", time: "2 min ago" },
  { type: "appointment", title: "New Appointment Request", msg: "Deepa Krishnan — OPD tomorrow 11 AM", time: "15 min ago" },
  { type: "ipd", title: "IPD Deterioration", msg: "Mohan Gupta — SpO₂ dropped to 88%", time: "32 min ago" },
  { type: "admin", title: "Admin Notice", msg: "CME Conference: Feb 22, 2024 — Conf. Hall B", time: "1 hr ago" },
  { type: "appointment", title: "Teleconsult Request", msg: "Neha Singh — Video Consult at 5 PM", time: "2 hrs ago" },
];

const PAT_NOTIFICATIONS = [
  { type: "reminder", title: "Appointment Reminder", msg: "OPD with Dr. Arjun Mehta tomorrow at 9:00 AM", time: "1 hr ago" },
  { type: "report", title: "Lab Report Ready", msg: "Your CBC & LFT report is now available", time: "3 hrs ago" },
  { type: "medicine", title: "Medicine Refill", msg: "Metformin 500mg — only 5 tablets remaining", time: "5 hrs ago" },
  { type: "hospital", title: "Health Camp", msg: "Free diabetes screening — Feb 22, OPD Block", time: "1 day ago" },
];

const FAMILY_MEMBERS = [
  { name: "Meera Sharma", relation: "Spouse", age: 45, blood: "A+", uhid: "P10-F-2891" },
  { name: "Aryan Sharma", relation: "Son", age: 18, blood: "B+", uhid: "P10-F-3042" },
  { name: "Kamla Sharma", relation: "Mother", age: 72, blood: "O+", uhid: "P10-F-1205" },
];

const VIDEO_CALLS = [
  { patient: "Mrs. Deepa K.", time: "05:00 PM", id: "VC-2024-0891", duration: "15 min", status: "upcoming" },
  { patient: "Mr. Ajay Verma", time: "06:30 PM", id: "VC-2024-0892", duration: "20 min", status: "upcoming" },
  { patient: "Ms. Ritu Patel", time: "03:00 PM", id: "VC-2024-0890", duration: "12 min", status: "completed" },
];

// ─── UTILS ────────────────────────────────────────────────────────────────────
const Toast = ({ msg, visible, theme }: { msg: string; visible: boolean; theme: Theme }) => (
  <div style={{
    position: "absolute", bottom: 80, left: "50%", transform: `translateX(-50%) translateY(${visible ? 0 : 20}px)`,
    background: theme.mode === 'dark' ? "#333" : "#1e293b",
    color: "#fff",
    padding: "10px 20px", borderRadius: 30, fontSize: 12, fontWeight: 600,
    opacity: visible ? 1 : 0, transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    pointerEvents: "none", zIndex: 100, whiteSpace: "nowrap",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 8
  }}>
    <span>ℹ️</span> {msg}
  </div>
);

// ─── IPHONE FRAME ─────────────────────────────────────────────────────────────
const StatusBar = ({ isDark }: { isDark: boolean }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const color = isDark ? "#fff" : "#000";

  return (
    <div style={{ background: isDark ? "rgba(10,22,40,0.95)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }}
      className="flex items-center justify-between px-6 pt-3 pb-1 h-10 flex-shrink-0 z-50">
      <span className="text-xs font-semibold" style={{ color }}>{time}</span>
      <div className="flex items-center gap-1.5">
        {/* Signal Bars */}
        <div className="flex items-end gap-0.5">
          {[3, 5, 7, 9].map((h, i) => (
            <div key={i} style={{ width: 3, height: h, background: isDark ? (i < 3 ? "#93c5fd" : "rgba(147,197,253,0.3)") : (i < 3 ? "#000" : "rgba(0,0,0,0.2)"), borderRadius: 1 }} />
          ))}
        </div>
        <span className="text-[9px] font-medium ml-0.5" style={{ color }}>5G</span>
        {/* WiFi */}
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" className="ml-0.5">
          <path d="M7 9.5C7.55 9.5 8 9.05 8 8.5C8 7.95 7.55 7.5 7 7.5C6.45 7.5 6 7.95 6 8.5C6 9.05 6.45 9.5 7 9.5Z" fill={color} />
          <path d="M7 5.5C8.66 5.5 10.14 6.16 11.24 7.24L12.66 5.82C11.17 4.35 9.19 3.5 7 3.5C4.81 3.5 2.83 4.35 1.34 5.82L2.76 7.24C3.86 6.16 5.34 5.5 7 5.5Z" fill={color} opacity="0.7" />
          <path d="M7 1.5C9.76 1.5 12.24 2.6 14 4.42L15.41 3C13.27 0.86 10.29 0 7 0C3.71 0 0.73 0.86-1.41 3L0 4.42C1.76 2.6 4.24 1.5 7 1.5Z" fill={color} opacity="0.4" />
        </svg>
        {/* Battery with charging bolt */}
        <div className="flex items-center ml-0.5">
          <div style={{ width: 22, height: 11, border: `1.5px solid ${isDark ? "rgba(147,197,253,0.8)" : "rgba(0,0,0,0.5)"}`, borderRadius: 2.5, position: "relative", padding: "1px" }}>
            <div style={{ width: "75%", height: "100%", background: "linear-gradient(90deg,#34d399,#10b981)", borderRadius: 1.5 }} />
            <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: isDark ? "#fff" : "#fff", fontSize: 7, fontWeight: 700 }}>⚡</span>
          </div>
          <div style={{ width: 2, height: 5, background: isDark ? "rgba(147,197,253,0.6)" : "rgba(0,0,0,0.5)", borderRadius: "0 1px 1px 0", marginLeft: -0.5 }} />
        </div>
      </div>
    </div>
  );
};

const DynamicIsland = () => (
  <div className="flex justify-center pt-2 pb-1 flex-shrink-0 z-50" style={{ background: "transparent" }}>
    <div style={{ width: 120, height: 34, background: "#000", borderRadius: 20, border: "1px solid #1a1a1a" }} className="flex items-center justify-center">
      <div style={{ width: 8, height: 8, background: "#1a1a1a", borderRadius: "50%", marginRight: 32 }} />
      <div style={{ width: 8, height: 8, background: "#111", borderRadius: "50%" }} />
    </div>
  </div>
);

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    "In-Progress": "linear-gradient(135deg,#f59e0b,#fbbf24)",
    "Waiting": "linear-gradient(135deg,#2563eb,#3b82f6)",
    "Checked In": "linear-gradient(135deg,#10b981,#34d399)",
    "Completed": "linear-gradient(135deg,#6366f1,#818cf8)",
    "No-Show": "linear-gradient(135deg,#ef4444,#f87171)",
    "Critical": "linear-gradient(135deg,#dc2626,#ef4444)",
    "Stable": "linear-gradient(135deg,#059669,#10b981)",
  };
  return (
    <span style={{ background: colors[status] || "#374151", fontSize: 9, padding: "2px 7px", borderRadius: 10, color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
};

const SectionHeader = ({ title, subtitle, onBack, theme }: { title: string; subtitle?: string; onBack?: () => void; theme: Theme }) => (
  <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: theme.headerBg, borderBottom: `1px solid ${theme.cardBorder}` }}>
    {onBack && (
      <button onClick={onBack} style={{ background: theme.iconBg, borderRadius: 10, padding: "6px 8px", border: "none", color: theme.accent, cursor: "pointer", fontSize: 14 }}>
        ←
      </button>
    )}
    <div>
      <div className="font-bold text-sm" style={{ color: theme.text }}>{title}</div>
      {subtitle && <div className="text-xs opacity-70" style={{ color: theme.textSec }}>{subtitle}</div>}
    </div>
  </div>
);

const QuickStatCard = ({ label, value, icon, color, theme }: { label: string; value: string | number; icon: string; color: string; theme: Theme }) => (
  <div className="rounded-2xl p-3 flex flex-col items-center gap-1 shadow-card" style={{ minWidth: 0, background: theme.cardBg, boxShadow: theme.mode === 'light' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>
    <div style={{ background: color, borderRadius: 12, padding: "8px", fontSize: 18 }}>{icon}</div>
    <div className="font-bold text-lg leading-none" style={{ color: theme.text }}>{value}</div>
    <div className="text-xs text-center leading-tight opacity-80" style={{ color: theme.textSec }}>{label}</div>
  </div>
);

// ─── SPLASH SCREEN ─────────────────────────────────────────────────────────────
const SplashScreen = ({ onDone, theme }: { onDone: () => void; theme: Theme }) => {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ background: theme.bg }}>
      <div className="flex flex-col items-center gap-6 animate-fadeInUp">
        <div style={{ width: 90, height: 90, background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(37,99,235,0.5)" }}>
          <span style={{ fontSize: 44 }}>🏥</span>
        </div>
        <div className="text-center">
          <div className="font-black text-2xl tracking-tight" style={{ color: theme.text }}>MedCore Pro</div>
          <div style={{ color: theme.accent, fontSize: 12, letterSpacing: 3, marginTop: 2, fontWeight: 500 }}>PROJECT 10</div>
          <div style={{ color: theme.textSec, fontSize: 10, marginTop: 6 }}>Excellence in Healthcare</div>
        </div>
        <div style={{ width: 160, height: 3, background: theme.cardBorder, borderRadius: 2, overflow: "hidden", marginTop: 16 }}>
          <div className="shimmer" style={{ width: "100%", height: "100%", background: "linear-gradient(90deg,transparent,#2563eb,#06b6d4,transparent)", animation: "shimmer 1.5s infinite" }} />
        </div>
        <div style={{ color: theme.textSec, fontSize: 10 }}>Powered by AI Healthcare</div>
      </div>
      <div style={{ position: "absolute", bottom: 60, display: "flex", gap: 6 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === 1 ? "#2563eb" : theme.cardBorder }} />)}
      </div>
    </div>
  );
};

// ─── ROLE SELECTION ─────────────────────────────────────────────────────────────
const RoleSelection = ({ onSelect, theme }: { onSelect: (r: Role) => void; theme: Theme }) => (
  <div className="flex flex-col items-center justify-center h-full px-6 gap-8" style={{ background: theme.bg }}>
    <div className="text-center animate-fadeInUp">
      <div style={{ fontSize: 40, marginBottom: 8 }}>🏥</div>
      <div className="font-black text-xl" style={{ color: theme.text }}>Welcome to</div>
      <div style={{ color: theme.accent, fontWeight: 800, fontSize: 22 }}>Project 10</div>
      <div style={{ color: theme.textSec, fontSize: 11, marginTop: 4 }}>Select your role to continue</div>
    </div>
    <div className="flex flex-col gap-4 w-full">
      {[
        { role: "doctor" as Role, emoji: "👨‍⚕️", title: "Doctor / Staff", sub: "Access OPD, IPD, Prescriptions & Analytics", color: "linear-gradient(135deg,#1a3a6e,#2563eb)" },
        { role: "patient" as Role, emoji: "👤", title: "Patient", sub: "Book appointments, records, pharmacy & more", color: "linear-gradient(135deg,#0c4a6e,#0ea5e9)" },
      ].map(({ role, emoji, title, sub, color }) => (
        <button key={role} onClick={() => onSelect(role)}
          style={{ background: color, border: `1px solid ${theme.cardBorder}`, borderRadius: 20, padding: "20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.3)", transition: "transform 0.15s" }}
          onMouseDown={e => (e.currentTarget.style.transform = "scale(0.97)")}
          onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>
          <div style={{ fontSize: 40, background: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 12 }}>{emoji}</div>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{title}</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, marginTop: 4 }}>{sub}</div>
          </div>
        </button>
      ))}
    </div>
    <div style={{ color: theme.textSec, fontSize: 10, textAlign: "center" }}>
      🔒 256-bit AES Encrypted · HIPAA Compliant
    </div>
  </div>
);

// ─── LOGIN SCREEN ──────────────────────────────────────────────────────────────
const LoginScreen = ({ role, onLogin, onBack, theme }: { role: Role; onLogin: () => void; onBack: () => void; theme: Theme }) => {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div className="flex flex-col h-full" style={{ background: theme.bg }}>
      <div style={{ background: theme.headerBg, padding: "20px 20px 30px", position: "relative" }}>
        <button onClick={onBack} style={{ background: theme.iconBg, border: "none", color: theme.accent, borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontSize: 12, marginBottom: 16 }}>← Back</button>
        <div style={{ fontSize: 28, marginBottom: 8 }}>{role === "doctor" ? "👨‍⚕️" : "👤"}</div>
        <div style={{ color: theme.text, fontWeight: 800, fontSize: 20 }}>{role === "doctor" ? "Doctor Login" : "Patient Login"}</div>
        <div style={{ color: theme.textSec, fontSize: 11, marginTop: 4 }}>Project 10 — Secure Access Portal</div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-6 flex flex-col gap-5">
        {/* Method Toggle */}
        <div style={{ background: theme.inputBg, borderRadius: 14, padding: 4, display: "flex", gap: 4 }}>
          {(["phone", "email"] as const).map(m => (
            <button key={m} onClick={() => setMethod(m)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                background: method === m ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "transparent",
                color: method === m ? "#fff" : theme.textSec
              }}>
              {m === "phone" ? "📱 Phone" : "✉️ Email"}
            </button>
          ))}
        </div>

        {method === "phone" ? (
          <div>
            <label style={{ color: theme.accent, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 6 }}>MOBILE NUMBER</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 12, padding: "12px 14px", color: theme.accent, fontSize: 13, fontWeight: 600, minWidth: 56 }}>+91</div>
              <input value={phone} onChange={e => setPhone(e.target.value.slice(0, 10))} placeholder="Enter 10-digit number"
                style={{ flex: 1, background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 12, padding: "12px 14px", color: theme.text, fontSize: 14, outline: "none" }}
                type="tel" inputMode="numeric" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label style={{ color: theme.accent, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 6 }}>EMAIL ADDRESS</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
                style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 12, padding: "12px 14px", color: theme.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ color: theme.accent, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 6 }}>PASSWORD</label>
              <input value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter password" type="password"
                style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 12, padding: "12px 14px", color: theme.text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
        )}

        <button onClick={onLogin}
          style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(37,99,235,0.4)", width: "100%" }}>
          {method === "phone" ? "Send OTP →" : "Login Securely →"}
        </button>

        {/* Biometric */}
        <div style={{ textAlign: "center" }}>
          <div style={{ color: theme.textSec, fontSize: 11, marginBottom: 12 }}>— OR —</div>
          <button onClick={onLogin} style={{ background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 14, padding: "12px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, margin: "0 auto", color: theme.accent, fontSize: 12, fontWeight: 600 }}>
            <span style={{ fontSize: 20 }}>👆</span> Biometric / Face ID Login
          </button>
        </div>

        {/* Google */}
        <button onClick={onLogin} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 14, padding: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, width: "100%", color: theme.text, fontSize: 12, fontWeight: 600 }}>
          <span style={{ fontSize: 18 }}>🇬</span> Continue with Google / Gmail
        </button>

        <div style={{ color: theme.textSec, fontSize: 10, textAlign: "center", marginTop: 8 }}>
          By continuing, you agree to our Terms & Privacy Policy
        </div>
      </div>
    </div>
  );
};

// ─── OTP SCREEN ────────────────────────────────────────────────────────────────
const OTPScreen = ({ onVerify, onBack, theme }: { role: Role; onVerify: () => void; onBack: () => void; theme: Theme }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const handleChange = (val: string, idx: number) => {
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
  };

  return (
    <div className="flex flex-col h-full px-5 py-6 gap-6" style={{ background: theme.bg }}>
      <button onClick={onBack} style={{ background: theme.iconBg, border: "none", color: theme.accent, borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontSize: 12, alignSelf: "flex-start" }}>← Back</button>
      <div className="flex flex-col items-center gap-3 text-center">
        <div style={{ fontSize: 48 }}>📱</div>
        <div style={{ color: theme.text, fontWeight: 800, fontSize: 18 }}>OTP Verification</div>
        <div style={{ color: theme.textSec, fontSize: 12 }}>Enter the 6-digit code sent to<br />+91 98765 43210</div>
      </div>
      <div className="flex justify-center gap-2">
        {otp.map((val, idx) => (
          <input key={idx} value={val} onChange={e => handleChange(e.target.value, idx)} maxLength={1} type="tel" inputMode="numeric"
            style={{ width: 42, height: 52, textAlign: "center", background: theme.inputBg, border: `2px solid ${val ? "#2563eb" : theme.inputBorder}`, borderRadius: 12, color: theme.text, fontSize: 20, fontWeight: 700, outline: "none", transition: "border 0.2s" }} />
        ))}
      </div>
      <button onClick={onVerify}
        style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(37,99,235,0.4)" }}>
        Verify & Login →
      </button>
      <div style={{ textAlign: "center", color: theme.textSec, fontSize: 11 }}>
        Didn't receive? <span style={{ color: "#2563eb", cursor: "pointer" }}>Resend OTP</span> (0:28)
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCTOR SCREENS
// ─────────────────────────────────────────────────────────────────────────────

const DocHome = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: Theme }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    {/* Header */}
    <div style={{ background: theme.headerBg, padding: "16px 16px 24px" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div style={{ color: theme.textSec, fontSize: 10, fontWeight: 600 }}>DR. ARJUN MEHTA, MD</div>
          <div style={{ color: theme.text, fontWeight: 800, fontSize: 16 }}>Good Morning! 👋</div>
          <div style={{ color: theme.textSec, fontSize: 10 }}>Cardiology · MCI Reg: DL/12345 · ID: P10-D-001</div>
        </div>
        <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#2563eb,#06b6d4)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👨‍⚕️</div>
      </div>
      {/* Date Banner */}
      <div style={{ background: theme.inputBg, borderRadius: 12, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: theme.textSec, fontSize: 10 }}>📅 Wednesday, 19 Feb 2025</span>
        <span style={{ color: "#fbbf24", fontSize: 10, fontWeight: 600 }}>● OPD Running</span>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2">
        <QuickStatCard theme={theme} label="OPD Queue" value={14} icon="👥" color="linear-gradient(135deg,#2563eb,#3b82f6)" />
        <QuickStatCard theme={theme} label="IPD Census" value={28} icon="🛏️" color="linear-gradient(135deg,#059669,#10b981)" />
        <QuickStatCard theme={theme} label="Alerts" value={3} icon="⚠️" color="linear-gradient(135deg,#dc2626,#ef4444)" />
        <QuickStatCard theme={theme} label="Reports" value={7} icon="📋" color="linear-gradient(135deg,#7c3aed,#8b5cf6)" />
      </div>

      {/* Quick Actions */}
      <div>
        <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: 0.5 }}>QUICK ACTIONS</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "🗓️", label: "OPD Schedule", screen: "doc_opd", color: "linear-gradient(135deg,#1a3a6e,#2563eb)" },
            { icon: "🛏️", label: "IPD Rounds", screen: "doc_ipd", color: "linear-gradient(135deg,#064e3b,#059669)" },
            { icon: "💊", label: "Prescription", screen: "doc_prescription", color: "linear-gradient(135deg,#4c1d95,#7c3aed)" },
            { icon: "📹", label: "Video Consult", screen: "doc_video", color: "linear-gradient(135deg,#0c4a6e,#0ea5e9)" },
            { icon: "📅", label: "Leave/Cover", screen: "doc_leave", color: "linear-gradient(135deg,#78350f,#d97706)" },
            { icon: "📊", label: "Analytics", screen: "doc_reports", color: "linear-gradient(135deg,#581c87,#9333ea)" },
          ].map(({ icon, label, screen, color }) => (
            <button key={label} onClick={() => setScreen(screen as Screen)}
              style={{ background: color, border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: "14px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <span style={{ fontSize: 24 }}>{icon}</span>
              <span style={{ color: "#fff", fontSize: 9.5, fontWeight: 600, textAlign: "center", lineHeight: "1.2" }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Schedule Preview */}
      <div>
        <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 10, letterSpacing: 0.5 }}>TODAY'S SCHEDULE</div>
        <div className="flex flex-col gap-2">
          {OPD_PATIENTS.slice(0, 3).map(p => (
            <button key={p.id} onClick={() => setScreen("doc_opd")}
              style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 14, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", width: "100%", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: theme.text, fontWeight: 600, fontSize: 12 }}>{p.name}</div>
                <div style={{ color: theme.textSec, fontSize: 10 }}>{p.time} · {p.complaint.slice(0, 22)}…</div>
              </div>
              <StatusBadge status={p.status} />
            </button>
          ))}
        </div>
      </div>

      {/* Critical Alert */}
      <div style={{ background: "linear-gradient(135deg,rgba(220,38,38,0.2),rgba(239,68,68,0.1))", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 16, padding: "12px 14px" }}>
        <div style={{ color: "#fca5a5", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>⚠️ CRITICAL ALERT</div>
        <div style={{ color: theme.text, fontSize: 12, fontWeight: 600 }}>Mohan Gupta — Cardiac ICU</div>
        <div style={{ color: "rgba(252,165,165,0.8)", fontSize: 10, marginTop: 2 }}>SpO₂ dropped to 88% · Immediate attention required</div>
      </div>
    </div>
  </div>
);

const DocOPD = ({ setScreen, setSelectedPatient, theme }: { setScreen: (s: Screen) => void; setSelectedPatient: (p: typeof OPD_PATIENTS[0]) => void; theme: Theme }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    <SectionHeader theme={theme} title="OPD Schedule" subtitle="Wednesday, 19 Feb · 14 Patients" onBack={() => setScreen("doc_home")} />
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
      {OPD_PATIENTS.map((p, idx) => (
        <button key={p.id} onClick={() => { setSelectedPatient(p); setScreen("doc_patient_detail"); }}
          style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", width: "100%", animation: `fadeInUp ${0.1 + idx * 0.06}s ease-out`, boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 12, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
              {p.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ color: theme.text, fontWeight: 700, fontSize: 12 }}>{p.name}</div>
              <div style={{ color: theme.textSec, fontSize: 10 }}>{p.id} · {p.time}</div>
              <div style={{ color: theme.textSec, fontSize: 9.5, marginTop: 1 }}>{p.complaint}</div>
            </div>
          </div>
          <StatusBadge status={p.status} />
        </button>
      ))}
    </div>
  </div>
);

const DocPatientDetail = ({ patient, setScreen, theme, showToast }: { patient: typeof OPD_PATIENTS[0] | null; setScreen: (s: Screen) => void; theme: Theme; showToast: (msg: string) => void }) => {
  const [tab, setTab] = useState<"vitals" | "history" | "labs">("vitals");
  if (!patient) return null;
  return (
    <div className="flex flex-col h-full" style={{ background: theme.bg }}>
      <SectionHeader theme={theme} title={patient.name} subtitle={`${patient.id} · ${patient.age}Y/${patient.gender} · ${patient.blood}`} onBack={() => setScreen("doc_opd")} />
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Patient Summary */}
        <div style={{ background: theme.headerBg, padding: "12px 16px" }}>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div style={{ background: theme.inputBg, borderRadius: 10, padding: "8px 10px" }}>
              <div style={{ color: theme.textSec, fontSize: 9 }}>DIAGNOSIS</div>
              <div style={{ color: theme.text, fontSize: 11, fontWeight: 600, marginTop: 2 }}>{patient.diagnosis}</div>
            </div>
            <div style={{ background: "rgba(239,68,68,0.1)", borderRadius: 10, padding: "8px 10px" }}>
              <div style={{ color: "rgba(252,165,165,0.7)", fontSize: 9 }}>ALLERGY</div>
              <div style={{ color: "#fca5a5", fontSize: 11, fontWeight: 600, marginTop: 2 }}>{patient.allergy}</div>
            </div>
          </div>
          <div style={{ color: theme.textSec, fontSize: 9, marginBottom: 6 }}>CHIEF COMPLAINT</div>
          <div style={{ color: theme.text, fontSize: 11 }}>{patient.complaint}</div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: theme.cardBg, borderBottom: `1px solid ${theme.cardBorder}` }}>
          {(["vitals", "history", "labs"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: "transparent", color: tab === t ? "#2563eb" : theme.textSec, borderBottom: tab === t ? "2px solid #2563eb" : "2px solid transparent" }}>
              {t === "vitals" ? "Vitals" : t === "history" ? "History" : "Lab Results"}
            </button>
          ))}
        </div>

        <div className="px-4 py-3">
          {tab === "vitals" && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Blood Pressure", value: patient.bp, icon: "💉", color: "#ef4444" },
                { label: "SpO₂", value: patient.spo2, icon: "🫁", color: "#2563eb" },
                { label: "Pulse Rate", value: patient.pulse, icon: "❤️", color: "#ec4899" },
                { label: "Temperature", value: patient.temp, icon: "🌡️", color: "#f59e0b" },
                { label: "Weight", value: patient.weight, icon: "⚖️", color: "#10b981" },
                { label: "Blood Sugar", value: patient.rbs, icon: "🩸", color: "#8b5cf6" },
              ].map(v => (
                <div key={v.label} style={{ background: theme.cardBg, border: `1px solid ${v.color}30`, borderRadius: 14, padding: "10px 8px", textAlign: "center", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{v.icon}</div>
                  <div style={{ color: v.color, fontSize: 12, fontWeight: 700 }}>{v.value}</div>
                  <div style={{ color: theme.textSec, fontSize: 8, marginTop: 2 }}>{v.label}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "history" && (
            <div className="flex flex-col gap-2">
              {["01 Jan 2025 — Hypertension review · Amlodipine adjusted", "15 Nov 2024 — ECG: Normal sinus rhythm", "02 Sep 2024 — Echo: EF 55%, mild LVH"].map((h, i) => (
                <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 12, padding: "10px 12px" }}>
                  <div style={{ color: theme.text, fontSize: 11 }}>{h}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "labs" && (
            <div className="flex flex-col gap-2">
              {[
                { test: "CBC", result: "WBC: 8.2, Hb: 13.4, Plt: 210K", flag: "Normal" },
                { test: "K⁺ (Potassium)", result: "6.8 mEq/L", flag: "⚠️ Critical" },
                { test: "Creatinine", result: "1.4 mg/dL", flag: "High" },
                { test: "HbA1c", result: "7.2%", flag: "Elevated" },
              ].map(l => (
                <div key={l.test} style={{ background: theme.cardBg, border: `1px solid ${l.flag.includes("Critical") ? "rgba(239,68,68,0.4)" : theme.cardBorder}`, borderRadius: 12, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ color: theme.text, fontSize: 12, fontWeight: 600 }}>{l.test}</div>
                    <div style={{ color: theme.textSec, fontSize: 10 }}>{l.result}</div>
                  </div>
                  <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 8, background: l.flag.includes("Critical") ? "rgba(239,68,68,0.3)" : theme.inputBg, color: l.flag.includes("Critical") ? "#fca5a5" : theme.accent, fontWeight: 600 }}>{l.flag}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ padding: "0 16px 16px", display: "flex", gap: 8 }}>
          <button onClick={() => setScreen("doc_prescription")} style={{ flex: 1, background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 12, padding: "12px 0", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>💊 Write Rx</button>
          <button onClick={() => showToast("Referral request sent to Administration")} style={{ flex: 1, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "12px 0", color: "#34d399", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>↗️ Refer</button>
          <button onClick={() => { showToast("Consultation marked as complete"); setScreen('doc_opd'); }} style={{ flex: 1, background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 12, padding: "12px 0", color: "#a78bfa", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✅ Done</button>
        </div>
      </div>
    </div>
  );
};

const DocIPD = ({ setScreen, theme, showToast }: { setScreen: (s: Screen) => void; theme: Theme; showToast: (msg: string) => void }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    <SectionHeader theme={theme} title="IPD Inpatients" subtitle="28 Patients · 3 Critical" onBack={() => setScreen("doc_home")} />
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
      {IPD_PATIENTS.map(p => (
        <div key={p.id} style={{ background: theme.cardBg, border: `1px solid ${p.status === "Critical" ? "rgba(239,68,68,0.3)" : theme.cardBorder}`, borderRadius: 16, padding: "14px", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div style={{ color: theme.text, fontWeight: 700, fontSize: 13 }}>{p.name}</div>
              <div style={{ color: theme.textSec, fontSize: 10 }}>Bed {p.bed} · {p.ward} · {p.days} days</div>
            </div>
            <StatusBadge status={p.status} />
          </div>
          <div style={{ color: theme.textSec, fontSize: 11, marginBottom: 8 }}>Dx: {p.diagnosis}</div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => showToast(`Opening Notes: ${p.name}`)} style={{ flex: 1, background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 10, padding: "7px 0", color: theme.accent, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>📋 Notes</button>
            <button onClick={() => showToast(`View Meds: ${p.name}`)} style={{ flex: 1, background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 10, padding: "7px 0", color: theme.accent, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>💊 Meds</button>
            <button onClick={() => showToast(`Checking Vitals: ${p.name}`)} style={{ flex: 1, background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 10, padding: "7px 0", color: theme.accent, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>📊 Vitals</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DocPrescription = ({ setScreen, theme, showToast }: { setScreen: (s: Screen) => void; theme: Theme; showToast: (msg: string) => void }) => {
  const [search, setSearch] = useState("");
  const [selectedMeds, setSelectedMeds] = useState<string[]>(["Amlodipine 5mg", "Pantoprazole 40mg"]);
  const filtered = MEDICINES.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full" style={{ background: theme.bg }}>
      <SectionHeader theme={theme} title="Prescription Writer" subtitle="Patient: Rahul Sharma · P10-2024-001" onBack={() => setScreen("doc_patient_detail")} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-4">
        {/* Diagnosis */}
        <div>
          <label style={{ color: theme.accent, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 6 }}>DIAGNOSIS (ICD-10)</label>
          <input defaultValue="I11.0 — Hypertensive Heart Disease" style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 12, padding: "10px 12px", color: theme.text, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
        </div>

        {/* Medicine Search */}
        <div>
          <label style={{ color: theme.accent, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 6 }}>SEARCH MEDICINE</label>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Type medicine name..." style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 12, padding: "10px 12px", color: theme.text, fontSize: 12, outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
          {search && (
            <div style={{ background: theme.mode === 'dark' ? "rgba(10,22,40,0.9)" : "#fff", border: `1px solid ${theme.cardBorder}`, borderRadius: 12, maxHeight: 130, overflowY: "auto", boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              {filtered.map(m => (
                <button key={m.name} onClick={() => { if (!selectedMeds.includes(m.name)) setSelectedMeds(prev => [...prev, m.name]); setSearch(""); }}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", width: "100%", border: "none", background: "transparent", cursor: "pointer", borderBottom: `1px solid ${theme.cardBorder}` }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ color: theme.text, fontSize: 11, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ color: theme.textSec, fontSize: 9 }}>{m.category}</div>
                  </div>
                  <span style={{ color: "#34d399", fontSize: 10 }}>+ Add</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Medicines */}
        <div>
          <label style={{ color: theme.accent, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 6 }}>PRESCRIBED MEDICINES ({selectedMeds.length})</label>
          <div className="flex flex-col gap-2">
            {selectedMeds.map((med, i) => (
              <div key={i} style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 12, padding: "10px 12px" }}>
                <div className="flex justify-between items-center mb-2">
                  <div style={{ color: theme.text, fontSize: 12, fontWeight: 600 }}>{med}</div>
                  <button onClick={() => setSelectedMeds(prev => prev.filter(m => m !== med))} style={{ background: "rgba(239,68,68,0.2)", border: "none", borderRadius: 8, color: "#fca5a5", fontSize: 10, padding: "2px 6px", cursor: "pointer" }}>✕</button>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {["1-0-1", "After Food", "30 Days"].map((v, j) => (
                    <div key={j} style={{ background: theme.inputBg, borderRadius: 8, padding: "4px 6px", textAlign: "center", color: theme.textSec, fontSize: 9 }}>{v}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={{ color: theme.accent, fontSize: 11, fontWeight: 600, display: "block", marginBottom: 6 }}>CLINICAL NOTES</label>
          <textarea rows={3} defaultValue="Monitor BP daily. Follow up in 2 weeks. Salt-restricted diet advised." style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 12, padding: "10px 12px", color: theme.text, fontSize: 11, outline: "none", resize: "none", boxSizing: "border-box" }} />
        </div>

        {/* Digital Signature */}
        <div style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 12, padding: "12px", textAlign: "center" }}>
          <div style={{ color: theme.accent, fontSize: 10, marginBottom: 6 }}>DIGITAL SIGNATURE</div>
          <div style={{ fontFamily: "cursive", color: theme.text, fontSize: 18 }}>Dr. Arjun Mehta</div>
          <div style={{ color: theme.textSec, fontSize: 9, marginTop: 4 }}>MCI Reg: DL/12345 · Cardiology</div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pb-4">
          <button onClick={() => { showToast("Prescription Saved & Printed!"); setTimeout(() => setScreen('doc_home'), 1500); }} style={{ flex: 1, background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 12, padding: "12px 0", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>📄 Save & Print</button>
          <button onClick={() => showToast("PDF generated and ready to share")} style={{ flex: 1, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "12px 0", color: "#34d399", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>📤 Share PDF</button>
        </div>
      </div>
    </div>
  );
};

const DocVideo = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: Theme }) => {
  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  if (inCall) return (
    <div style={{ background: "#000", height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ flex: 1, background: "linear-gradient(135deg,#0a1628,#1a3a6e)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <div style={{ width: 80, height: 80, background: "linear-gradient(135deg,#2563eb,#06b6d4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: "0 0 30px rgba(37,99,235,0.5)" }}>👩</div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Mrs. Deepa K.</div>
        <div style={{ color: "#34d399", fontSize: 12 }}>● Connected · 00:04:32</div>
      </div>
      {/* Self preview */}
      <div style={{ position: "absolute", top: 60, right: 12, width: 80, height: 110, background: "linear-gradient(135deg,#1a3a6e,#0a1628)", borderRadius: 14, border: "2px solid rgba(147,197,253,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>👨‍⚕️</div>
      {/* Controls */}
      <div style={{ background: "rgba(0,0,0,0.8)", padding: "16px 24px 20px", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {[
          { icon: muted ? "🔇" : "🎤", label: muted ? "Unmute" : "Mute", action: () => setMuted(m => !m), color: muted ? "#ef4444" : "#374151" },
          { icon: videoOff ? "📵" : "📹", label: "Camera", action: () => setVideoOff(v => !v), color: videoOff ? "#ef4444" : "#374151" },
          { icon: "📞", label: "End Call", action: () => setInCall(false), color: "#ef4444", big: true },
          { icon: "💬", label: "Chat", action: () => { }, color: "#374151" },
          { icon: "🖥️", label: "Share", action: () => { }, color: "#374151" },
        ].map((ctrl, i) => (
          <button key={i} onClick={ctrl.action} style={{ background: ctrl.color, border: "none", borderRadius: "50%", width: (ctrl as any).big ? 56 : 44, height: (ctrl as any).big ? 56 : 44, fontSize: (ctrl as any).big ? 22 : 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
            {ctrl.icon}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full" style={{ background: theme.bg }}>
      <SectionHeader theme={theme} title="Video Consultations" subtitle="Today's Teleconsult Sessions" onBack={() => setScreen("doc_home")} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
        {VIDEO_CALLS.map((call, i) => (
          <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: "14px", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div style={{ color: theme.text, fontWeight: 700, fontSize: 13 }}>{call.patient}</div>
                <div style={{ color: theme.textSec, fontSize: 10 }}>{call.id} · {call.duration}</div>
              </div>
              <span style={{ background: call.status === "completed" ? "rgba(16,185,129,0.2)" : "rgba(37,99,235,0.2)", color: call.status === "completed" ? "#34d399" : "#93c5fd", fontSize: 9, padding: "3px 8px", borderRadius: 8, fontWeight: 600 }}>
                {call.status === "completed" ? "✓ Done" : `⏰ ${call.time}`}
              </span>
            </div>
            {call.status === "upcoming" && (
              <button onClick={() => setInCall(true)} style={{ width: "100%", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 10, padding: "10px 0", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                📹 Start Video Call
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const DocLeave = ({ setScreen, theme, showToast }: { setScreen: (s: Screen) => void; theme: Theme; showToast: (msg: string) => void }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    <SectionHeader theme={theme} title="Leave & Coverage" subtitle="Apply / Track Leave" onBack={() => setScreen("doc_home")} />
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-4">
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: "16px", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
        <div style={{ color: theme.accent, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>Apply for Leave</div>
        <div className="flex flex-col gap-3">
          <div>
            <label style={{ color: theme.textSec, fontSize: 10, display: "block", marginBottom: 4 }}>LEAVE TYPE</label>
            <select style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 10, padding: "8px 10px", color: theme.text, fontSize: 12, outline: "none" }}>
              <option>Casual Leave</option><option>Medical Leave</option><option>Earned Leave</option><option>Emergency Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ color: theme.textSec, fontSize: 10, display: "block", marginBottom: 4 }}>FROM DATE</label>
              <input type="date" defaultValue="2025-02-24" style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 10, padding: "8px 10px", color: theme.text, fontSize: 11, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ color: theme.textSec, fontSize: 10, display: "block", marginBottom: 4 }}>TO DATE</label>
              <input type="date" defaultValue="2025-02-26" style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 10, padding: "8px 10px", color: theme.text, fontSize: 11, outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <div>
            <label style={{ color: theme.textSec, fontSize: 10, display: "block", marginBottom: 4 }}>COVERAGE BY</label>
            <select style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 10, padding: "8px 10px", color: theme.text, fontSize: 12, outline: "none" }}>
              <option>Dr. Sunita Rao (Cardiology)</option><option>Dr. Kavitha Pillai (Cardiology)</option><option>Dr. Rajesh S. (Cardiology)</option>
            </select>
          </div>
          <button onClick={() => { showToast("Leave request submitted for approval"); setTimeout(() => setScreen('doc_home'), 1000); }} style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 12, padding: "12px 0", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Submit Leave Request</button>
        </div>
      </div>
      <div>
        <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>LEAVE BALANCE</div>
        {[{ type: "Casual Leave", used: 3, total: 12 }, { type: "Medical Leave", used: 0, total: 7 }, { type: "Earned Leave", used: 8, total: 30 }].map(l => (
          <div key={l.type} style={{ background: theme.cardBg, borderRadius: 12, padding: "10px 12px", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${theme.cardBorder}` }}>
            <span style={{ color: theme.text, fontSize: 12 }}>{l.type}</span>
            <span style={{ color: theme.accent, fontSize: 12, fontWeight: 700 }}>{l.total - l.used} / {l.total} days</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DocNotifications = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: Theme }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    <SectionHeader theme={theme} title="Notifications" subtitle="3 Critical · 2 New" onBack={() => setScreen("doc_home")} />
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
      {DOC_NOTIFICATIONS.map((n, i) => (
        <div key={i} style={{ background: n.type === "critical" ? "rgba(220,38,38,0.15)" : theme.cardBg, border: `1px solid ${n.type === "critical" ? "rgba(239,68,68,0.3)" : theme.cardBorder}`, borderRadius: 14, padding: "12px 14px", display: "flex", gap: 10, boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>{n.type === "critical" ? "🚨" : n.type === "appointment" ? "📅" : n.type === "ipd" ? "🛏️" : "📢"}</div>
          <div>
            <div style={{ color: n.type === "critical" ? "#fca5a5" : theme.text, fontWeight: 700, fontSize: 12 }}>{n.title}</div>
            <div style={{ color: theme.textSec, fontSize: 10, marginTop: 2 }}>{n.msg}</div>
            <div style={{ color: theme.textSec, fontSize: 9, marginTop: 4 }}>{n.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DocReports = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: Theme }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    <SectionHeader theme={theme} title="Reports & Analytics" subtitle="February 2025" onBack={() => setScreen("doc_home")} />
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        <QuickStatCard theme={theme} label="Total OPD" value="1,580" icon="👥" color="linear-gradient(135deg,#2563eb,#3b82f6)" />
        <QuickStatCard theme={theme} label="Satisfaction" value="4.9★" icon="⭐" color="linear-gradient(135deg,#f59e0b,#fbbf24)" />
        <QuickStatCard theme={theme} label="Revenue" value="₹4.2L" icon="💰" color="linear-gradient(135deg,#059669,#10b981)" />
      </div>

      <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: "14px", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
        <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>MONTHLY OPD TREND</div>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={MONTHLY_OPD} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.cardBorder} />
            <XAxis dataKey="month" tick={{ fill: theme.textSec, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: theme.textSec, fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: theme.bg, border: `1px solid ${theme.cardBorder}`, borderRadius: 10, color: theme.text, fontSize: 11 }} />
            <Bar dataKey="count" fill="url(#blueGrad)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1a3a6e" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {[{ label: "Avg OPD / Day", value: "52" }, { label: "Procedures Done", value: "28" }, { label: "Referrals Sent", value: "14" }, { label: "Follow-ups", value: "186" }].map(stat => (
        <div key={stat.label} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 12, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: theme.textSec, fontSize: 12 }}>{stat.label}</span>
          <span style={{ color: theme.text, fontWeight: 700, fontSize: 14 }}>{stat.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const DocProfile = ({ setScreen, setRole, setCurrentScreen, theme, toggleTheme, showToast }: { setScreen: (s: Screen) => void; setRole: (r: Role) => void; setCurrentScreen: (s: Screen) => void; theme: Theme; toggleTheme: () => void; showToast: (msg: string) => void }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    <SectionHeader theme={theme} title="My Profile" subtitle="Project 10 Staff Portal" onBack={() => setScreen("doc_home")} />
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-4">
      {/* Profile Header */}
      <div style={{ background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 20, padding: "20px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, background: "rgba(255,255,255,0.15)", borderRadius: 24, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, border: "3px solid rgba(255,255,255,0.3)" }}>👨‍⚕️</div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Dr. Arjun Mehta</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2 }}>MD, DM Cardiology</div>
        <div style={{ color: "#93c5fd", fontSize: 10, marginTop: 4 }}>MCI Reg: DL/12345 · Exp: 18 years · ⭐ 4.9</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 10 }}>
          <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 10px", color: "#fff", fontSize: 9, fontWeight: 600 }}>Cardiology</span>
          <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 10px", color: "#fff", fontSize: 9, fontWeight: 600 }}>Electrophysiology</span>
        </div>
      </div>

      {/* Settings */}
      {[
        { icon: "🕐", label: "Availability Schedule", sub: "Mon-Fri 9AM-5PM, Sat 9AM-1PM", action: () => showToast("Opening Schedule Editor...") },
        { icon: "🔔", label: "Notification Preferences", sub: "All alerts enabled", action: () => showToast("Opening Notification Settings...") },
        { icon: "🌐", label: "Language", sub: "English, हिंदी", action: () => showToast("Changing Language...") },
        { icon: "🌙", label: "Dark Mode", sub: theme.mode === "dark" ? "On" : "Off", action: toggleTheme },
        { icon: "🔒", label: "Privacy & Security", sub: "2FA Active", action: () => showToast("Opening Security Settings...") },
        { icon: "📞", label: "Emergency Contact", sub: "+91 99999 00001", action: () => showToast("Calling Admin Emergency Line...") },
        { icon: "⭐", label: "My Reviews (128)", sub: "Avg Rating: 4.9/5", action: () => showToast("Viewing Patient Reviews...") },
      ].map(item => (
        <button key={item.label} onClick={item.action} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, width: "100%",
        //  cursor: item.action ? "pointer" : "default", 
         textAlign: "left", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: theme.text, fontSize: 12, fontWeight: 600 }}>{item.label}</div>
            <div style={{ color: theme.textSec, fontSize: 10, marginTop: 1 }}>{item.sub}</div>
          </div>
          {item.label === "Dark Mode" ? (
            <div style={{ width: 32, height: 18, background: theme.mode === "dark" ? "#2563eb" : "#cbd5e1", borderRadius: 10, position: "relative", transition: "0.2s" }}>
              <div style={{ width: 14, height: 14, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: theme.mode === "dark" ? 16 : 2, transition: "0.2s" }} />
            </div>
          ) : (
            <span style={{ color: theme.textSec, fontSize: 14 }}>›</span>
          )}
        </button>
      ))}

      <button onClick={() => { setRole(null); setCurrentScreen("role"); }} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 14, padding: "14px", color: "#fca5a5", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 4, marginBottom: 20 }}>
        🚪 Secure Logout
      </button>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT SCREENS
// ─────────────────────────────────────────────────────────────────────────────

const PatHome = ({ setScreen, theme, showToast }: { setScreen: (s: Screen) => void; theme: Theme; showToast: (msg: string) => void }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    {/* Header */}
    <div style={{ background: theme.headerBg, padding: "16px 16px 24px" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div style={{ color: theme.textSec, fontSize: 10 }}>UHID: P10-P-2024-5891</div>
          <div style={{ color: theme.text, fontWeight: 800, fontSize: 16 }}>Hello, Rajesh! 👋</div>
          <div style={{ color: theme.textSec, fontSize: 10, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
            <span>📍</span> Project 10, Bangalore
          </div>
        </div>
        <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#0ea5e9,#06b6d4)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👤</div>
      </div>
      {/* Upcoming Appointment */}
      <div style={{ background: "rgba(37,99,235,0.25)", border: "1px solid rgba(37,99,235,0.4)", borderRadius: 14, padding: "10px 14px" }}>
        <div style={{ color: "#ffffff", fontSize: 9, fontWeight: 600, marginBottom: 4 }}>📅 UPCOMING APPOINTMENT</div>
        <div style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>Dr. Arjun Mehta — Cardiology</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 2 }}>Tomorrow, 9:00 AM · OPD Room 302</div>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-4">
      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: "🏥", label: "Book OPD", screen: "pat_find_doctor", color: "linear-gradient(135deg,#1a3a6e,#2563eb)" },
          { icon: "📹", label: "Video Consult", screen: "pat_video", color: "linear-gradient(135deg,#0c4a6e,#0ea5e9)" },
          { icon: "💊", label: "Pharmacy", screen: "pat_pharmacy", color: "linear-gradient(135deg,#064e3b,#059669)" },
          { icon: "🧪", label: "Lab Tests", screen: "pat_lab", color: "linear-gradient(135deg,#4c1d95,#7c3aed)" },
          { icon: "📋", label: "My Records", screen: "pat_records", color: "linear-gradient(135deg,#78350f,#d97706)" },
          { icon: "📊", label: "Vitals", screen: "pat_vitals", color: "linear-gradient(135deg,#134e4a,#14b8a6)" },
        ].map(({ icon, label, screen, color }) => (
          <button key={label} onClick={() => setScreen(screen as Screen)}
            style={{ background: color, border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: "14px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 24 }}>{icon}</span>
            <span style={{ color: "#fff", fontSize: 9.5, fontWeight: 600, textAlign: "center" }}>{label}</span>
          </button>
        ))}
      </div>

      {/* SOS Button */}
      <button onClick={() => setScreen("pat_sos")} style={{ background: "linear-gradient(135deg,#dc2626,#ef4444)", border: "none", borderRadius: 18, padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", boxShadow: "0 0 20px rgba(220,38,38,0.4)", animation: "pulse-glow 2s infinite" }}>
        <span style={{ fontSize: 28 }}>🚑</span>
        <div style={{ textAlign: "left" }}>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>EMERGENCY SOS</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>Tap for immediate ambulance assistance</div>
        </div>
      </button>

      {/* Health Tip */}
      <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: "14px" }}>
        <div style={{ color: "#34d399", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>💡 HEALTH TIP OF THE DAY</div>
        <div style={{ color: theme.text, fontSize: 12, fontWeight: 600 }}>Stay Hydrated!</div>
        <div style={{ color: theme.textSec, fontSize: 10, marginTop: 4 }}>Drinking 8-10 glasses of water daily helps maintain blood pressure and reduces cardiac risk by up to 25%.</div>
      </div>

      {/* News & Events */}
      <div>
        <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>NEWS & EVENTS</div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto" }} className="no-scrollbar">
          {[
            { title: "Free Diabetes Camp", date: "Feb 22", color: "#2563eb" },
            { title: "Blood Donation Drive", date: "Feb 25", color: "#dc2626" },
            { title: "Health Talk: Cardiology", date: "Mar 1", color: "#059669" },
          ].map(e => (
            <button onClick={() => showToast(`Opening article: ${e.title}`)} key={e.title} style={{ background: `${e.color}20`, border: `1px solid ${e.color}40`, borderRadius: 14, padding: "10px 14px", minWidth: 130, flexShrink: 0, textAlign: "left", cursor: "pointer" }}>
              <div style={{ color: theme.text, fontSize: 11, fontWeight: 700 }}>{e.title}</div>
              <div style={{ color: theme.textSec, fontSize: 9, marginTop: 4 }}>📅 {e.date}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const PatFindDoctor = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: Theme }) => {
  const [selDept, setSelDept] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full" style={{ background: theme.bg }}>
      <SectionHeader theme={theme} title="Find Doctor" subtitle="Book OPD Appointment" onBack={() => setScreen("pat_home")} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-4">
        {/* Search */}
        <input placeholder="🔍 Search doctor or speciality..." style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 12, padding: "10px 14px", color: theme.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />

        {/* Departments Grid */}
        <div>
          <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>DEPARTMENTS</div>
          <div className="grid grid-cols-4 gap-2">
            {DEPARTMENTS.map(d => (
              <button key={d.name} onClick={() => setSelDept(d.name)}
                style={{ background: selDept === d.name ? `${d.color}30` : theme.cardBg, border: `1px solid ${selDept === d.name ? d.color : theme.cardBorder}`, borderRadius: 14, padding: "10px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
                <span style={{ fontSize: 20 }}>{d.icon}</span>
                <span style={{ color: theme.text, fontSize: 8.5, fontWeight: 600, textAlign: "center", lineHeight: "1.2" }}>{d.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Doctors List */}
        <div>
          <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
            {selDept ? `${selDept.toUpperCase()} SPECIALISTS` : "ALL DOCTORS"}
          </div>
          <div className="flex flex-col gap-3">
            {DOCTORS_LIST.filter(d => !selDept || d.dept === selDept || true).map(doc => (
              <div key={doc.id} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: "14px", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>👨‍⚕️</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: theme.text, fontWeight: 700, fontSize: 12 }}>{doc.name}</div>
                    <div style={{ color: theme.textSec, fontSize: 10 }}>{doc.dept} · {doc.exp} exp</div>
                    <div style={{ color: "#fbbf24", fontSize: 10 }}>⭐ {doc.rating} · Fee: {doc.fee}</div>
                  </div>
                  <span style={{ background: doc.available ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)", color: doc.available ? "#34d399" : "#fca5a5", fontSize: 9, padding: "3px 8px", borderRadius: 8, fontWeight: 600 }}>
                    {doc.available ? "Available" : "Full"}
                  </span>
                </div>
                {doc.available && (
                  <button onClick={() => setScreen("pat_book_slot")} style={{ width: "100%", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 10, padding: "9px 0", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    Book Appointment →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PatBookSlot = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: Theme }) => {
  const [selSlot, setSelSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const slots = { morning: ["8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM"], afternoon: ["2:00 PM", "2:30 PM", "3:00 PM"], evening: ["4:00 PM", "4:30 PM", "5:00 PM"] };

  if (booked) return (
    <div className="flex flex-col h-full items-center justify-center px-6 gap-6" style={{ background: theme.bg }}>
      <div style={{ fontSize: 72 }}>✅</div>
      <div style={{ color: "#34d399", fontWeight: 800, fontSize: 22, textAlign: "center" }}>Appointment Confirmed!</div>
      <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 18, padding: "20px", width: "100%", textAlign: "center" }}>
        <div style={{ color: theme.textSec, fontSize: 10, marginBottom: 4 }}>BOOKING ID</div>
        <div style={{ color: theme.text, fontWeight: 800, fontSize: 18 }}>P10-APT-2025-{Math.floor(Math.random() * 9000 + 1000)}</div>
        <div style={{ color: theme.text, fontSize: 12, marginTop: 10 }}>Dr. Arjun Mehta · Cardiology</div>
        <div style={{ color: theme.accent, fontSize: 11, marginTop: 4 }}>Tomorrow · {selSlot} · OPD 302</div>
        <div style={{ color: theme.textSec, fontSize: 10, marginTop: 6 }}>Fee: ₹800 (Pay at counter)</div>
      </div>
      <button onClick={() => setScreen("pat_home")} style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 14, padding: "14px 32px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Go to Home</button>
    </div>
  );

  return (
    <div className="flex flex-col h-full" style={{ background: theme.bg }}>
      <SectionHeader theme={theme} title="Book Slot" subtitle="Dr. Arjun Mehta · Cardiology" onBack={() => setScreen("pat_find_doctor")} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-4">
        {/* Doctor Info */}
        <div style={{ background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 16, padding: "14px", display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ fontSize: 36 }}>👨‍⚕️</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>Dr. Arjun Mehta</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>MD, DM Cardiology · 18 Years Exp</div>
            <div style={{ color: "#fbbf24", fontSize: 10, marginTop: 2 }}>⭐ 4.9 · 500+ Patients</div>
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>SELECT DATE</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto" }} className="no-scrollbar">
            {["19 Feb\nWed", "20 Feb\nThu", "21 Feb\nFri", "24 Feb\nMon", "25 Feb\nTue"].map((d, i) => (
              <button key={i} style={{ background: i === 1 ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : theme.cardBg, border: `1px solid ${i === 1 ? "#2563eb" : theme.cardBorder}`, borderRadius: 12, padding: "8px 14px", cursor: "pointer", flexShrink: 0, textAlign: "center" }}>
                {d.split("\n").map((line, j) => <div key={j} style={{ color: i === 1 ? "#fff" : theme.text, fontSize: j === 0 ? 12 : 9, fontWeight: j === 0 ? 700 : 400 }}>{line}</div>)}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        {(Object.entries(slots) as [string, string[]][]).map(([session, times]) => (
          <div key={session}>
            <div style={{ color: theme.textSec, fontSize: 10, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>🌅 {session}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {times.map(t => (
                <button key={t} onClick={() => setSelSlot(t)}
                  style={{ background: selSlot === t ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : theme.cardBg, border: `1px solid ${selSlot === t ? "#2563eb" : theme.cardBorder}`, borderRadius: 10, padding: "8px 12px", cursor: "pointer", color: selSlot === t ? "#fff" : theme.text, fontSize: 11, fontWeight: 600 }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button onClick={() => selSlot && setBooked(true)} disabled={!selSlot}
          style={{ background: selSlot ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : theme.inputBg, border: "none", borderRadius: 14, padding: "14px 0", color: selSlot ? "#fff" : theme.textSec, fontSize: 14, fontWeight: 700, cursor: selSlot ? "pointer" : "not-allowed", opacity: selSlot ? 1 : 0.5, marginTop: 8, marginBottom: 16 }}>
          {selSlot ? `Confirm Slot — ${selSlot}` : "Select a Time Slot"}
        </button>
      </div>
    </div>
  );
};

const PatAppointments = ({ setScreen, theme, showToast }: { setScreen: (s: Screen) => void; theme: Theme; showToast: (msg: string) => void }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    <SectionHeader theme={theme} title="My Appointments" subtitle="Upcoming & Past" onBack={() => setScreen("pat_home")} />
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
      <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700 }}>UPCOMING</div>
      {[
        { doctor: "Dr. Arjun Mehta", dept: "Cardiology", date: "20 Feb 2025", time: "9:00 AM", room: "OPD-302", status: "Confirmed", id: "P10-APT-2025-4521" },
        { doctor: "Dr. Sunita Rao", dept: "Neurology", date: "28 Feb 2025", time: "11:00 AM", room: "OPD-210", status: "Confirmed", id: "P10-APT-2025-4589" },
      ].map(a => (
        <div key={a.id} style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 16, padding: "14px" }}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div style={{ color: theme.text, fontWeight: 700, fontSize: 12 }}>{a.doctor}</div>
              <div style={{ color: theme.textSec, fontSize: 10 }}>{a.dept} · {a.room}</div>
            </div>
            <span style={{ background: "rgba(16,185,129,0.2)", color: "#34d399", fontSize: 9, padding: "3px 8px", borderRadius: 8, fontWeight: 600 }}>✓ {a.status}</span>
          </div>
          <div style={{ color: theme.textSec, fontSize: 10, marginBottom: 10 }}>📅 {a.date} · ⏰ {a.time} · 🪪 {a.id}</div>
          <div className="flex gap-2">
            <button onClick={() => showToast("Request to reschedule sent")} style={{ flex: 1, background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 10, padding: "7px 0", color: theme.accent, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>🔄 Reschedule</button>
            <button onClick={() => showToast("Cancellation not allowed < 24hrs")} style={{ flex: 1, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "7px 0", color: "#fca5a5", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>✕ Cancel</button>
            <button onClick={() => setScreen("pat_video")} style={{ flex: 1, background: theme.accent, border: `1px solid ${theme.accent}`, borderRadius: 10, padding: "7px 0", color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>📹 Join</button>
          </div>
        </div>
      ))}

      <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginTop: 8 }}>PAST VISITS</div>
      {[
        { doctor: "Dr. Arjun Mehta", dept: "Cardiology", date: "15 Jan 2025", diag: "Hypertension Review" },
        { doctor: "Dr. Meera Nair", dept: "Pediatrics", date: "02 Dec 2024", diag: "Routine Checkup" },
      ].map((a, i) => (
        <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 14, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
          <div>
            <div style={{ color: theme.text, fontSize: 11, fontWeight: 600 }}>{a.doctor}</div>
            <div style={{ color: theme.textSec, fontSize: 9 }}>{a.dept} · {a.date}</div>
            <div style={{ color: theme.textSec, fontSize: 9 }}>{a.diag}</div>
          </div>
          <button onClick={() => showToast("Downloading visit summary...")} style={{ background: theme.inputBg, border: "none", borderRadius: 10, padding: "6px 10px", color: theme.accent, fontSize: 9, fontWeight: 600, cursor: "pointer" }}>📄 View</button>
        </div>
      ))}
    </div>
  </div>
);

const PatRecords = ({ setScreen, theme, showToast }: { setScreen: (s: Screen) => void; theme: Theme; showToast: (msg: string) => void }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    <SectionHeader theme={theme} title="My Health Records" subtitle="EMR · Prescriptions · Lab Reports" onBack={() => setScreen("pat_home")} />
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-4">
      {/* Upload */}
      <button onClick={() => showToast("Opening file picker...")} style={{ width: "100%", background: "rgba(37,99,235,0.1)", border: "2px dashed rgba(37,99,235,0.3)", borderRadius: 16, padding: "16px", textAlign: "center", cursor: "pointer" }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>📁</div>
        <div style={{ color: theme.accent, fontSize: 12, fontWeight: 600 }}>Upload Documents</div>
        <div style={{ color: theme.textSec, fontSize: 10, marginTop: 2 }}>PDF, JPG, PNG · Max 10MB</div>
      </button>

      {/* Prescriptions */}
      <div>
        <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>PRESCRIPTIONS</div>
        {[
          { date: "15 Jan 2025", doc: "Dr. Arjun Mehta", meds: "Amlodipine, Pantoprazole, Aspirin" },
          { date: "02 Dec 2024", doc: "Dr. Meera Nair", meds: "Paracetamol, Cetirizine, Vitamin C" },
        ].map((rx, i) => (
          <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 14, padding: "12px 14px", marginBottom: 8, boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
            <div className="flex justify-between items-start">
              <div>
                <div style={{ color: theme.text, fontSize: 12, fontWeight: 600 }}>Rx — {rx.date}</div>
                <div style={{ color: theme.textSec, fontSize: 10 }}>{rx.doc}</div>
                <div style={{ color: theme.textSec, fontSize: 9, marginTop: 2 }}>{rx.meds}</div>
              </div>
              <button onClick={() => showToast("Downloading Prescription PDF...")} style={{ background: theme.inputBg, border: "none", borderRadius: 10, padding: "6px 10px", color: theme.accent, fontSize: 9, fontWeight: 600, cursor: "pointer" }}>⬇ PDF</button>
            </div>
          </div>
        ))}
      </div>

      {/* Lab Reports */}
      <div>
        <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>LAB REPORTS</div>
        {[
          { date: "10 Feb 2025", test: "CBC, LFT, KFT", status: "Ready" },
          { date: "15 Jan 2025", test: "HbA1c, Lipid Profile", status: "Ready" },
          { date: "05 Dec 2024", test: "Thyroid Profile", status: "Ready" },
        ].map((r, i) => (
          <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 14, padding: "12px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
            <div>
              <div style={{ color: theme.text, fontSize: 11, fontWeight: 600 }}>{r.test}</div>
              <div style={{ color: theme.textSec, fontSize: 9 }}>🗓 {r.date}</div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", fontSize: 9, padding: "3px 8px", borderRadius: 8, fontWeight: 600 }}>✓ {r.status}</span>
              <button onClick={() => showToast("Opening report viewer...")} style={{ background: theme.inputBg, border: "none", borderRadius: 10, padding: "6px 10px", color: theme.accent, fontSize: 9, fontWeight: 600, cursor: "pointer" }}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PatLab = ({ setScreen, theme, showToast }: { setScreen: (s: Screen) => void; theme: Theme; showToast: (msg: string) => void }) => {
  const [cart, setCart] = useState<string[]>([]);
  const [trackMode, setTrackMode] = useState(false);

  if (trackMode) return (
    <div className="flex flex-col h-full" style={{ background: theme.bg }}>
      <SectionHeader theme={theme} title="Track Sample" subtitle="Order: P10-LAB-2025-0891" onBack={() => setTrackMode(false)} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        {[{ step: "Sample Collected", done: true }, { step: "In Transit to Lab", done: true }, { step: "Processing", done: true }, { step: "Report Ready", done: false }].map((s, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.done ? "linear-gradient(135deg,#059669,#10b981)" : theme.inputBg, border: `2px solid ${s.done ? "#10b981" : theme.inputBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: s.done ? "#fff" : theme.textSec, fontSize: 14, flexShrink: 0 }}>
              {s.done ? "✓" : i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: s.done ? theme.text : theme.textSec, fontSize: 12, fontWeight: s.done ? 700 : 400 }}>{s.step}</div>
            </div>
            {i < arr.length - 1 && <div style={{ position: "absolute", left: 18, marginTop: 36, width: 2, height: 32, background: s.done ? "#10b981" : theme.inputBg }} />}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full" style={{ background: theme.bg }}>
      <SectionHeader theme={theme} title="Lab Tests" subtitle="Book · Track · Download" onBack={() => setScreen("pat_home")} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
        <button onClick={() => setTrackMode(true)} style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 14, padding: "10px 14px", color: "#34d399", fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
          🔍 Track Existing Order: P10-LAB-2025-0891 →
        </button>

        <div>
          <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>TEST CATALOG</div>
          {LAB_TESTS.map(t => (
            <div key={t.name} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 14, padding: "12px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10, boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: theme.text, fontSize: 11, fontWeight: 600 }}>{t.name}</div>
                <div style={{ color: theme.textSec, fontSize: 9, marginTop: 2 }}>{t.category} · ⏱ {t.time} · {t.price}</div>
              </div>
              <button onClick={() => cart.includes(t.name) ? setCart(c => c.filter(n => n !== t.name)) : setCart(c => [...c, t.name])}
                style={{ background: cart.includes(t.name) ? "rgba(16,185,129,0.2)" : theme.inputBg, border: `1px solid ${cart.includes(t.name) ? "rgba(16,185,129,0.4)" : "transparent"}`, borderRadius: 10, padding: "6px 10px", color: cart.includes(t.name) ? "#34d399" : theme.accent, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>
                {cart.includes(t.name) ? "✓ Added" : "+ Add"}
              </button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{ background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 16, padding: "14px", marginTop: 4 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{cart.length} Test(s) Selected</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginBottom: 10 }}>Home Collection Available · Free Pick-up</div>
            <button onClick={() => showToast("Proceeding to checkout (Demo)")} style={{ width: "100%", background: "#fff", border: "none", borderRadius: 10, padding: "10px 0", color: "#1d4ed8", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Book Home Collection →</button>
          </div>
        )}
      </div>
    </div>
  );
};

const PatPharmacy = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: Theme }) => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [ordered, setOrdered] = useState(false);
  const total = Object.entries(cart).reduce((sum, [name, qty]) => {
    const med = MEDICINES.find(m => m.name === name);
    return sum + (med ? parseInt(med.price.replace("₹", "")) * qty : 0);
  }, 0);

  if (ordered) return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-5" style={{ background: theme.bg }}>
      <div style={{ fontSize: 60 }}>🛵</div>
      <div style={{ color: "#34d399", fontWeight: 800, fontSize: 20, textAlign: "center" }}>Order Placed!</div>
      <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 18, padding: "18px", width: "100%", textAlign: "center" }}>
        <div style={{ color: theme.textSec, fontSize: 10 }}>ORDER ID</div>
        <div style={{ color: theme.text, fontWeight: 800, fontSize: 18, marginTop: 2 }}>P10-PH-2025-{Math.floor(Math.random() * 9000 + 1000)}</div>
        <div className="flex justify-around mt-3">
          {["Placed ✓", "Packed", "Delivery", "Delivered"].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: i === 0 ? "#10b981" : theme.inputBg, margin: "0 auto 4px" }} />
              <div style={{ color: i === 0 ? "#34d399" : theme.textSec, fontSize: 8 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => { setOrdered(false); setCart({}); }} style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 14, padding: "12px 28px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Continue Shopping</button>
    </div>
  );

  return (
    <div className="flex flex-col h-full" style={{ background: theme.bg }}>
      <SectionHeader theme={theme} title="Pharmacy" subtitle="Order Medicines · Home Delivery" onBack={() => setScreen("pat_home")} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
        <input placeholder="🔍 Search medicines..." style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 12, padding: "10px 14px", color: theme.text, fontSize: 12, outline: "none", boxSizing: "border-box" }} />

        {MEDICINES.map(m => (
          <div key={m.name} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: theme.text, fontSize: 12, fontWeight: 600 }}>{m.name}</div>
              <div style={{ color: theme.textSec, fontSize: 9 }}>{m.category} · {m.price}/strip</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {cart[m.name] ? (
                <>
                  <button onClick={() => setCart(c => ({ ...c, [m.name]: Math.max(0, (c[m.name] || 0) - 1) }))} style={{ background: "rgba(239,68,68,0.2)", border: "none", borderRadius: 8, width: 26, height: 26, color: "#fca5a5", fontSize: 14, cursor: "pointer" }}>−</button>
                  <span style={{ color: theme.text, fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: "center" }}>{cart[m.name]}</span>
                  <button onClick={() => setCart(c => ({ ...c, [m.name]: (c[m.name] || 0) + 1 }))} style={{ background: "rgba(16,185,129,0.2)", border: "none", borderRadius: 8, width: 26, height: 26, color: "#34d399", fontSize: 14, cursor: "pointer" }}>+</button>
                </>
              ) : (
                <button onClick={() => setCart(c => ({ ...c, [m.name]: 1 }))} style={{ background: theme.inputBg, border: "none", borderRadius: 10, padding: "6px 10px", color: theme.accent, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>+ Add</button>
              )}
            </div>
          </div>
        ))}

        {total > 0 && (
          <div style={{ background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 16, padding: "14px", marginTop: 4 }}>
            <div className="flex justify-between mb-3">
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{Object.keys(cart).filter(k => cart[k] > 0).length} Items</span>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>₹{total}</span>
            </div>
            <button onClick={() => setOrdered(true)} style={{ width: "100%", background: "#fff", border: "none", borderRadius: 10, padding: "11px 0", color: "#1d4ed8", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Place Order · ₹{total} →
            </button>
          </div>
        )}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
};

const PatSOS = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: Theme }) => {
  const [triggered, setTriggered] = useState(false);

  return (
    <div className="flex flex-col h-full" style={{ background: theme.bg }}>
      <SectionHeader theme={theme} title="Emergency SOS" subtitle="24/7 Emergency Services" onBack={() => setScreen("pat_home")} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-4 items-center">
        {/* SOS Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button onClick={() => setTriggered(!triggered)}
            style={{ width: 130, height: 130, borderRadius: "50%", background: triggered ? "linear-gradient(135deg,#16a34a,#22c55e)" : "linear-gradient(135deg,#dc2626,#ef4444)", border: `4px solid ${triggered ? "#22c55e" : "#ef4444"}`, fontSize: 40, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${triggered ? "rgba(34,197,94,0.5)" : "rgba(220,38,38,0.6)"}`, animation: "pulse-glow 1.5s infinite", gap: 4 }}>
            <span>{triggered ? "✓" : "🚑"}</span>
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>{triggered ? "CALLED" : "SOS"}</span>
          </button>
          <div style={{ color: triggered ? "#34d399" : "#fca5a5", fontSize: 13, fontWeight: 700, textAlign: "center" }}>
            {triggered ? "✓ Ambulance Dispatched · ETA 8 min" : "Tap for Emergency Ambulance"}
          </div>
        </div>

        {triggered && (
          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 16, padding: "14px", width: "100%" }}>
            <div style={{ color: "#34d399", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>🚑 AMBULANCE EN ROUTE</div>
            <div style={{ color: theme.text, fontSize: 12 }}>Vehicle: KA-01-AM-4521</div>
            <div style={{ color: theme.textSec, fontSize: 10, marginTop: 2 }}>Driver: Suresh · +91 98001 23456</div>
            <div style={{ background: theme.inputBg, borderRadius: 12, padding: "12px", marginTop: 10, textAlign: "center" }}>
              <div style={{ color: theme.textSec, fontSize: 9 }}>MAP PLACEHOLDER</div>
              <div style={{ color: theme.textSec, fontSize: 40 }}>🗺️</div>
              <div style={{ color: theme.textSec, fontSize: 9 }}>Real-time tracking active</div>
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        <div style={{ width: "100%" }}>
          <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>QUICK EMERGENCY CALLS</div>
          {[
            { label: "Project 10 ER", num: "080-1234-5678", icon: "🏥" },
            { label: "National Ambulance", num: "108", icon: "🚑" },
            { label: "Emergency (Police)", num: "100", icon: "🚔" },
            { label: "Personal: Meera (Wife)", num: "+91 98765 11111", icon: "👩" },
          ].map(c => (
            <div key={c.label} style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>{c.icon}</span>
                <div>
                  <div style={{ color: theme.text, fontSize: 11, fontWeight: 600 }}>{c.label}</div>
                  <div style={{ color: "#fca5a5", fontSize: 10 }}>{c.num}</div>
                </div>
              </div>
              <button style={{ background: "rgba(239,68,68,0.3)", border: "none", borderRadius: 10, padding: "7px 12px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>📞</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PatVideo = ({ setScreen, theme, showToast }: { setScreen: (s: Screen) => void; theme: Theme; showToast: (msg: string) => void }) => {
  const [inCall, setInCall] = useState(false);
  if (inCall) return (
    <div style={{ background: "#000", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, background: "linear-gradient(135deg,#0a1628,#0c4a6e)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <div style={{ fontSize: 56 }}>👨‍⚕️</div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Dr. Arjun Mehta</div>
        <div style={{ color: "#34d399", fontSize: 11 }}>● Connected · 00:02:18</div>
        <div style={{ color: "rgba(147,197,253,0.6)", fontSize: 10, marginTop: 6, textAlign: "center", padding: "0 20px" }}>Cardiology · Project 10</div>
      </div>
      <div style={{ background: "rgba(0,0,0,0.8)", padding: "16px 24px 20px", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {["🎤", "📹", "📞", "💬"].map((icon, i) => (
          <button key={i} onClick={() => { if (i === 2) setInCall(false); }} style={{ background: i === 2 ? "#ef4444" : "#374151", border: "none", borderRadius: "50%", width: i === 2 ? 56 : 44, height: i === 2 ? 56 : 44, fontSize: i === 2 ? 22 : 18, cursor: "pointer" }}>{icon}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full" style={{ background: theme.bg }}>
      <SectionHeader theme={theme} title="Video Consultation" subtitle="Teleconsult · Project 10" onBack={() => setScreen("pat_home")} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
        <div style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.3)", borderRadius: 16, padding: "16px" }}>
          <div style={{ color: theme.textSec, fontSize: 10, fontWeight: 700, marginBottom: 8 }}>SCHEDULED SESSION</div>
          <div className="flex items-center gap-3 mb-3">
            <div style={{ fontSize: 36 }}>👨‍⚕️</div>
            <div>
              <div style={{ color: theme.text, fontWeight: 700, fontSize: 14 }}>Dr. Arjun Mehta</div>
              <div style={{ color: theme.textSec, fontSize: 10 }}>Cardiology · VC-2025-4521</div>
              <div style={{ color: "#fbbf24", fontSize: 10 }}>Today · 5:00 PM · 15 mins</div>
            </div>
          </div>
          <button onClick={() => setInCall(true)} style={{ width: "100%", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 12, padding: "12px 0", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            📹 Join Video Call Now
          </button>
        </div>

        {/* Post-call prescription */}
        <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: "14px" }}>
          <div style={{ color: "#34d399", fontSize: 10, fontWeight: 700, marginBottom: 6 }}>LAST CONSULTATION — Rx</div>
          <div style={{ color: theme.text, fontSize: 11, fontWeight: 600 }}>Dr. Arjun Mehta · 15 Jan 2025</div>
          <div style={{ color: theme.textSec, fontSize: 10, marginTop: 4 }}>Amlodipine 5mg · 1-0-1 · 30D<br />Pantoprazole 40mg · 0-0-1 · 30D</div>
          <button onClick={() => showToast("Downloading Prescription PDF...")} style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "7px 14px", color: "#34d399", fontSize: 10, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>⬇ Download Rx PDF</button>
        </div>
      </div>
    </div>
  );
};

const PatVitals = ({ setScreen, theme, showToast }: { setScreen: (s: Screen) => void; theme: Theme; showToast: (msg: string) => void }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    <SectionHeader theme={theme} title="Health Vitals Tracker" subtitle="Log · Monitor · Analyze" onBack={() => setScreen("pat_home")} />
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-4">
      {/* Log Today */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: "14px", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
        <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 10 }}>LOG TODAY'S READINGS</div>
        <div className="grid grid-cols-2 gap-3">
          {["BP (Systolic)", "BP (Diastolic)", "Blood Sugar (F)", "Blood Sugar (PP)", "SpO₂ (%)", "Weight (kg)"].map(v => (
            <div key={v}>
              <label style={{ color: theme.textSec, fontSize: 9, display: "block", marginBottom: 3 }}>{v}</label>
              <input type="number" style={{ width: "100%", background: theme.inputBg, border: `1px solid ${theme.inputBorder}`, borderRadius: 10, padding: "8px 10px", color: theme.text, fontSize: 13, fontWeight: 600, outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
        </div>
        <button onClick={() => showToast("Vitals saved successfully!")} style={{ width: "100%", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 12, padding: "11px 0", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 12 }}>💾 Save Today's Readings</button>
      </div>

      {/* BP Chart */}
      <div style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: "14px", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
        <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 10 }}>BLOOD PRESSURE TREND</div>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={BP_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.cardBorder} />
            <XAxis dataKey="day" tick={{ fill: theme.textSec, fontSize: 8 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: theme.textSec, fontSize: 8 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: theme.bg, border: `1px solid ${theme.cardBorder}`, borderRadius: 8, color: theme.text, fontSize: 10 }} />
            <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 3 }} name="Systolic" />
            <Line type="monotone" dataKey="diastolic" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb", r: 3 }} name="Diastolic" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Reminders */}
      <div>
        <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>MEDICATION REMINDERS</div>
        {[{ med: "Amlodipine 5mg", time: "8:00 AM · Daily" }, { med: "Metformin 500mg", time: "After Lunch & Dinner" }].map((r, i) => (
          <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 12, padding: "10px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
            <div>
              <div style={{ color: theme.text, fontSize: 11, fontWeight: 600 }}>💊 {r.med}</div>
              <div style={{ color: theme.textSec, fontSize: 9 }}>⏰ {r.time}</div>
            </div>
            <button onClick={() => showToast(`Edit reminder: ${r.med}`)} style={{ background: "rgba(37,99,235,0.2)", border: "none", borderRadius: 10, padding: "5px 10px", color: theme.accent, fontSize: 9, fontWeight: 600, cursor: "pointer" }}>Edit</button>
          </div>
        ))}
        <button onClick={() => showToast("Opening reminder form...")} style={{ width: "100%", background: theme.inputBg, border: "1px dashed rgba(147,197,253,0.2)", borderRadius: 12, padding: "10px 0", color: theme.accent, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>+ Add Reminder</button>
      </div>
    </div>
  </div>
);

const PatBilling = ({ setScreen, theme, showToast }: { setScreen: (s: Screen) => void; theme: Theme; showToast: (msg: string) => void }) => {
  const [paid, setPaid] = useState<string[]>([]);

  return (
    <div className="flex flex-col h-full" style={{ background: theme.bg }}>
      <SectionHeader theme={theme} title="Billing & Payments" subtitle="Outstanding · History · Insurance" onBack={() => setScreen("pat_home")} />
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-4">
        {/* Outstanding */}
        <div>
          <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>OUTSTANDING BILLS</div>
          {[
            { id: "P10-BILL-2025-0421", desc: "OPD Consultation — Dr. Arjun Mehta", amount: "₹800", date: "15 Jan 2025" },
            { id: "P10-BILL-2025-0389", desc: "Lab Tests — CBC, LFT, KFT", amount: "₹1,550", date: "10 Feb 2025" },
          ].map(b => (
            <div key={b.id} style={{ background: paid.includes(b.id) ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", border: `1px solid ${paid.includes(b.id) ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.3)"}`, borderRadius: 14, padding: "12px 14px", marginBottom: 6 }}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div style={{ color: theme.text, fontSize: 11, fontWeight: 600 }}>{b.desc}</div>
                  <div style={{ color: theme.textSec, fontSize: 9 }}>{b.id} · {b.date}</div>
                </div>
                <span style={{ color: paid.includes(b.id) ? "#34d399" : "#fbbf24", fontWeight: 800, fontSize: 14 }}>{b.amount}</span>
              </div>
              {!paid.includes(b.id) && (
                <div className="flex gap-2">
                  {["UPI", "Card", "Net Banking"].map(m => (
                    <button key={m} onClick={() => setPaid(p => [...p, b.id])}
                      style={{ flex: 1, background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)", borderRadius: 10, padding: "7px 0", color: "#93c5fd", fontSize: 9, fontWeight: 600, cursor: "pointer" }}>{m}</button>
                  ))}
                </div>
              )}
              {paid.includes(b.id) && <div style={{ color: "#34d399", fontSize: 10, fontWeight: 600 }}>✓ Payment Successful</div>}
            </div>
          ))}
        </div>

        {/* Insurance */}
        <div style={{ background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 16, padding: "16px" }}>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginBottom: 2 }}>🛡️ INSURANCE</div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Star Health Plus</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 4 }}>Policy: P10-2024-78923 · ₹5 Lakh Coverage</div>
          <div style={{ color: "#93c5fd", fontSize: 10, marginTop: 2 }}>Valid: March 2026 · Cashless: ✓</div>
        </div>

        {/* Payment History */}
        <div>
          <div style={{ color: theme.accent, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>PAYMENT HISTORY</div>
          {[
            { desc: "OPD — Dr. Mehta", amount: "₹800", date: "15 Jan", mode: "UPI" },
            { desc: "Pharmacy Order", amount: "₹340", date: "08 Jan", mode: "Card" },
            { desc: "Lab Tests", amount: "₹650", date: "01 Jan", mode: "NetBanking" },
          ].map((p, i) => (
            <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 12, padding: "10px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
              <div>
                <div style={{ color: theme.text, fontSize: 11 }}>{p.desc}</div>
                <div style={{ color: theme.textSec, fontSize: 9 }}>{p.date} · {p.mode}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span style={{ color: "#34d399", fontWeight: 700, fontSize: 12 }}>{p.amount}</span>
                <button onClick={() => showToast("Receipt downloaded")} style={{ background: "transparent", border: "none", color: theme.accent, fontSize: 9, cursor: "pointer" }}>Receipt</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PatNotifications = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: Theme }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    <SectionHeader theme={theme} title="Notifications" subtitle="Reminders & Alerts" onBack={() => setScreen("pat_home")} />
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
      {PAT_NOTIFICATIONS.map((n, i) => (
        <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 14, padding: "12px 14px", display: "flex", gap: 10, boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>{n.type === "reminder" ? "📅" : n.type === "report" ? "🧪" : n.type === "medicine" ? "💊" : "🏥"}</div>
          <div>
            <div style={{ color: theme.text, fontWeight: 700, fontSize: 12 }}>{n.title}</div>
            <div style={{ color: theme.textSec, fontSize: 10, marginTop: 2 }}>{n.msg}</div>
            <div style={{ color: theme.textSec, fontSize: 9, marginTop: 4 }}>{n.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PatFamily = ({ setScreen, theme, showToast }: { setScreen: (s: Screen) => void; theme: Theme; showToast: (msg: string) => void }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    <SectionHeader theme={theme} title="Family Members" subtitle="Manage Dependents" onBack={() => setScreen("pat_home")} />
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-3">
      {FAMILY_MEMBERS.map(f => (
        <div key={f.uhid} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 16, padding: "14px", boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#0c4a6e,#0ea5e9)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>👤</div>
            <div>
              <div style={{ color: theme.text, fontWeight: 700, fontSize: 13 }}>{f.name}</div>
              <div style={{ color: theme.textSec, fontSize: 10 }}>{f.relation} · {f.age} yrs · {f.blood}</div>
              <div style={{ color: theme.textSec, fontSize: 9 }}>UHID: {f.uhid}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setScreen("pat_find_doctor")} style={{ flex: 1, background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)", borderRadius: 10, padding: "8px 0", color: "#93c5fd", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>🏥 Book Appt</button>
            <button onClick={() => showToast(`Accessing records for ${f.name}`)} style={{ flex: 1, background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 10, padding: "8px 0", color: "#a78bfa", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>📋 Records</button>
          </div>
        </div>
      ))}
      <button onClick={() => showToast("Opening Add Family Member form")} style={{ background: theme.inputBg, border: "2px dashed rgba(147,197,253,0.2)", borderRadius: 16, padding: "14px 0", color: theme.accent, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Add Family Member</button>
    </div>
  </div>
);

const PatProfile = ({ setScreen, setRole, setCurrentScreen, theme, toggleTheme, showToast }: { setScreen: (s: Screen) => void; setRole: (r: Role) => void; setCurrentScreen: (s: Screen) => void; theme: Theme; toggleTheme: () => void; showToast: (msg: string) => void }) => (
  <div className="flex flex-col h-full" style={{ background: theme.bg }}>
    <SectionHeader theme={theme} title="My Profile" subtitle="Project 10 Patient Portal" onBack={() => setScreen("pat_home")} />
    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 flex flex-col gap-4">
      <div style={{ background: "linear-gradient(135deg,#0c4a6e,#0ea5e9)", borderRadius: 20, padding: "20px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, background: "rgba(255,255,255,0.15)", borderRadius: 24, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, border: "3px solid rgba(255,255,255,0.3)" }}>👤</div>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>Rajesh Sharma</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 2 }}>UHID: P10-P-2024-5891</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "3px 10px", color: "#fff", fontSize: 9 }}>B+ Blood</span>
          <span style={{ background: "rgba(239,68,68,0.3)", borderRadius: 8, padding: "3px 10px", color: "#fff", fontSize: 9 }}>Hypertension</span>
          <span style={{ background: "rgba(245,158,11,0.3)", borderRadius: 8, padding: "3px 10px", color: "#fff", fontSize: 9 }}>Diabetic</span>
        </div>
      </div>

      {[
        { icon: "👤", label: "Personal Info", sub: "Rajesh Sharma · Male · 52 yrs", action: () => showToast("Opening Profile Editor...") },
        { icon: "🩸", label: "Blood Group & Allergies", sub: "B+ · Penicillin allergy", action: () => showToast("Opening Medical Details...") },
        { icon: "📋", label: "Chronic Conditions", sub: "Hypertension, Type 2 DM", action: () => showToast("Opening Conditions Manager...") },
        { icon: "🆘", label: "Emergency Contact", sub: "Meera Sharma · +91 98765 11111", action: () => showToast("Calling Emergency Contact...") },
        { icon: "🌐", label: "Preferred Language", sub: "English, हिंदी", action: () => showToast("Changing Language...") },
        { icon: "🌙", label: "Dark Mode", sub: theme.mode === "dark" ? "On" : "Off", action: toggleTheme },
        { icon: "🔔", label: "Notification Settings", sub: "All alerts enabled", action: () => showToast("Opening Notification Settings...") },
        { icon: "🔒", label: "Privacy & Security", sub: "Biometric active", action: () => showToast("Opening Security Settings...") },
      ].map(item => (
        <button key={item.label} onClick={item.action} style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, width: "100%",
        //  cursor: item.action ? "pointer" : "default", textAlign: "left",
          boxShadow: theme.mode === 'light' ? '0 1px 4px rgba(0,0,0,0.05)' : 'none' }}>
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: theme.text, fontSize: 12, fontWeight: 600 }}>{item.label}</div>
            <div style={{ color: theme.textSec, fontSize: 10, marginTop: 1 }}>{item.sub}</div>
          </div>
          {item.label === "Dark Mode" ? (
            <div style={{ width: 32, height: 18, background: theme.mode === "dark" ? "#2563eb" : "#cbd5e1", borderRadius: 10, position: "relative", transition: "0.2s" }}>
              <div style={{ width: 14, height: 14, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: theme.mode === "dark" ? 16 : 2, transition: "0.2s" }} />
            </div>
          ) : (
            <span style={{ color: theme.textSec, fontSize: 14 }}>›</span>
          )}
        </button>
      ))}

      <button onClick={() => { setRole(null); setCurrentScreen("role"); }} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 14, padding: "14px", color: "#fca5a5", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 20 }}>
        🚪 Logout
      </button>
    </div>
  </div>
);

// ─── BOTTOM NAVIGATION ─────────────────────────────────────────────────────────
const DocBottomNav = ({ screen, setScreen, theme }: { screen: Screen; setScreen: (s: Screen) => void; theme: Theme }) => (
  <div style={{ display: "flex", background: theme.navBg, borderTop: `1px solid ${theme.cardBorder}`, backdropFilter: "blur(20px)", padding: "8px 0 12px", flexShrink: 0 }}>
    {[
      { icon: "🏠", label: "Home", screen: "doc_home" as Screen },
      { icon: "🗓️", label: "OPD", screen: "doc_opd" as Screen },
      { icon: "🛏️", label: "IPD", screen: "doc_ipd" as Screen },
      { icon: "🔔", label: "Alerts", screen: "doc_notifications" as Screen },
      { icon: "👤", label: "Profile", screen: "doc_profile" as Screen },
    ].map(nav => (
      <button key={nav.label} onClick={() => setScreen(nav.screen)}
        style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0" }}>
        <span style={{ fontSize: screen === nav.screen ? 22 : 19, filter: screen === nav.screen ? "none" : "grayscale(0.5)", transition: "all 0.2s" }}>{nav.icon}</span>
        <span style={{ fontSize: 9, fontWeight: screen === nav.screen ? 700 : 400, color: screen === nav.screen ? "#2563eb" : theme.textSec }}>{nav.label}</span>
        {screen === nav.screen && <div style={{ width: 18, height: 2, background: "#2563eb", borderRadius: 1 }} />}
      </button>
    ))}
  </div>
);

const PatBottomNav = ({ screen, setScreen, theme }: { screen: Screen; setScreen: (s: Screen) => void; theme: Theme }) => (
  <div style={{ display: "flex", background: theme.navBg, borderTop: `1px solid ${theme.cardBorder}`, backdropFilter: "blur(20px)", padding: "8px 0 12px", flexShrink: 0, position: "relative" }}>
    {[
      { icon: "🏠", label: "Home", screen: "pat_home" as Screen },
      { icon: "📅", label: "Appts", screen: "pat_appointments" as Screen },
      { icon: "🚑", label: "SOS", screen: "pat_sos" as Screen, sos: true },
      { icon: "📋", label: "Records", screen: "pat_records" as Screen },
      { icon: "👤", label: "Profile", screen: "pat_profile" as Screen },
    ].map(nav => (
      <button key={nav.label} onClick={() => setScreen(nav.screen)}
        style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", position: "relative" }}>
        {nav.sos ? (
          <div style={{ width: 42, height: 42, background: "linear-gradient(135deg,#dc2626,#ef4444)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginTop: -18, boxShadow: "0 4px 16px rgba(220,38,38,0.5)", border: `3px solid ${theme.bg}` }}>🚑</div>
        ) : (
          <span style={{ fontSize: screen === nav.screen ? 22 : 19, filter: screen === nav.screen ? "none" : "grayscale(0.5)" }}>{nav.icon}</span>
        )}
        <span style={{ fontSize: 9, fontWeight: screen === nav.screen ? 700 : 400, color: nav.sos ? "#fca5a5" : screen === nav.screen ? "#0ea5e9" : theme.textSec }}>{nav.label}</span>
        {screen === nav.screen && !nav.sos && <div style={{ width: 18, height: 2, background: "#0ea5e9", borderRadius: 1 }} />}
      </button>
    ))}
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [role, setRole] = useState<Role>(null);
  const [selectedPatient, setSelectedPatient] = useState<typeof OPD_PATIENTS[0] | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const theme: Theme = isDarkMode ? {
    mode: "dark",
    bg: "#050d1a",
    text: "#ffffff",
    textSec: "rgba(147,197,253,0.6)",
    cardBg: "rgba(26,58,110,0.25)",
    cardBorder: "rgba(147,197,253,0.12)",
    headerBg: "linear-gradient(135deg,#0a1628,#1a3a6e)",
    inputBg: "rgba(147,197,253,0.1)",
    inputBorder: "rgba(147,197,253,0.2)",
    navBg: "rgba(10,22,40,0.98)",
    accent: "#93c5fd",
    iconBg: "rgba(147,197,253,0.15)"
  } : {
    mode: "light",
    bg: "#f8fafc", // slate-50
    text: "#1e293b", // slate-800
    textSec: "#64748b", // slate-500
    cardBg: "#ffffff",
    cardBorder: "#e2e8f0", // slate-200
    headerBg: "#f1f5f9", // slate-100
    inputBg: "#f1f5f9",
    inputBorder: "#cbd5e1", // slate-300
    navBg: "rgba(255,255,255,0.95)",
    accent: "#3b82f6", // blue-500
    iconBg: "#e0f2fe" // light-blue-50
  };

  const handleRoleSelect = useCallback((r: Role) => { setRole(r); setCurrentScreen("login"); }, []);
  const handleLogin = useCallback(() => setCurrentScreen("otp"), []);
  const handleVerify = useCallback(() => {
    if (role === "doctor") setCurrentScreen("doc_home");
    else setCurrentScreen("pat_home");
  }, [role]);

  const isDocScreen = currentScreen.startsWith("doc_");
  const isPatScreen = currentScreen.startsWith("pat_");

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash": return <SplashScreen onDone={() => setCurrentScreen("role")} theme={theme} />;
      case "role": return <RoleSelection onSelect={handleRoleSelect} theme={theme} />;
      case "login": return <LoginScreen role={role} onLogin={handleLogin} onBack={() => setCurrentScreen("role")} theme={theme} />;
      case "otp": return <OTPScreen role={role} onVerify={handleVerify} onBack={() => setCurrentScreen("login")} theme={theme} />;
      // Doctor
      case "doc_home": return <DocHome setScreen={setCurrentScreen} theme={theme} />;
      case "doc_opd": return <DocOPD setScreen={setCurrentScreen} setSelectedPatient={setSelectedPatient} theme={theme} />;
      case "doc_patient_detail": return <DocPatientDetail patient={selectedPatient} setScreen={setCurrentScreen} theme={theme} showToast={showToast} />;
      case "doc_ipd": return <DocIPD setScreen={setCurrentScreen} theme={theme} showToast={showToast} />;
      case "doc_prescription": return <DocPrescription setScreen={setCurrentScreen} theme={theme} showToast={showToast} />;
      case "doc_video": return <DocVideo setScreen={setCurrentScreen} theme={theme} />;
      case "doc_leave": return <DocLeave setScreen={setCurrentScreen} theme={theme} showToast={showToast} />;
      case "doc_notifications": return <DocNotifications setScreen={setCurrentScreen} theme={theme} />;
      case "doc_reports": return <DocReports setScreen={setCurrentScreen} theme={theme} />;
      case "doc_profile": return <DocProfile setScreen={setCurrentScreen} setRole={setRole} setCurrentScreen={setCurrentScreen} theme={theme} toggleTheme={toggleTheme} showToast={showToast} />;
      // Patient
      case "pat_home": return <PatHome setScreen={setCurrentScreen} theme={theme} showToast={showToast} />;
      case "pat_find_doctor": return <PatFindDoctor setScreen={setCurrentScreen} theme={theme} />;
      case "pat_book_slot": return <PatBookSlot setScreen={setCurrentScreen} theme={theme} />;
      case "pat_appointments": return <PatAppointments setScreen={setCurrentScreen} theme={theme} showToast={showToast} />;
      case "pat_records": return <PatRecords setScreen={setCurrentScreen} theme={theme} showToast={showToast} />;
      case "pat_lab": return <PatLab setScreen={setCurrentScreen} theme={theme} showToast={showToast} />;
      case "pat_pharmacy": return <PatPharmacy setScreen={setCurrentScreen} theme={theme} />;
      case "pat_sos": return <PatSOS setScreen={setCurrentScreen} theme={theme} />;
      case "pat_video": return <PatVideo setScreen={setCurrentScreen} theme={theme} showToast={showToast} />;
      case "pat_vitals": return <PatVitals setScreen={setCurrentScreen} theme={theme} showToast={showToast} />;
      case "pat_billing": return <PatBilling setScreen={setCurrentScreen} theme={theme} showToast={showToast} />;
      case "pat_notifications": return <PatNotifications setScreen={setCurrentScreen} theme={theme} />;
      case "pat_family": return <PatFamily setScreen={setCurrentScreen} theme={theme} showToast={showToast} />;
      case "pat_profile": return <PatProfile setScreen={setCurrentScreen} setRole={setRole} setCurrentScreen={setCurrentScreen} theme={theme} toggleTheme={toggleTheme} showToast={showToast} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#030a14", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 10px", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Global Style for hiding scrollbars and animations */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .shimmer { animation: shimmer 2s infinite; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.4s ease-out; }
        @keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(220, 38, 38, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); } }
      `}</style>

      {/* iPhone 15 Pro Frame */}
      <div style={{
        width: 393, minWidth: 393, maxWidth: 393,
        height: "88vh", maxHeight: 852,
        background: isDarkMode ? "#000" : "#fff",
        borderRadius: 54,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 0 0 2px #2a2a2a, 0 0 0 4px #1a1a1a, 0 30px 80px rgba(0,0,0,0.8), 0 0 60px rgba(37,99,235,0.08)",
        position: "relative",
        border: "1px solid #333",
      }}>
        {/* Side buttons simulation */}
        <div style={{ position: "absolute", left: -3, top: 120, width: 3, height: 40, background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: -3, top: 175, width: 3, height: 40, background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", right: -3, top: 150, width: 3, height: 70, background: "#2a2a2a", borderRadius: "0 2px 2px 0" }} />

        {/* Dynamic Island */}
        <DynamicIsland />
        {/* Status Bar */}
        <StatusBar isDark={isDarkMode} />

        {/* App Content */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {renderScreen()}
          </div>
        </div>

        {/* Bottom Navigation */}
        {isDocScreen && !["doc_patient_detail", "doc_prescription", "doc_video", "doc_leave", "doc_notifications", "doc_reports"].includes(currentScreen) && (
          <DocBottomNav screen={currentScreen} setScreen={setCurrentScreen} theme={theme} />
        )}
        {isPatScreen && !["pat_find_doctor", "pat_book_slot", "pat_lab", "pat_pharmacy", "pat_video", "pat_vitals", "pat_billing", "pat_notifications", "pat_family"].includes(currentScreen) && (
          <PatBottomNav screen={currentScreen} setScreen={setCurrentScreen} theme={theme} />
        )}

        {/* Toast Notification */}
        <Toast msg={toastMsg} visible={toastVisible} theme={theme} />

        {/* Home Indicator */}
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 6, paddingTop: 4, background: isDarkMode ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.95)", flexShrink: 0 }}>
          <div style={{ width: 120, height: 4, background: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", borderRadius: 2 }} />
        </div>
      </div>

      {/* App Info outside frame */}
      <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", textAlign: "center", color: "rgba(147,197,253,0.3)", fontSize: 10, letterSpacing: 2 }}>
        MEDCORE PRO · PROJECT 10 · v2.1
      </div>
    </div>
  );
};

export default Index;