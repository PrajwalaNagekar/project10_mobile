import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Home, Calendar, Bell, User, BedDouble, Activity, Heart, Thermometer,
  Droplets, Weight, AlertTriangle, FileText, Users, Stethoscope, Brain,
  Bone, Baby, Microscope, Ear, Eye, Dna, Pill, Cpu, Zap, Video,
  Phone, Mic, MicOff, VideoOff, MessageSquare, Monitor, ChevronLeft,
  Plus, Minus, Search, Shield, Globe, Lock, Star, Clock, MapPin,
  Cross, Siren, Ambulance, UserCheck, ClipboardList, TrendingUp,
  LogOut, Settings, ChevronRight, Sun, Moon, Sunset, Fingerprint,
  PenLine, Send, Printer, Share2, CheckCircle, XCircle, AlertCircle,
  Building2, FlaskConical, ShoppingBag, Truck, Navigation, PhoneCall
} from "lucide-react";

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
type ThemeMode = "dark" | "semidark" | "light";

// ─── THEME SYSTEM ─────────────────────────────────────────────────────────────
const THEMES: Record<ThemeMode, {
  bg: string; cardBg: string; headerBg: string; text: string;
  subText: string; accent: string; border: string; inputBg: string;
  navBg: string; splashBg: string; statCard: string;
}> = {
  dark: {
    bg: "#050d1a",
    cardBg: "rgba(26,58,110,0.25)",
    headerBg: "linear-gradient(135deg,#0a1628,#1a3a6e)",
    text: "#ffffff",
    subText: "rgba(147,197,253,0.7)",
    accent: "#93c5fd",
    border: "rgba(147,197,253,0.12)",
    inputBg: "rgba(147,197,253,0.1)",
    navBg: "rgba(10,22,40,0.98)",
    splashBg: "linear-gradient(135deg,#0a1628 0%,#1a3a6e 50%,#0f2347 100%)",
    statCard: "rgba(26,58,110,0.3)",
  },
  semidark: {
    bg: "#0f1f3d",
    cardBg: "rgba(30,60,120,0.35)",
    headerBg: "linear-gradient(135deg,#0f1f3d,#1e3a7a)",
    text: "#e8f0fe",
    subText: "rgba(160,200,255,0.75)",
    accent: "#90bfff",
    border: "rgba(100,160,255,0.18)",
    inputBg: "rgba(100,160,255,0.12)",
    navBg: "rgba(15,31,61,0.98)",
    splashBg: "linear-gradient(135deg,#0f1f3d 0%,#1e3a7a 50%,#142d5e 100%)",
    statCard: "rgba(30,60,120,0.4)",
  },
  light: {
    bg: "#f0f4ff",
    cardBg: "rgba(255,255,255,0.92)",
    headerBg: "linear-gradient(135deg,#1a3a6e,#2563eb)",
    text: "#0f1f3d",
    subText: "rgba(30,70,160,0.65)",
    accent: "#1d4ed8",
    border: "rgba(30,70,160,0.12)",
    inputBg: "rgba(30,70,160,0.06)",
    navBg: "rgba(240,244,255,0.98)",
    splashBg: "linear-gradient(135deg,#1a3a6e 0%,#2563eb 50%,#0f2347 100%)",
    statCard: "rgba(255,255,255,0.9)",
  },
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const OPD_PATIENTS = [
  { id: "P10-2024-001", name: "Rahul Sharma", time: "09:00 AM", complaint: "Chest pain, shortness of breath", status: "In-Progress", age: 52, gender: "M", blood: "B+", bp: "148/92", spo2: "96%", pulse: "88 bpm", temp: "98.6°F", weight: "82 kg", rbs: "142 mg/dL", allergy: "Penicillin", diagnosis: "Hypertensive heart disease" },
  { id: "P10-2024-002", name: "Priya Mehta", time: "09:30 AM", complaint: "Fever, cough, body ache", status: "Waiting", age: 34, gender: "F", blood: "O+", bp: "110/70", spo2: "98%", pulse: "78 bpm", temp: "101.2°F", weight: "58 kg", rbs: "98 mg/dL", allergy: "None", diagnosis: "Viral URTI" },
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
  { name: "Cardiology",    Icon: Heart,          doctors: 8,  color: "#ef4444" },
  { name: "Neurology",     Icon: Brain,          doctors: 6,  color: "#8b5cf6" },
  { name: "Orthopedics",   Icon: Bone,           doctors: 10, color: "#f59e0b" },
  { name: "Pediatrics",    Icon: Baby,           doctors: 7,  color: "#10b981" },
  { name: "Gynecology",    Icon: Activity,       doctors: 9,  color: "#ec4899" },
  { name: "ENT",           Icon: Ear,            doctors: 5,  color: "#06b6d4" },
  { name: "Ophthalmology", Icon: Eye,            doctors: 4,  color: "#6366f1" },
  { name: "Dermatology",   Icon: Dna,            doctors: 6,  color: "#f97316" },
  { name: "Gastro",        Icon: Stethoscope,    doctors: 5,  color: "#14b8a6" },
  { name: "Oncology",      Icon: Cpu,            doctors: 8,  color: "#a855f7" },
  { name: "Urology",       Icon: Pill,           doctors: 4,  color: "#0ea5e9" },
  { name: "Psychiatry",    Icon: Brain,          doctors: 3,  color: "#84cc16" },
];

const DOCTORS_BY_DEPT: Record<string, Array<{id: number; name: string; dept: string; exp: string; fee: string; rating: number; available: boolean; slots: string[]; qual: string;}>> = {
  "Cardiology": [
    { id: 1, name: "Dr. Arjun Mehta", dept: "Cardiology", qual: "MD, DM Cardiology", exp: "18 yrs", fee: "₹800", rating: 4.9, available: true, slots: ["9:00 AM", "10:30 AM", "2:00 PM", "4:30 PM"] },
    { id: 2, name: "Dr. Kavitha Pillai", dept: "Cardiology", qual: "MD, DNB Cardiology", exp: "12 yrs", fee: "₹700", rating: 4.8, available: true, slots: ["9:30 AM", "11:00 AM", "3:30 PM"] },
    { id: 3, name: "Dr. Rohan Sinha", dept: "Cardiology", qual: "MBBS, MD", exp: "8 yrs", fee: "₹600", rating: 4.6, available: false, slots: ["10:00 AM", "4:00 PM"] },
  ],
  "Neurology": [
    { id: 4, name: "Dr. Sunita Rao", dept: "Neurology", qual: "MD, DM Neurology", exp: "14 yrs", fee: "₹900", rating: 4.8, available: true, slots: ["9:30 AM", "11:00 AM", "3:00 PM"] },
    { id: 5, name: "Dr. Anil Verma", dept: "Neurology", qual: "MBBS, MD, DNB", exp: "10 yrs", fee: "₹850", rating: 4.7, available: true, slots: ["10:00 AM", "2:30 PM"] },
  ],
  "Orthopedics": [
    { id: 7, name: "Dr. Rajesh Kumar", dept: "Orthopedics", qual: "MS Ortho, FRCS", exp: "22 yrs", fee: "₹750", rating: 4.7, available: false, slots: ["10:00 AM", "2:30 PM"] },
    { id: 8, name: "Dr. Sunil Rao", dept: "Orthopedics", qual: "MS Ortho", exp: "15 yrs", fee: "₹700", rating: 4.6, available: true, slots: ["9:00 AM", "11:30 AM", "3:00 PM"] },
  ],
  "Pediatrics": [
    { id: 10, name: "Dr. Meera Nair", dept: "Pediatrics", qual: "MD Pediatrics, MRCP", exp: "12 yrs", fee: "₹600", rating: 4.9, available: true, slots: ["8:30 AM", "11:30 AM", "4:00 PM"] },
    { id: 11, name: "Dr. Deepak Iyer", dept: "Pediatrics", qual: "MBBS, MD", exp: "8 yrs", fee: "₹550", rating: 4.7, available: true, slots: ["9:00 AM", "12:00 PM", "3:30 PM"] },
  ],
  "Gynecology": [
    { id: 13, name: "Dr. Rekha Pillai", dept: "Gynecology", qual: "MD, DGO", exp: "16 yrs", fee: "₹700", rating: 4.8, available: true, slots: ["9:00 AM", "11:00 AM", "3:00 PM"] },
    { id: 14, name: "Dr. Asha Sharma", dept: "Gynecology", qual: "MS Gynecology", exp: "11 yrs", fee: "₹650", rating: 4.7, available: true, slots: ["10:00 AM", "2:30 PM", "4:30 PM"] },
  ],
  "ENT": [
    { id: 16, name: "Dr. Mohan Das", dept: "ENT", qual: "MS ENT, DORL", exp: "13 yrs", fee: "₹650", rating: 4.7, available: true, slots: ["9:00 AM", "11:00 AM", "3:30 PM"] },
    { id: 17, name: "Dr. Lakshmi Nair", dept: "ENT", qual: "MBBS, MS ENT", exp: "9 yrs", fee: "₹600", rating: 4.6, available: true, slots: ["10:00 AM", "2:00 PM"] },
  ],
};

const FALLBACK_DOCTORS = (dept: string) => [
  { id: 100, name: `Dr. Suresh Babu`, dept, qual: "MD, Consultant", exp: "14 yrs", fee: "₹700", rating: 4.7, available: true, slots: ["9:00 AM", "11:00 AM", "3:00 PM"] },
  { id: 101, name: `Dr. Kavitha Menon`, dept, qual: "MBBS, MD", exp: "10 yrs", fee: "₹650", rating: 4.6, available: true, slots: ["10:00 AM", "2:30 PM", "4:30 PM"] },
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
  { name: "Amlodipine 5mg",     category: "Antihypertensive", price: "₹12" },
  { name: "Metformin 500mg",    category: "Antidiabetic",     price: "₹8"  },
  { name: "Atorvastatin 10mg",  category: "Statin",           price: "₹15" },
  { name: "Pantoprazole 40mg",  category: "PPI",              price: "₹10" },
  { name: "Azithromycin 500mg", category: "Antibiotic",       price: "₹45" },
  { name: "Paracetamol 650mg",  category: "Analgesic",        price: "₹5"  },
  { name: "Cetirizine 10mg",    category: "Antihistamine",    price: "₹6"  },
  { name: "Omeprazole 20mg",    category: "PPI",              price: "₹8"  },
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
  { type: "critical",     title: "Critical Lab Alert",        msg: "Rahul Sharma — K⁺ 6.8 mEq/L (CRITICAL HIGH)", time: "2 min ago" },
  { type: "appointment",  title: "New Appointment Request",   msg: "Deepa Krishnan — OPD tomorrow 11 AM",          time: "15 min ago" },
  { type: "ipd",          title: "IPD Deterioration",         msg: "Mohan Gupta — SpO₂ dropped to 88%",            time: "32 min ago" },
  { type: "admin",        title: "Admin Notice",              msg: "CME Conference: Feb 22, 2024 — Conf. Hall B",   time: "1 hr ago" },
  { type: "appointment",  title: "Teleconsult Request",       msg: "Neha Singh — Video Consult at 5 PM",            time: "2 hrs ago" },
];

const PAT_NOTIFICATIONS = [
  { type: "reminder", title: "Appointment Reminder", msg: "OPD with Dr. Arjun Mehta tomorrow at 9:00 AM", time: "1 hr ago" },
  { type: "report",   title: "Lab Report Ready",     msg: "Your CBC & LFT report is now available",       time: "3 hrs ago" },
  { type: "medicine", title: "Medicine Refill",       msg: "Metformin 500mg — only 5 tablets remaining",  time: "5 hrs ago" },
  { type: "hospital", title: "Health Camp",           msg: "Free diabetes screening — Feb 22, OPD Block", time: "1 day ago" },
];

const FAMILY_MEMBERS = [
  { name: "Meera Sharma",  relation: "Spouse", age: 45, blood: "A+", uhid: "P10-F-2891" },
  { name: "Aryan Sharma",  relation: "Son",    age: 18, blood: "B+", uhid: "P10-F-3042" },
  { name: "Kamla Sharma",  relation: "Mother", age: 72, blood: "O+", uhid: "P10-F-1205" },
];

const VIDEO_CALLS = [
  { patient: "Mrs. Deepa K.",  time: "05:00 PM", id: "VC-2024-0891", duration: "15 min", status: "upcoming" },
  { patient: "Mr. Ajay Verma", time: "06:30 PM", id: "VC-2024-0892", duration: "20 min", status: "upcoming" },
  { patient: "Ms. Ritu Patel", time: "03:00 PM", id: "VC-2024-0890", duration: "12 min", status: "completed" },
];

// ─── HOSPITAL LOGO SVG ───────────────────────────────────────────────────────
const HospitalLogo = ({ size = 56, glow = false }: { size?: number; glow?: boolean }) => (
  <div style={{
    width: size, height: size,
    background: "linear-gradient(135deg,#1a3a6e,#2563eb)",
    borderRadius: size * 0.28,
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: glow ? "0 0 50px rgba(37,99,235,0.6), inset 0 1px 1px rgba(255,255,255,0.2)" : "0 4px 16px rgba(37,99,235,0.3)",
    flexShrink: 0,
  }}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 32 32" fill="none">
      <rect x="13" y="3" width="6" height="26" rx="3" fill="white" opacity="0.95"/>
      <rect x="3" y="13" width="26" height="6" rx="3" fill="white" opacity="0.95"/>
    </svg>
  </div>
);

// ─── DOCTOR AVATAR SVG ────────────────────────────────────────────────────────
const DoctorAvatar = ({ size = 46 }: { size?: number }) => (
  <div style={{
    width: size, height: size,
    background: "rgba(255,255,255,0.15)",
    borderRadius: size * 0.28,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, overflow: "hidden",
  }}>
    <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="13" r="7" fill="rgba(255,255,255,0.85)"/>
      <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M17 30l1.5 3 1.5-1.5 1.5 1.5 1.5-3" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  </div>
);

// ─── PATIENT AVATAR SVG ───────────────────────────────────────────────────────
const PatientAvatar = ({ size = 46 }: { size?: number }) => (
  <div style={{
    width: size, height: size,
    background: "rgba(255,255,255,0.15)",
    borderRadius: size * 0.28,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  }}>
    <svg width={size * 0.68} height={size * 0.68} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="13" r="7" fill="rgba(255,255,255,0.85)"/>
      <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    </svg>
  </div>
);

// ─── STATUS BAR ──────────────────────────────────────────────────────────────
const StatusBar = ({ theme }: { theme: ThemeMode }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const iconColor = theme === "light" ? "#0f1f3d" : "#ffffff";
  const bgColor   = theme === "light" ? "rgba(240,244,255,0.95)" : "rgba(0,0,0,0.0)";

  return (
    <div style={{ background: bgColor, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 44, flexShrink: 0, position: "relative" }}>
      <span style={{ color: iconColor, fontSize: 15, fontWeight: 700, letterSpacing: 0.3, fontFamily: "'Playfair Display', Georgia, serif" }}>{time}</span>
      <div style={{ width: 126, height: 34, background: "#000", borderRadius: 20, position: "absolute", left: "50%", transform: "translateX(-50%)", top: 5, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <div style={{ width: 10, height: 10, background: "#1a1a1a", borderRadius: "50%" }} />
        <div style={{ width: 12, height: 12, background: "#111", borderRadius: "50%", border: "2px solid #222" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5 }}>
          {[6, 9, 12, 15].map((h, i) => (
            <div key={i} style={{ width: 3, height: h, background: i < 3 ? iconColor : `${iconColor}40`, borderRadius: 1.5 }} />
          ))}
        </div>
        <span style={{ color: iconColor, fontSize: 10, fontWeight: 600 }}>5G</span>
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
          <circle cx="7.5" cy="10.5" r="1.2" fill={iconColor} />
          <path d="M4.8 8C5.7 7 6.6 6.5 7.5 6.5C8.4 6.5 9.3 7 10.2 8" stroke={iconColor} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.8"/>
          <path d="M2.5 5.5C4.2 3.8 5.8 3 7.5 3C9.2 3 10.8 3.8 12.5 5.5" stroke={iconColor} strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.55"/>
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
          <div style={{ width: 24, height: 12, border: `1.5px solid ${iconColor}`, borderRadius: 3, padding: 1.5, position: "relative" }}>
            <div style={{ width: "75%", height: "100%", background: "#22c55e", borderRadius: 1.5 }} />
            <Zap size={6} style={{ position: "absolute", inset: 0, margin: "auto", color: "#fff" }} />
          </div>
          <div style={{ width: 2, height: 5, background: `${iconColor}60`, borderRadius: "0 1px 1px 0" }} />
        </div>
      </div>
    </div>
  );
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    "In-Progress": "linear-gradient(135deg,#f59e0b,#fbbf24)",
    "Waiting":     "linear-gradient(135deg,#2563eb,#3b82f6)",
    "Checked In":  "linear-gradient(135deg,#10b981,#34d399)",
    "Completed":   "linear-gradient(135deg,#6366f1,#818cf8)",
    "No-Show":     "linear-gradient(135deg,#ef4444,#f87171)",
    "Critical":    "linear-gradient(135deg,#dc2626,#ef4444)",
    "Stable":      "linear-gradient(135deg,#059669,#10b981)",
  };
  const isCritical = status === "Critical";
  return (
    <span style={{
      background: colors[status] || "#374151",
      fontSize: 9, padding: "2px 7px", borderRadius: 10, color: "#fff", fontWeight: 600,
      whiteSpace: "nowrap", fontFamily: "'Libre Baskerville', Georgia, serif",
      animation: isCritical ? "criticalPulse 1.5s ease-in-out infinite" : "none",
      display: "inline-block",
    }}>
      {status}
    </span>
  );
};

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle, onBack, theme }: { title: string; subtitle?: string; onBack?: () => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  return (
    <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0" style={{ background: t.headerBg, borderBottom: `1px solid ${t.border}`, animation: "fadeInDown 0.3s ease-out" }}>
      {onBack && (
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "6px 8px", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 3, backdropFilter: "blur(8px)", transition: "background 0.15s" }}
          onMouseDown={e => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
          onMouseUp={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}>
          <ChevronLeft size={14} color="#fff" />
        </button>
      )}
      <div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</div>
        {subtitle && <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, marginTop: 1, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>{subtitle}</div>}
      </div>
    </div>
  );
};

// ─── QUICK STAT CARD ─────────────────────────────────────────────────────────
const QuickStatCard = ({ label, value, IconComp, color, theme }: { label: string; value: string | number; IconComp: React.ElementType; color: string; theme: ThemeMode }) => {
  const t = THEMES[theme];
  const isLight = theme === "light";
  return (
    <div style={{ background: t.statCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: "10px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, boxShadow: isLight ? "0 2px 8px rgba(30,70,160,0.08)" : "0 2px 8px rgba(0,0,0,0.3)", animation: "countUp 0.5s ease-out", transition: "transform 0.15s, box-shadow 0.15s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(37,99,235,0.2)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = isLight ? "0 2px 8px rgba(30,70,160,0.08)" : "0 2px 8px rgba(0,0,0,0.3)"; }}>
      <div style={{ background: color, borderRadius: 10, padding: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <IconComp size={16} color="#fff" />
      </div>
      <div style={{ color: t.text, fontWeight: 800, fontSize: 15, lineHeight: 1, fontFamily: "'Playfair Display', Georgia, serif" }}>{value}</div>
      <div style={{ color: t.subText, fontSize: 8.5, textAlign: "center", lineHeight: "1.2", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{label}</div>
    </div>
  );
};

// ─── THEME SWITCHER ───────────────────────────────────────────────────────────
const ThemeSwitcher = ({ theme, setTheme }: { theme: ThemeMode; setTheme: (t: ThemeMode) => void }) => {
  const opts: { id: ThemeMode; Icon: React.ElementType; label: string }[] = [
    { id: "light",    Icon: Sun,    label: "Light" },
    { id: "semidark", Icon: Sunset, label: "Mid"   },
    { id: "dark",     Icon: Moon,   label: "Dark"  },
  ];
  return (
    <div style={{ display: "flex", background: "rgba(0,0,0,0.15)", borderRadius: 12, padding: 3, gap: 2 }}>
      {opts.map(opt => (
        <button key={opt.id} onClick={() => setTheme(opt.id)}
          style={{ background: theme === opt.id ? "rgba(255,255,255,0.25)" : "transparent", border: "none", borderRadius: 9, padding: "4px 8px", cursor: "pointer", color: "#fff", fontSize: 9, fontWeight: theme === opt.id ? 700 : 400, display: "flex", alignItems: "center", gap: 2, transition: "background 0.2s", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          <opt.Icon size={10} color="#fff" />
          {opt.label}
        </button>
      ))}
    </div>
  );
};

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
const SplashScreen = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", background: "linear-gradient(135deg,#0a1628 0%,#1a3a6e 50%,#0f2347 100%)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, animation: "fadeInUp 0.6s ease-out forwards" }}>
        <div style={{ animation: "scaleIn 0.7s ease-out" }}>
          <HospitalLogo size={96} glow />
        </div>
        <div style={{ textAlign: "center", animation: "fadeInUp 0.6s 0.2s ease-out both" }}>
          <div style={{ color: "#ffffff", fontWeight: 900, fontSize: 26, letterSpacing: 1, textShadow: "0 2px 12px rgba(37,99,235,0.5)", fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>PROJECT 10 HOSPITAL</div>
          <div style={{ color: "#93c5fd", fontSize: 11, letterSpacing: 4, marginTop: 6, fontWeight: 500, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>EXCELLENCE IN HEALTHCARE</div>
          <div style={{ color: "rgba(147,197,253,0.55)", fontSize: 10, marginTop: 6, fontFamily: "'Libre Baskerville', Georgia, serif" }}>Bangalore · Est. 1985 · NABH Accredited</div>
        </div>
        <div style={{ width: 160, height: 3, background: "rgba(147,197,253,0.15)", borderRadius: 2, overflow: "hidden", marginTop: 4 }}>
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(90deg,transparent,#2563eb,#06b6d4,transparent)", animation: "shimmer 1.5s infinite" }} />
        </div>
        <div style={{ color: "rgba(147,197,253,0.45)", fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", animation: "fadeIn 0.6s 0.5s ease-out both" }}>Powered by AI Healthcare Platform</div>
      </div>
      <div style={{ position: "absolute", bottom: 60, display: "flex", gap: 6 }}>
        {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === 1 ? "#2563eb" : "rgba(147,197,253,0.3)", transition: "all 0.3s" }} />)}
      </div>
    </div>
  );
};

// ─── ROLE SELECTION ───────────────────────────────────────────────────────────
const RoleSelection = ({ onSelect }: { onSelect: (r: Role) => void }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", background: "linear-gradient(135deg,#0a1628 0%,#1a3a6e 50%,#0f2347 100%)", padding: "0 24px", gap: 28 }}>
    <div style={{ textAlign: "center", animation: "fadeInUp 0.4s ease-out" }}>
      <HospitalLogo size={68} glow />
      <div style={{ color: "#ffffff", fontWeight: 700, fontSize: 16, marginTop: 16, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>Welcome to</div>
      <div style={{ color: "#93c5fd", fontWeight: 800, fontSize: 24, fontFamily: "'Playfair Display', Georgia, serif" }}>Project 10 Hospital</div>
      <div style={{ color: "rgba(147,197,253,0.5)", fontSize: 11, marginTop: 4, fontFamily: "'Libre Baskerville', Georgia, serif" }}>Select your role to continue</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", animation: "fadeInUp 0.4s 0.1s ease-out both" }}>
      {[
        { role: "doctor" as Role, Icon: Stethoscope, title: "Doctor / Staff", sub: "Access OPD, IPD, Prescriptions & Analytics", color: "linear-gradient(135deg,#1a3a6e,#2563eb)" },
        { role: "patient" as Role, Icon: UserCheck, title: "Patient", sub: "Book appointments, records, pharmacy & more", color: "linear-gradient(135deg,#0c4a6e,#0ea5e9)" },
      ].map(({ role, Icon, title, sub, color }) => (
        <button key={role} onClick={() => onSelect(role)}
          style={{ background: color, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "20px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", boxShadow: "0 8px 32px rgba(37,99,235,0.3)", transition: "transform 0.15s, box-shadow 0.15s" }}
          onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = "scale(0.97)"; }}
          onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={32} color="#fff" strokeWidth={1.5} />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ color: "#ffffff", fontWeight: 700, fontSize: 16, fontFamily: "'Playfair Display', Georgia, serif" }}>{title}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, marginTop: 4, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>{sub}</div>
          </div>
        </button>
      ))}
    </div>
    <div style={{ color: "rgba(147,197,253,0.4)", fontSize: 10, textAlign: "center", display: "flex", alignItems: "center", gap: 5, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <Lock size={10} color="rgba(147,197,253,0.4)" /> 256-bit AES Encrypted · HIPAA Compliant
    </div>
  </div>
);

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
const LoginScreen = ({ role, onLogin, onBack }: { role: Role; onLogin: () => void; onBack: () => void }) => {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "linear-gradient(135deg,#0a1628 0%,#1a3a6e 50%,#0f2347 100%)" }}>
      <div style={{ background: "linear-gradient(135deg,#0a1628,#1a3a6e)", padding: "20px 20px 30px", animation: "fadeInDown 0.4s ease-out" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "#ffffff", borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontSize: 12, marginBottom: 16, display: "flex", alignItems: "center", gap: 4, transition: "background 0.15s" }}
          onMouseDown={e => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
          onMouseUp={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}>
          <ChevronLeft size={14} color="#fff" /> Back
        </button>
        <div style={{ marginBottom: 10, display: "flex", alignItems: "center" }}>
          {role === "doctor" ? <Stethoscope size={32} color="#93c5fd" strokeWidth={1.5} /> : <UserCheck size={32} color="#93c5fd" strokeWidth={1.5} />}
        </div>
        <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 20, fontFamily: "'Playfair Display', Georgia, serif" }}>{role === "doctor" ? "Doctor Login" : "Patient Login"}</div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11, marginTop: 4, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>Project 10 Hospital — Secure Access Portal</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 16, msOverflowStyle: "none" as any }} className="no-scrollbar">
        <div style={{ height: 8 }} />
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 4, display: "flex", gap: 4 }}>
          {(["phone", "email"] as const).map(m => (
            <button key={m} onClick={() => setMethod(m)}
              style={{ flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: method === m ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "transparent", color: method === m ? "#ffffff" : "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {m === "phone" ? <Phone size={12} /> : <Send size={12} />}
              {m === "phone" ? "Phone" : "Email"}
            </button>
          ))}
        </div>
        {method === "phone" ? (
          <div>
            <label style={{ color: "#93c5fd", fontSize: 10, fontWeight: 600, display: "block", marginBottom: 6, letterSpacing: 1, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>MOBILE NUMBER</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 14px", color: "#ffffff", fontSize: 13, fontWeight: 600, minWidth: 56, fontFamily: "'Playfair Display', Georgia, serif" }}>+91</div>
              <input value={phone} onChange={e => setPhone(e.target.value.slice(0, 10))} placeholder="Enter 10-digit number"
                style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 14px", color: "#ffffff", fontSize: 14, outline: "none", fontFamily: "'Libre Baskerville', Georgia, serif" }}
                type="tel" inputMode="numeric" />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ color: "#93c5fd", fontSize: 10, fontWeight: 600, display: "block", marginBottom: 6, letterSpacing: 1, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>EMAIL ADDRESS</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
                style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 14px", color: "#ffffff", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'Libre Baskerville', Georgia, serif" }} />
            </div>
            <div>
              <label style={{ color: "#93c5fd", fontSize: 10, fontWeight: 600, display: "block", marginBottom: 6, letterSpacing: 1, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>PASSWORD</label>
              <input value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter password" type="password"
                style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 14px", color: "#ffffff", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'Libre Baskerville', Georgia, serif" }} />
            </div>
          </div>
        )}
        <button onClick={onLogin}
          style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#ffffff", border: "none", borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(37,99,235,0.4)", width: "100%", fontFamily: "'Playfair Display', Georgia, serif", transition: "transform 0.12s, box-shadow 0.12s" }}
          onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = "scale(0.97)"; }}
          onMouseUp={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
          {method === "phone" ? "Send OTP →" : "Login Securely →"}
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginBottom: 12, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>— OR —</div>
          <button onClick={onLogin} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "12px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, margin: "0 auto", color: "#ffffff", fontSize: 12, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            <Fingerprint size={20} color="#93c5fd" /> Biometric / Face ID Login
          </button>
        </div>
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, textAlign: "center", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
          By continuing, you agree to our Terms & Privacy Policy
        </div>
      </div>
    </div>
  );
};

// ─── OTP SCREEN ───────────────────────────────────────────────────────────────
const OTPScreen = ({ onVerify, onBack }: { role: Role; onVerify: () => void; onBack: () => void }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "linear-gradient(135deg,#0a1628 0%,#1a3a6e 50%,#0f2347 100%)", padding: "24px 20px", gap: 24, animation: "fadeIn 0.35s ease-out" }}>
      <button onClick={onBack} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#ffffff", borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontSize: 12, alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 4, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        <ChevronLeft size={14} color="#fff" /> Back
      </button>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
        <div style={{ background: "rgba(37,99,235,0.2)", borderRadius: 24, padding: 18, border: "1px solid rgba(37,99,235,0.3)" }}>
          <Phone size={36} color="#93c5fd" strokeWidth={1.5} />
        </div>
        <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 18, fontFamily: "'Playfair Display', Georgia, serif" }}>OTP Verification</div>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>Enter the 6-digit code sent to<br/>+91 98765 43210</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
        {otp.map((val, idx) => (
          <input key={idx} value={val} onChange={e => { const n = [...otp]; n[idx] = e.target.value.slice(-1); setOtp(n); }} maxLength={1} type="tel" inputMode="numeric"
            style={{ width: 42, height: 52, textAlign: "center", background: "rgba(255,255,255,0.1)", border: `2px solid ${val ? "#2563eb" : "rgba(255,255,255,0.2)"}`, borderRadius: 12, color: "#ffffff", fontSize: 20, fontWeight: 700, outline: "none", transition: "border 0.2s", fontFamily: "'Playfair Display', Georgia, serif" }} />
        ))}
      </div>
      <button onClick={onVerify}
        style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#ffffff", border: "none", borderRadius: 14, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(37,99,235,0.4)", fontFamily: "'Playfair Display', Georgia, serif" }}>
        Verify & Login →
      </button>
      <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
        Didn't receive? <span style={{ color: "#60a5fa", cursor: "pointer" }}>Resend OTP</span> (0:28)
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DOCTOR SCREENS
// ─────────────────────────────────────────────────────────────────────────────

const DocHome = ({ setScreen, theme, setTheme }: { setScreen: (s: Screen) => void; theme: ThemeMode; setTheme: (t: ThemeMode) => void }) => {
  const t = THEMES[theme];
  const isLight = theme === "light";
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <div style={{ background: t.headerBg, padding: "14px 16px 20px", animation: "fadeInDown 0.35s ease-out" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ color: isLight ? "rgba(255,255,255,0.75)" : "rgba(147,197,253,0.7)", fontSize: 10, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 1 }}>DR. ARJUN MEHTA, MD</div>
            <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 16, fontFamily: "'Playfair Display', Georgia, serif", display: "flex", alignItems: "center", gap: 6 }}>
              Good Morning! <Zap size={14} color="#fbbf24" />
            </div>
            <div style={{ color: isLight ? "rgba(255,255,255,0.65)" : "rgba(147,197,253,0.7)", fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>Cardiology · MCI Reg: DL/12345</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <DoctorAvatar size={46} />
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif", display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={10} color="rgba(255,255,255,0.65)" /> Wednesday, 19 Feb 2025
          </span>
          <span style={{ color: "#fbbf24", fontSize: 10, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>● OPD Running</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 14 }} className="no-scrollbar">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { label: "Today OPD", value: "28", IconComp: Users, color: "linear-gradient(135deg,#2563eb,#3b82f6)" },
            { label: "Inpatients", value: "12", IconComp: BedDouble, color: "linear-gradient(135deg,#7c3aed,#8b5cf6)" },
            { label: "Critical", value: "3", IconComp: AlertTriangle, color: "linear-gradient(135deg,#dc2626,#ef4444)" },
            { label: "Reports", value: "7", IconComp: FileText, color: "linear-gradient(135deg,#059669,#10b981)" },
          ].map(card => (
            <QuickStatCard key={card.label} label={card.label} value={card.value} IconComp={card.IconComp} color={card.color} theme={theme} />
          ))}
        </div>

        {/* OPD Summary */}
        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 18, padding: "14px", animation: "fadeInUp 0.4s ease-out" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ color: t.text, fontWeight: 700, fontSize: 13, fontFamily: "'Playfair Display', Georgia, serif" }}>OPD Queue Today</div>
            <button onClick={() => setScreen("doc_opd")} style={{ background: "rgba(37,99,235,0.15)", border: "none", borderRadius: 8, padding: "4px 10px", color: t.accent, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>View All →</button>
          </div>
          {OPD_PATIENTS.slice(0, 3).map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
              <div>
                <div style={{ color: t.text, fontSize: 12, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{p.name}</div>
                <div style={{ color: t.subText, fontSize: 10, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{p.time} · {p.complaint.slice(0, 22)}…</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>

        {/* Monthly OPD Chart */}
        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 18, padding: "14px", animation: "fadeInUp 0.5s ease-out" }}>
          <div style={{ color: t.accent, fontSize: 11, fontWeight: 700, marginBottom: 10, fontFamily: "'Playfair Display', Georgia, serif" }}>MONTHLY OPD TREND</div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={MONTHLY_OPD} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis dataKey="month" tick={{ fill: t.accent, fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: t.accent, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 10, color: t.text, fontSize: 11 }} />
              <Bar dataKey="count" fill="url(#blueGrad)" radius={[6,6,0,0]} />
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1a3a6e" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            { label: "Video Consult", Icon: Video, screen: "doc_video", color: "linear-gradient(135deg,#0c4a6e,#0ea5e9)" },
            { label: "IPD Rounds", Icon: BedDouble, screen: "doc_ipd", color: "linear-gradient(135deg,#4c1d95,#7c3aed)" },
            { label: "Analytics", Icon: TrendingUp, screen: "doc_reports", color: "linear-gradient(135deg,#064e3b,#059669)" },
            { label: "Leave Mgmt", Icon: Calendar, screen: "doc_leave", color: "linear-gradient(135deg,#78350f,#d97706)" },
            { label: "Alerts", Icon: Bell, screen: "doc_notifications", color: "linear-gradient(135deg,#dc2626,#ef4444)" },
            { label: "Profile", Icon: User, screen: "doc_profile", color: "linear-gradient(135deg,#1a3a6e,#2563eb)" },
          ].map(({ label, Icon, screen, color }) => (
            <button key={label} onClick={() => setScreen(screen as Screen)}
              style={{ background: color, border: "none", borderRadius: 14, padding: "12px 6px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, boxShadow: "0 4px 12px rgba(0,0,0,0.2)", transition: "transform 0.15s" }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.95)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>
              <Icon size={18} color="#fff" strokeWidth={1.5} />
              <span style={{ color: "#ffffff", fontSize: 9.5, fontWeight: 600, textAlign: "center", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{label}</span>
            </button>
          ))}
        </div>
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
};

const DocOPD = ({ setScreen, setSelectedPatient, theme }: { setScreen: (s: Screen) => void; setSelectedPatient: (p: typeof OPD_PATIENTS[0]) => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="OPD Queue" subtitle="Today · 28 Patients" onBack={() => setScreen("doc_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
        {OPD_PATIENTS.map((p, i) => (
          <div key={p.id} onClick={() => { setSelectedPatient(p); setScreen("doc_patient_detail"); }}
            style={{ background: t.cardBg, border: `1px solid ${p.status === "Critical" ? "rgba(239,68,68,0.35)" : t.border}`, borderRadius: 16, padding: "12px 14px", cursor: "pointer", animation: `fadeInUp ${0.15 + i * 0.07}s ease-out`, transition: "transform 0.15s, box-shadow 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.01)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(37,99,235,0.12)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <div style={{ color: t.text, fontWeight: 700, fontSize: 13, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>{p.name}</div>
                <div style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{p.id} · Age {p.age} · {p.gender} · {p.blood}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div style={{ color: t.subText, fontSize: 10.5, marginBottom: 6, fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }}>{p.complaint}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: t.accent, fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 3, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                <Clock size={10} />{p.time}
              </span>
              <span style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Tap to view →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DocPatientDetail = ({ patient, setScreen, theme }: { patient: typeof OPD_PATIENTS[0] | null; setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const [activeTab, setActiveTab] = useState<"vitals" | "history" | "labs">("vitals");
  const t = THEMES[theme];
  if (!patient) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title={patient.name} subtitle={`${patient.id} · ${patient.diagnosis}`} onBack={() => setScreen("doc_opd")} theme={theme} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: t.cardBg, borderBottom: `1px solid ${t.border}` }}>
        <span style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Age {patient.age} · {patient.gender} · Blood: <strong style={{ color: t.accent }}>{patient.blood}</strong></span>
        <span style={{ marginLeft: "auto" }}><StatusBadge status={patient.status} /></span>
      </div>

      <div style={{ display: "flex", gap: 3, padding: "10px 14px 0", background: t.cardBg }}>
        {(["vitals","history","labs"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ flex: 1, padding: "7px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 11, fontWeight: activeTab === tab ? 700 : 400, background: activeTab === tab ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : t.inputBg, color: activeTab === tab ? "#ffffff" : t.subText, textTransform: "capitalize", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
        {activeTab === "vitals" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, animation: "scaleIn 0.25s ease-out" }}>
            {[
              { label: "Blood Pressure", value: patient.bp, Icon: Activity, color: "#ef4444" },
              { label: "SpO₂", value: patient.spo2, Icon: Droplets, color: "#0ea5e9" },
              { label: "Pulse Rate", value: patient.pulse, Icon: Heart, color: "#f43f5e" },
              { label: "Temperature", value: patient.temp, Icon: Thermometer, color: "#f59e0b" },
              { label: "Weight", value: patient.weight, Icon: Weight, color: "#10b981" },
              { label: "Blood Sugar", value: patient.rbs, Icon: FlaskConical, color: "#8b5cf6" },
            ].map(v => (
              <div key={v.label} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <v.Icon size={14} color={v.color} />
                  <span style={{ color: t.subText, fontSize: 9.5, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{v.label}</span>
                </div>
                <div style={{ color: t.text, fontWeight: 700, fontSize: 14, fontFamily: "'Playfair Display', Georgia, serif" }}>{v.value}</div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "history" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "scaleIn 0.25s ease-out" }}>
            <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 14px" }}>
              <div style={{ color: t.accent, fontSize: 10, fontWeight: 700, marginBottom: 6, fontFamily: "'Playfair Display', Georgia, serif" }}>CHIEF COMPLAINT</div>
              <div style={{ color: t.text, fontSize: 12, fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }}>{patient.complaint}</div>
            </div>
            <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 14px" }}>
              <div style={{ color: t.accent, fontSize: 10, fontWeight: 700, marginBottom: 6, fontFamily: "'Playfair Display', Georgia, serif" }}>DIAGNOSIS</div>
              <div style={{ color: t.text, fontSize: 12, fontFamily: "'Libre Baskerville', Georgia, serif' }}" }}>{patient.diagnosis}</div>
            </div>
            <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 14px" }}>
              <div style={{ color: t.accent, fontSize: 10, fontWeight: 700, marginBottom: 6, fontFamily: "'Playfair Display', Georgia, serif" }}>ALLERGIES</div>
              <div style={{ color: "#fca5a5", fontSize: 12, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{patient.allergy}</div>
            </div>
          </div>
        )}
        {activeTab === "labs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "scaleIn 0.25s ease-out" }}>
            {[{ test: "CBC", result: "Hb 11.2, WBC 9400, Plt 2.1L", flag: "Normal" }, { test: "ECG", result: "Sinus Tachycardia, LVH", flag: "Abnormal" }, { test: "Echo", result: "EF 55%, Diastolic Dysfunction", flag: "Review" }].map(l => (
              <div key={l.test} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ color: t.text, fontWeight: 700, fontSize: 12, fontFamily: "'Playfair Display', Georgia, serif" }}>{l.test}</div>
                  <span style={{ background: l.flag === "Normal" ? "rgba(16,185,129,0.2)" : l.flag === "Abnormal" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)", color: l.flag === "Normal" ? "#34d399" : l.flag === "Abnormal" ? "#fca5a5" : "#fbbf24", fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{l.flag}</span>
                </div>
                <div style={{ color: t.subText, fontSize: 10.5, fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }}>{l.result}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "0 14px 14px", display: "flex", gap: 8 }}>
        <button onClick={() => setScreen("doc_prescription")} style={{ flex: 1, background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 12, padding: "12px 0", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "'Playfair Display', Georgia, serif" }}>
          <Pill size={14} /> Write Rx
        </button>
        <button style={{ flex: 1, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "12px 0", color: "#34d399", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Refer</button>
        <button style={{ flex: 1, background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 12, padding: "12px 0", color: "#a78bfa", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Done</button>
      </div>
    </div>
  );
};

const DocIPD = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="IPD Inpatients" subtitle="28 Patients · 3 Critical" onBack={() => setScreen("doc_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
        {IPD_PATIENTS.map((p, i) => (
          <div key={p.id} style={{ background: t.cardBg, border: `1px solid ${p.status === "Critical" ? "rgba(239,68,68,0.4)" : t.border}`, borderRadius: 16, padding: "14px", animation: `fadeInUp ${0.1 + i * 0.08}s ease-out` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ color: t.text, fontWeight: 700, fontSize: 13, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>{p.name}</div>
                <div style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Bed {p.bed} · {p.ward} · {p.days} days</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
            <div style={{ color: t.subText, fontSize: 11, marginBottom: 8, fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }}>Dx: {p.diagnosis}</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ label: "Notes", Icon: ClipboardList }, { label: "Meds", Icon: Pill }, { label: "Vitals", Icon: Activity }].map(btn => (
                <button key={btn.label} style={{ flex: 1, background: "rgba(37,99,235,0.15)", border: `1px solid rgba(37,99,235,0.25)`, borderRadius: 10, padding: "7px 0", color: t.accent, fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 3, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  <btn.Icon size={10} /> {btn.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DocPrescription = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const [search, setSearch] = useState("");
  const [selectedMeds, setSelectedMeds] = useState<string[]>(["Amlodipine 5mg", "Pantoprazole 40mg"]);
  const filtered = MEDICINES.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Prescription Writer" subtitle="Patient: Rahul Sharma · P10-2024-001" onBack={() => setScreen("doc_patient_detail")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 14 }} className="no-scrollbar">
        <div>
          <label style={{ color: t.accent, fontSize: 10, fontWeight: 600, display: "block", marginBottom: 6, letterSpacing: 1, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>DIAGNOSIS (ICD-10)</label>
          <input defaultValue="I11.0 — Hypertensive Heart Disease" style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 12px", color: t.text, fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }} />
        </div>
        <div>
          <label style={{ color: t.accent, fontSize: 10, fontWeight: 600, display: "block", marginBottom: 6, letterSpacing: 1, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>SEARCH MEDICINE</label>
          <div style={{ position: "relative" }}>
            <Search size={13} color={t.accent} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Type medicine name..."
              style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 12px 10px 28px", color: t.text, fontSize: 12, outline: "none", boxSizing: "border-box", marginBottom: 8, fontFamily: "'Libre Baskerville', Georgia, serif" }} />
          </div>
          {search && (
            <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 12, maxHeight: 130, overflowY: "auto" }}>
              {filtered.map(m => (
                <button key={m.name} onClick={() => { if (!selectedMeds.includes(m.name)) setSelectedMeds(prev => [...prev, m.name]); setSearch(""); }}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", width: "100%", border: "none", background: "transparent", cursor: "pointer", borderBottom: `1px solid ${t.border}` }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ color: t.text, fontSize: 11, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{m.name}</div>
                    <div style={{ color: t.subText, fontSize: 9, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{m.category}</div>
                  </div>
                  <span style={{ color: "#34d399", fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>+ Add</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <label style={{ color: t.accent, fontSize: 10, fontWeight: 600, display: "block", marginBottom: 6, letterSpacing: 1, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>PRESCRIBED MEDICINES ({selectedMeds.length})</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selectedMeds.map((med, i) => (
              <div key={i} style={{ background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 12, padding: "10px 12px", animation: "scaleIn 0.2s ease-out" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ color: t.text, fontSize: 12, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{med}</div>
                  <button onClick={() => setSelectedMeds(prev => prev.filter(m => m !== med))} style={{ background: "rgba(239,68,68,0.2)", border: "none", borderRadius: 8, color: "#fca5a5", fontSize: 10, padding: "2px 6px", cursor: "pointer" }}>
                    <XCircle size={12} color="#fca5a5" />
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
                  {["1-0-1", "After Food", "30 Days"].map((v, j) => (
                    <div key={j} style={{ background: t.inputBg, borderRadius: 8, padding: "4px 6px", textAlign: "center", color: t.subText, fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{v}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label style={{ color: t.accent, fontSize: 10, fontWeight: 600, display: "block", marginBottom: 6, letterSpacing: 1, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>CLINICAL NOTES</label>
          <textarea rows={3} defaultValue="Monitor BP daily. Follow up in 2 weeks. Salt-restricted diet advised."
            style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 12px", color: t.text, fontSize: 11, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }} />
        </div>
        <div style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 12, padding: "12px", textAlign: "center" }}>
          <div style={{ color: t.accent, fontSize: 10, marginBottom: 4, letterSpacing: 1, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>DIGITAL SIGNATURE</div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", color: t.text, fontSize: 20, fontWeight: 700 }}>Dr. Arjun Mehta</div>
          <div style={{ color: t.subText, fontSize: 9, marginTop: 4, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>MCI Reg: DL/12345 · Cardiology</div>
        </div>
        <div style={{ display: "flex", gap: 10, paddingBottom: 16 }}>
          <button style={{ flex: 1, background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 12, padding: "12px 0", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            <Printer size={13} /> Save & Print
          </button>
          <button style={{ flex: 1, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 12, padding: "12px 0", color: "#34d399", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            <Share2 size={13} /> Share PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const DocVideo = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const [inCall, setInCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const t = THEMES[theme];

  if (inCall) return (
    <div style={{ background: "#000", height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      <div style={{ flex: 1, background: "linear-gradient(135deg,#0a1628,#1a3a6e)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <div style={{ width: 80, height: 80, background: "linear-gradient(135deg,#2563eb,#06b6d4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(37,99,235,0.5)" }}>
          <User size={38} color="#fff" strokeWidth={1.5} />
        </div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>Mrs. Deepa K.</div>
        <div style={{ color: "#34d399", fontSize: 12, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>● Connected · 00:04:32</div>
      </div>
      <div style={{ position: "absolute", top: 20, right: 12, width: 80, height: 110, background: "linear-gradient(135deg,#1a3a6e,#0a1628)", borderRadius: 14, border: "2px solid rgba(147,197,253,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <DoctorAvatar size={50} />
      </div>
      <div style={{ background: "rgba(0,0,0,0.85)", padding: "16px 24px 20px", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {[
          { Icon: muted ? MicOff : Mic, action: () => setMuted(m => !m), color: muted ? "#ef4444" : "#374151", big: false },
          { Icon: videoOff ? VideoOff : Video, action: () => setVideoOff(v => !v), color: videoOff ? "#ef4444" : "#374151", big: false },
          { Icon: Phone, action: () => setInCall(false), color: "#ef4444", big: true },
          { Icon: MessageSquare, action: () => {}, color: "#374151", big: false },
          { Icon: Monitor, action: () => {}, color: "#374151", big: false },
        ].map((ctrl, i) => (
          <button key={i} onClick={ctrl.action} style={{ background: ctrl.color, border: "none", borderRadius: "50%", width: ctrl.big ? 56 : 44, height: ctrl.big ? 56 : 44, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ctrl.Icon size={ctrl.big ? 22 : 18} color="#fff" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Video Consultations" subtitle="Today's Teleconsult Sessions" onBack={() => setScreen("doc_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
        {VIDEO_CALLS.map((call, i) => (
          <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "14px", animation: `fadeInUp ${0.1 + i * 0.08}s ease-out` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ color: t.text, fontWeight: 700, fontSize: 13, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>{call.patient}</div>
                <div style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{call.id} · {call.duration}</div>
              </div>
              <span style={{ background: call.status === "completed" ? "rgba(16,185,129,0.2)" : "rgba(37,99,235,0.2)", color: call.status === "completed" ? "#34d399" : "#93c5fd", fontSize: 9, padding: "3px 8px", borderRadius: 8, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {call.status === "completed" ? "✓ Done" : `${call.time}`}
              </span>
            </div>
            {call.status === "upcoming" && (
              <button onClick={() => setInCall(true)} style={{ width: "100%", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 10, padding: "10px 0", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "'Playfair Display', Georgia, serif" }}>
                <Video size={13} /> Start Video Call
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const DocLeave = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Leave & Coverage" subtitle="Apply / Track Leave" onBack={() => setScreen("doc_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 14 }} className="no-scrollbar">
        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "16px" }}>
          <div style={{ color: t.accent, fontSize: 12, fontWeight: 700, marginBottom: 12, fontFamily: "'Playfair Display', Georgia, serif" }}>Apply for Leave</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <label style={{ color: t.subText, fontSize: 10, display: "block", marginBottom: 4, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>LEAVE TYPE</label>
              <select style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 10px", color: t.text, fontSize: 12, outline: "none", fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                <option>Casual Leave</option><option>Medical Leave</option><option>Earned Leave</option><option>Emergency Leave</option>
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[{ label: "FROM DATE", val: "2025-02-24" }, { label: "TO DATE", val: "2025-02-26" }].map(d => (
                <div key={d.label}>
                  <label style={{ color: t.subText, fontSize: 10, display: "block", marginBottom: 4, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{d.label}</label>
                  <input type="date" defaultValue={d.val} style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 10px", color: t.text, fontSize: 11, outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <div>
              <label style={{ color: t.subText, fontSize: 10, display: "block", marginBottom: 4, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>COVERAGE BY</label>
              <select style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 10px", color: t.text, fontSize: 12, outline: "none", fontFamily: "'Libre Baskerville', Georgia, serif" }}>
                <option>Dr. Sunita Rao (Cardiology)</option><option>Dr. Kavitha Pillai (Cardiology)</option>
              </select>
            </div>
            <button style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 12, padding: "12px 0", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif" }}>Submit Leave Request</button>
          </div>
        </div>
        <div>
          <div style={{ color: t.accent, fontSize: 11, fontWeight: 700, marginBottom: 8, fontFamily: "'Playfair Display', Georgia, serif" }}>LEAVE BALANCE</div>
          {[{ type: "Casual Leave", used: 3, total: 12 }, { type: "Medical Leave", used: 0, total: 7 }, { type: "Earned Leave", used: 8, total: 30 }].map(l => (
            <div key={l.type} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 12px", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: t.text, fontSize: 12, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{l.type}</span>
              <span style={{ color: t.accent, fontSize: 12, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif" }}>{l.total - l.used} / {l.total} days</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DocNotifications = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  const notifIcons: Record<string, React.ElementType> = { critical: Siren, appointment: Calendar, ipd: BedDouble, admin: Bell };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Notifications" subtitle="3 Critical · 2 New" onBack={() => setScreen("doc_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
        {DOC_NOTIFICATIONS.map((n, i) => {
          const Icon = notifIcons[n.type] || Bell;
          return (
            <div key={i} style={{ background: n.type === "critical" ? "rgba(220,38,38,0.12)" : t.cardBg, border: `1px solid ${n.type === "critical" ? "rgba(239,68,68,0.3)" : t.border}`, borderRadius: 14, padding: "12px 14px", display: "flex", gap: 10, animation: `fadeInUp ${0.1 + i * 0.06}s ease-out` }}>
              <div style={{ flexShrink: 0, padding: 6, background: n.type === "critical" ? "rgba(239,68,68,0.2)" : "rgba(37,99,235,0.12)", borderRadius: 10 }}>
                <Icon size={16} color={n.type === "critical" ? "#fca5a5" : t.accent} />
              </div>
              <div>
                <div style={{ color: n.type === "critical" ? "#fca5a5" : t.text, fontWeight: 700, fontSize: 12, fontFamily: "'Playfair Display', Georgia, serif" }}>{n.title}</div>
                <div style={{ color: t.subText, fontSize: 10, marginTop: 2, fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }}>{n.msg}</div>
                <div style={{ color: t.subText, fontSize: 9, marginTop: 4, opacity: 0.6, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{n.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DocReports = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Reports & Analytics" subtitle="February 2025" onBack={() => setScreen("doc_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 14 }} className="no-scrollbar">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          <QuickStatCard label="Total OPD" value="1,580" IconComp={Users} color="linear-gradient(135deg,#2563eb,#3b82f6)" theme={theme} />
          <QuickStatCard label="Satisfaction" value="4.9★" IconComp={Star} color="linear-gradient(135deg,#f59e0b,#fbbf24)" theme={theme} />
          <QuickStatCard label="Revenue" value="₹4.2L" IconComp={TrendingUp} color="linear-gradient(135deg,#059669,#10b981)" theme={theme} />
        </div>
        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "14px" }}>
          <div style={{ color: t.accent, fontSize: 11, fontWeight: 700, marginBottom: 12, fontFamily: "'Playfair Display', Georgia, serif" }}>MONTHLY OPD TREND</div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={MONTHLY_OPD} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis dataKey="month" tick={{ fill: t.accent, fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: t.accent, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 10, color: t.text, fontSize: 11 }} />
              <Bar dataKey="count" fill="url(#blueGrad2)" radius={[6,6,0,0]} />
              <defs>
                <linearGradient id="blueGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" /><stop offset="100%" stopColor="#1a3a6e" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {[{ label: "Avg OPD / Day", value: "52" }, { label: "Procedures Done", value: "28" }, { label: "Referrals Sent", value: "14" }, { label: "Follow-ups", value: "186" }].map(stat => (
          <div key={stat.label} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: t.subText, fontSize: 12, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{stat.label}</span>
            <span style={{ color: t.text, fontWeight: 700, fontSize: 14, fontFamily: "'Playfair Display', Georgia, serif" }}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DocProfile = ({ setScreen, setRole, setCurrentScreen, theme, setTheme }: {
  setScreen: (s: Screen) => void; setRole: (r: Role) => void;
  setCurrentScreen: (s: Screen) => void; theme: ThemeMode; setTheme: (t: ThemeMode) => void;
}) => {
  const [activeTab, setActiveTab] = useState<"info" | "schedule" | "settings" | "reviews">("info");
  const [notifs, setNotifs] = useState(true);
  const [lang, setLang] = useState("English");
  const t = THEMES[theme];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="My Profile" subtitle="Project 10 Hospital Staff Portal" onBack={() => setScreen("doc_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 12 }} className="no-scrollbar">
        <div style={{ background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 20, padding: "18px", textAlign: "center", animation: "scaleIn 0.35s ease-out" }}>
          <DoctorAvatar size={68} />
          <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 17, marginTop: 10, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>Dr. Arjun Mehta</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>MD, DM Cardiology</div>
          <div style={{ color: "#93c5fd", fontSize: 10, marginTop: 4, fontFamily: "'Libre Baskerville', Georgia, serif" }}>MCI Reg: DL/12345 · 18 yrs exp · ★ 4.9</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 8 }}>
            {["Cardiology", "Electrophysiology"].map(s => (
              <span key={s} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "3px 10px", color: "#fff", fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{s}</span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", background: t.inputBg, borderRadius: 14, padding: 4, gap: 3 }}>
          {([{ id: "info", label: "Info" }, { id: "schedule", label: "Schedule" }, { id: "settings", label: "Settings" }, { id: "reviews", label: "Reviews" }] as const).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, padding: "7px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 10, fontWeight: activeTab === tab.id ? 700 : 400, background: activeTab === tab.id ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "transparent", color: activeTab === tab.id ? "#ffffff" : t.subText, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "info" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "scaleIn 0.2s ease-out" }}>
            {[
              { Icon: Shield,      label: "Employee ID",       value: "P10-D-001" },
              { Icon: Building2,   label: "Department",        value: "Cardiology, Electrophysiology" },
              { Icon: Phone,       label: "Direct Line",       value: "+91 80-1234-0001" },
              { Icon: Send,        label: "Email",             value: "arjun.mehta@p10hospital.in" },
              { Icon: MapPin,      label: "OPD Room",          value: "Room 302, OPD Block A" },
              { Icon: AlertCircle, label: "Emergency Contact", value: "+91 99999 00001" },
            ].map(item => (
              <div key={item.label} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <item.Icon size={14} color={t.accent} />
                <div>
                  <div style={{ color: t.subText, fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{item.label}</div>
                  <div style={{ color: t.text, fontSize: 12, fontWeight: 600, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "schedule" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "scaleIn 0.2s ease-out" }}>
            <div style={{ color: t.accent, fontSize: 11, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif" }}>WEEKLY SCHEDULE</div>
            {[
              { day: "Monday",    time: "9:00 AM – 1:00 PM, 2:00 PM – 5:00 PM", room: "OPD-302" },
              { day: "Tuesday",   time: "9:00 AM – 1:00 PM",                     room: "OPD-302" },
              { day: "Wednesday", time: "9:00 AM – 5:00 PM",                     room: "OPD-302" },
              { day: "Thursday",  time: "9:00 AM – 1:00 PM",                     room: "OPD-302" },
              { day: "Friday",    time: "9:00 AM – 1:00 PM, 2:00 PM – 5:00 PM", room: "Cardiac Cath Lab" },
              { day: "Saturday",  time: "9:00 AM – 1:00 PM",                     room: "OPD-302" },
              { day: "Sunday",    time: "On Call Only",                           room: "—" },
            ].map(d => (
              <div key={d.day} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ color: t.text, fontSize: 12, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{d.day}</div>
                  <span style={{ background: "rgba(37,99,235,0.15)", color: "#93c5fd", fontSize: 9, padding: "2px 8px", borderRadius: 8, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{d.room}</span>
                </div>
                <div style={{ color: t.subText, fontSize: 10, marginTop: 2, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{d.time}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "scaleIn 0.2s ease-out" }}>
            <div style={{ color: t.accent, fontSize: 11, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif" }}>APP SETTINGS</div>
            <div style={{ background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 14, padding: "14px" }}>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 600, marginBottom: 10, fontFamily: "'Playfair Display', Georgia, serif", display: "flex", alignItems: "center", gap: 6 }}>
                <Sun size={14} color="#fbbf24" /> Display Theme
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {([{ id: "light" as ThemeMode, Icon: Sun, label: "Light" }, { id: "semidark" as ThemeMode, Icon: Sunset, label: "Semi Dark" }, { id: "dark" as ThemeMode, Icon: Moon, label: "Dark" }]).map(opt => (
                  <button key={opt.id} onClick={() => setTheme(opt.id)}
                    style={{ flex: 1, background: theme === opt.id ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)", border: `2px solid ${theme === opt.id ? "#fff" : "transparent"}`, borderRadius: 10, padding: "8px 4px", cursor: "pointer", color: "#fff", fontSize: 9, fontWeight: theme === opt.id ? 700 : 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: "all 0.2s" }}>
                    <opt.Icon size={14} color="#fff" />{opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: t.text, fontSize: 12, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif", display: "flex", alignItems: "center", gap: 5 }}><Bell size={13} /> Notifications</div>
                  <div style={{ color: t.subText, fontSize: 9, marginTop: 2, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{notifs ? "All alerts enabled" : "Muted"}</div>
                </div>
                <button onClick={() => setNotifs(n => !n)} style={{ background: notifs ? "#2563eb" : t.inputBg, border: `2px solid ${notifs ? "#2563eb" : t.border}`, borderRadius: 14, width: 44, height: 26, cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                  <div style={{ width: 18, height: 18, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: notifs ? 22 : 2, transition: "left 0.2s" }} />
                </button>
              </div>
            </div>
            <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "14px" }}>
              <div style={{ color: t.text, fontSize: 12, fontWeight: 600, marginBottom: 8, fontFamily: "'Cormorant Garamond', Georgia, serif", display: "flex", alignItems: "center", gap: 5 }}><Globe size={13} /> Language</div>
              <div style={{ display: "flex", gap: 6 }}>
                {["English", "हिंदी", "ಕನ್ನಡ"].map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{ flex: 1, background: lang === l ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : t.inputBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 0", color: lang === l ? "#fff" : t.text, fontSize: 10, fontWeight: lang === l ? 700 : 400, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif", transition: "all 0.2s" }}>{l}</button>
                ))}
              </div>
            </div>
            {[{ Icon: Lock, label: "Privacy & Security", sub: "2FA Active · Biometric On" }, { Icon: Settings, label: "App Version", sub: "Project 10 v2.0 (Build 2025.2)" }].map(item => (
              <div key={item.label} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                <item.Icon size={16} color={t.accent} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: t.text, fontSize: 12, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{item.label}</div>
                  <div style={{ color: t.subText, fontSize: 10, marginTop: 1, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{item.sub}</div>
                </div>
                <ChevronRight size={14} color={t.subText} />
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "scaleIn 0.2s ease-out" }}>
            <div style={{ background: "linear-gradient(135deg,rgba(245,158,11,0.12),rgba(251,191,36,0.06))", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 16, padding: "14px", textAlign: "center" }}>
              <div style={{ color: "#fbbf24", fontSize: 36, fontWeight: 900, fontFamily: "'Playfair Display', Georgia, serif" }}>4.9</div>
              <div style={{ color: "#fbbf24", fontSize: 18, fontFamily: "'Playfair Display', Georgia, serif" }}>★★★★★</div>
              <div style={{ color: t.subText, fontSize: 11, marginTop: 4, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>Based on 128 reviews</div>
            </div>
            {[
              { name: "Rajesh S.", rating: 5, comment: "Excellent doctor. Very thorough and caring.", date: "15 Feb 2025" },
              { name: "Priya M.",  rating: 5, comment: "Best cardiologist in Bangalore. Highly recommend!", date: "10 Feb 2025" },
              { name: "Vikram N.", rating: 4, comment: "Very knowledgeable. Explained everything clearly.", date: "05 Feb 2025" },
            ].map((r, i) => (
              <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ color: t.text, fontSize: 12, fontWeight: 600, fontFamily: "'Playfair Display', Georgia, serif', fontStyle: 'italic' }}" }}>{r.name}</div>
                  <div>
                    <span style={{ color: "#fbbf24", fontSize: 10, fontFamily: "'Playfair Display', Georgia, serif" }}>{"★".repeat(r.rating)}</span>
                    <div style={{ color: t.subText, fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{r.date}</div>
                  </div>
                </div>
                <div style={{ color: t.subText, fontSize: 11, marginTop: 4, fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }}>{r.comment}</div>
              </div>
            ))}
          </div>
        )}

        <button onClick={() => { setRole(null); setCurrentScreen("role"); }}
          style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 14, padding: "14px", color: "#fca5a5", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Playfair Display', Georgia, serif" }}>
          <LogOut size={16} color="#fca5a5" /> Secure Logout
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT SCREENS
// ─────────────────────────────────────────────────────────────────────────────

const PatHome = ({ setScreen, theme, setTheme }: { setScreen: (s: Screen) => void; theme: ThemeMode; setTheme: (t: ThemeMode) => void }) => {
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <div style={{ background: t.headerBg, padding: "14px 16px 20px", animation: "fadeInDown 0.35s ease-out" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 1 }}>UHID: P10-P-2024-5891</div>
            <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 16, fontFamily: "'Playfair Display', Georgia, serif" }}>Hello, Rajesh!</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, display: "flex", alignItems: "center", gap: 4, marginTop: 2, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
              <MapPin size={10} color="rgba(255,255,255,0.6)" /> Project 10 Hospital, Bangalore
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <PatientAvatar size={46} />
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 14, padding: "10px 14px" }}>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 9, fontWeight: 600, marginBottom: 4, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 1, display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={9} color="rgba(255,255,255,0.65)" /> UPCOMING APPOINTMENT
          </div>
          <div style={{ color: "#ffffff", fontSize: 12, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif" }}>Dr. Arjun Mehta — Cardiology</div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, marginTop: 2, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>Tomorrow, 9:00 AM · OPD Room 302</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 14 }} className="no-scrollbar">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { Icon: Building2, label: "Book OPD",      screen: "pat_find_doctor", color: "linear-gradient(135deg,#1a3a6e,#2563eb)" },
            { Icon: Video,     label: "Video Consult",  screen: "pat_video",       color: "linear-gradient(135deg,#0c4a6e,#0ea5e9)" },
            { Icon: ShoppingBag, label: "Pharmacy",    screen: "pat_pharmacy",    color: "linear-gradient(135deg,#064e3b,#059669)" },
            { Icon: FlaskConical, label: "Lab Tests",  screen: "pat_lab",         color: "linear-gradient(135deg,#4c1d95,#7c3aed)" },
            { Icon: ClipboardList, label: "My Records", screen: "pat_records",    color: "linear-gradient(135deg,#78350f,#d97706)" },
            { Icon: Activity,  label: "Vitals",         screen: "pat_vitals",      color: "linear-gradient(135deg,#134e4a,#14b8a6)" },
          ].map(({ Icon, label, screen, color }) => (
            <button key={label} onClick={() => setScreen(screen as Screen)}
              style={{ background: color, border: "none", borderRadius: 16, padding: "14px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.2)", transition: "transform 0.15s" }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.95)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>
              <Icon size={22} color="#fff" strokeWidth={1.5} />
              <span style={{ color: "#ffffff", fontSize: 9.5, fontWeight: 600, textAlign: "center", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{label}</span>
            </button>
          ))}
        </div>

        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 18, padding: "14px", animation: "fadeInUp 0.4s ease-out" }}>
          <div style={{ color: t.text, fontWeight: 700, fontSize: 13, marginBottom: 12, fontFamily: "'Playfair Display', Georgia, serif" }}>My Health Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {[
              { label: "Blood Pressure", value: "138/88", Icon: Activity, color: "#ef4444" },
              { label: "Pulse", value: "76 bpm", Icon: Heart, color: "#f43f5e" },
              { label: "SpO₂", value: "97%", Icon: Droplets, color: "#0ea5e9" },
              { label: "Blood Sugar", value: "210 mg/dL", Icon: FlaskConical, color: "#8b5cf6" },
            ].map(v => (
              <div key={v.label} style={{ background: t.statCard, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <v.Icon size={16} color={v.color} />
                <div>
                  <div style={{ color: t.subText, fontSize: 8.5, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{v.label}</div>
                  <div style={{ color: t.text, fontWeight: 700, fontSize: 12, fontFamily: "'Playfair Display', Georgia, serif" }}>{v.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 18, padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ color: t.text, fontWeight: 700, fontSize: 13, fontFamily: "'Playfair Display', Georgia, serif" }}>Quick Access</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "Billing", Icon: FileText, screen: "pat_billing" },
              { label: "Family", Icon: Users, screen: "pat_family" },
              { label: "Alerts", Icon: Bell, screen: "pat_notifications" },
            ].map(a => (
              <button key={a.label} onClick={() => setScreen(a.screen as Screen)}
                style={{ flex: 1, background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 0", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, transition: "background 0.15s" }}>
                <a.Icon size={16} color={t.accent} />
                <span style={{ color: t.subText, fontSize: 9.5, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
};

const PatFindDoctor = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const t = THEMES[theme];

  if (selectedDept) {
    const doctors = DOCTORS_BY_DEPT[selectedDept] || FALLBACK_DOCTORS(selectedDept);
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
        <SectionHeader title={selectedDept} subtitle="Select a Doctor" onBack={() => setSelectedDept(null)} theme={theme} />
        <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
          {doctors.map((doc, i) => (
            <div key={doc.id} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "14px", animation: `fadeInUp ${0.1 + i * 0.07}s ease-out` }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Stethoscope size={20} color="#fff" strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{ color: t.text, fontWeight: 700, fontSize: 13, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>{doc.name}</div>
                  <div style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{doc.qual}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                    <span style={{ color: "#fbbf24", fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>★ {doc.rating}</span>
                    <span style={{ color: t.subText, fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{doc.exp}</span>
                    <span style={{ color: t.accent, fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{doc.fee}</span>
                  </div>
                </div>
              </div>
              {doc.available ? (
                <button onClick={() => setScreen("pat_book_slot")}
                  style={{ width: "100%", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 10, padding: "9px 0", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Book Appointment
                </button>
              ) : (
                <div style={{ textAlign: "center", color: t.subText, fontSize: 10, padding: "8px 0", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>Not available today</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Find a Doctor" subtitle="Choose Department" onBack={() => setScreen("pat_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
        <div style={{ position: "relative", marginBottom: 4 }}>
          <Search size={13} color={t.accent} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input placeholder="Search speciality..." style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 14px 10px 30px", color: t.text, fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "'Libre Baskerville', Georgia, serif" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {DEPARTMENTS.map((dept, i) => (
            <button key={dept.name} onClick={() => setSelectedDept(dept.name)}
              style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "14px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "transform 0.15s, box-shadow 0.15s", animation: `scaleIn ${0.1 + i * 0.04}s ease-out` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(37,99,235,0.15)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
              <div style={{ background: dept.color + "22", borderRadius: 12, padding: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <dept.Icon size={20} color={dept.color} strokeWidth={1.5} />
              </div>
              <div style={{ color: t.text, fontSize: 9.5, fontWeight: 600, textAlign: "center", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{dept.name}</div>
              <div style={{ color: t.subText, fontSize: 8, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{dept.doctors} doctors</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const PatBookSlot = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const t = THEMES[theme];
  const slots = ["9:00 AM", "10:30 AM", "2:00 PM", "4:30 PM"];

  if (booked) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", background: t.bg, padding: "0 24px", gap: 16 }}>
      <div style={{ background: "rgba(16,185,129,0.12)", borderRadius: 32, padding: 24, animation: "scaleIn 0.3s ease-out" }}>
        <CheckCircle size={56} color="#10b981" strokeWidth={1.5} />
      </div>
      <div style={{ color: "#34d399", fontWeight: 800, fontSize: 20, textAlign: "center", fontFamily: "'Playfair Display', Georgia, serif" }}>Appointment Confirmed!</div>
      <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 20, padding: "18px", width: "100%" }}>
        <div style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>BOOKING REFERENCE</div>
        <div style={{ color: t.text, fontWeight: 800, fontSize: 16, marginTop: 2, fontFamily: "'Playfair Display', Georgia, serif" }}>P10-OPD-{Math.floor(Math.random() * 90000 + 10000)}</div>
        <div style={{ color: t.subText, fontSize: 11, marginTop: 8, fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }}>Dr. Arjun Mehta · Cardiology<br />Tomorrow · {selectedSlot} · OPD Room 302</div>
      </div>
      <button onClick={() => setScreen("pat_home")} style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 14, padding: "12px 28px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif" }}>Back to Home</button>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Book Appointment" subtitle="Dr. Arjun Mehta · Cardiology" onBack={() => setScreen("pat_find_doctor")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 14 }} className="no-scrollbar">
        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "14px", display: "flex", gap: 12 }}>
          <div style={{ width: 52, height: 52, background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Stethoscope size={24} color="#fff" strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ color: t.text, fontWeight: 700, fontSize: 14, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>Dr. Arjun Mehta</div>
            <div style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>MD, DM Cardiology · 18 yrs</div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <span style={{ color: "#fbbf24", fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>★ 4.9</span>
              <span style={{ color: t.accent, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>₹800 / session</span>
            </div>
          </div>
        </div>
        <div>
          <div style={{ color: t.accent, fontSize: 10, fontWeight: 700, marginBottom: 8, letterSpacing: 1, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>SELECT DATE</div>
          <input type="date" defaultValue="2025-02-20" style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 14px", color: t.text, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div>
          <div style={{ color: t.accent, fontSize: 10, fontWeight: 700, marginBottom: 8, letterSpacing: 1, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>AVAILABLE SLOTS</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {slots.map(slot => (
              <button key={slot} onClick={() => setSelectedSlot(slot)}
                style={{ background: selectedSlot === slot ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : t.inputBg, border: `1px solid ${selectedSlot === slot ? "#2563eb" : t.border}`, borderRadius: 12, padding: "10px 0", color: selectedSlot === slot ? "#fff" : t.text, fontSize: 12, fontWeight: selectedSlot === slot ? 700 : 400, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif", transition: "all 0.2s" }}>
                {slot}
              </button>
            ))}
          </div>
        </div>
        <button disabled={!selectedSlot} onClick={() => setBooked(true)}
          style={{ background: selectedSlot ? "linear-gradient(135deg,#2563eb,#1d4ed8)" : "rgba(37,99,235,0.3)", border: "none", borderRadius: 14, padding: "14px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: selectedSlot ? "pointer" : "not-allowed", fontFamily: "'Playfair Display', Georgia, serif" }}>
          {selectedSlot ? `Confirm Booking · ${selectedSlot} →` : "Select a Time Slot"}
        </button>
      </div>
    </div>
  );
};

const PatAppointments = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  const apts = [
    { doctor: "Dr. Arjun Mehta", dept: "Cardiology", date: "20 Feb 2025", time: "9:00 AM", status: "Upcoming", id: "P10-OPD-78291" },
    { doctor: "Dr. Sunita Rao",  dept: "Neurology",  date: "15 Feb 2025", time: "11:00 AM", status: "Completed", id: "P10-OPD-77850" },
    { doctor: "Dr. Meera Nair",  dept: "Pediatrics", date: "01 Feb 2025", time: "8:30 AM", status: "Completed", id: "P10-OPD-76210" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="My Appointments" subtitle={`${apts.length} appointments`} onBack={() => setScreen("pat_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
        {apts.map((a, i) => (
          <div key={a.id} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "14px", animation: `fadeInUp ${0.1 + i * 0.07}s ease-out` }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Stethoscope size={18} color="#fff" strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: t.text, fontWeight: 700, fontSize: 13, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>{a.doctor}</div>
                <div style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{a.dept} · {a.id}</div>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: t.subText, fontSize: 10, display: "flex", alignItems: "center", gap: 4, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                <Calendar size={10} /> {a.date} · {a.time}
              </div>
              {a.status === "Upcoming" && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "5px 10px", color: "#fca5a5", fontSize: 9, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Cancel</button>
                  <button style={{ background: "rgba(37,99,235,0.15)", border: "none", borderRadius: 8, padding: "5px 10px", color: t.accent, fontSize: 9, fontWeight: 600, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Reschedule</button>
                </div>
              )}
            </div>
          </div>
        ))}
        <button onClick={() => setScreen("pat_find_doctor")} style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 14, padding: "14px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Plus size={16} /> Book New Appointment
        </button>
      </div>
    </div>
  );
};

const PatRecords = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  const records = [
    { type: "Prescription", doctor: "Dr. Arjun Mehta", date: "15 Feb 2025", desc: "Amlodipine 5mg · Pantoprazole 40mg", status: "Active" },
    { type: "Lab Report",   doctor: "Pathology Lab",   date: "14 Feb 2025", desc: "CBC, LFT — Normal range",            status: "Ready" },
    { type: "Prescription", doctor: "Dr. Sunita Rao",  date: "01 Feb 2025", desc: "Gabapentin 300mg · Vitamin B12",    status: "Active" },
    { type: "Discharge",    doctor: "Cardiology Dept", date: "10 Jan 2025", desc: "AMI — Complete discharge summary",  status: "Archived" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Health Records" subtitle="Prescriptions · Reports · Discharge" onBack={() => setScreen("pat_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
        {records.map((r, i) => (
          <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", animation: `fadeInUp ${0.1 + i * 0.07}s ease-out` }}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 36, height: 36, background: r.type === "Lab Report" ? "rgba(124,58,237,0.2)" : "rgba(37,99,235,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {r.type === "Lab Report" ? <FlaskConical size={16} color="#a78bfa" /> : <FileText size={16} color="#93c5fd" />}
              </div>
              <div>
                <div style={{ color: t.text, fontSize: 12, fontWeight: 600, fontFamily: "'Playfair Display', Georgia, serif" }}>{r.type}</div>
                <div style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>{r.doctor}</div>
                <div style={{ color: t.subText, fontSize: 9, marginTop: 2, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{r.desc}</div>
                <div style={{ color: t.subText, fontSize: 9, marginTop: 2, display: "flex", alignItems: "center", gap: 3, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  <Calendar size={9} />{r.date}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", fontSize: 9, padding: "3px 8px", borderRadius: 8, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>✓ {r.status}</span>
              <button style={{ background: "rgba(37,99,235,0.15)", border: "none", borderRadius: 10, padding: "6px 10px", color: t.accent, fontSize: 9, fontWeight: 600, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PatLab = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const [cart, setCart] = useState<string[]>([]);
  const [trackMode, setTrackMode] = useState(false);
  const t = THEMES[theme];

  if (trackMode) return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Track Sample" subtitle="Order: P10-LAB-2025-0891" onBack={() => setTrackMode(false)} theme={theme} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", gap: 20 }}>
        {[{ step: "Sample Collected", done: true }, { step: "In Transit to Lab", done: true }, { step: "Processing", done: true }, { step: "Report Ready", done: false }].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.done ? "linear-gradient(135deg,#059669,#10b981)" : t.inputBg, border: `2px solid ${s.done ? "#10b981" : t.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {s.done ? <CheckCircle size={16} color="#fff" /> : <span style={{ color: t.subText, fontSize: 12, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif" }}>{i + 1}</span>}
            </div>
            <div style={{ color: s.done ? t.text : t.subText, fontSize: 12, fontWeight: s.done ? 700 : 400, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: s.done ? "normal" : "italic" }}>{s.step}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Lab Tests" subtitle="Book · Track · Download" onBack={() => setScreen("pat_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
        <button onClick={() => setTrackMode(true)} style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 14, padding: "10px 14px", color: "#34d399", fontSize: 12, fontWeight: 600, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          <Navigation size={13} /> Track Order: P10-LAB-2025-0891 →
        </button>
        <div>
          <div style={{ color: t.accent, fontSize: 11, fontWeight: 700, marginBottom: 8, fontFamily: "'Playfair Display', Georgia, serif" }}>TEST CATALOG</div>
          {LAB_TESTS.map(test => (
            <div key={test.name} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
              <FlaskConical size={16} color={t.accent} />
              <div style={{ flex: 1 }}>
                <div style={{ color: t.text, fontSize: 11, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{test.name}</div>
                <div style={{ color: t.subText, fontSize: 9, marginTop: 2, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{test.category} · {test.time} · {test.price}</div>
              </div>
              <button onClick={() => cart.includes(test.name) ? setCart(c => c.filter(n => n !== test.name)) : setCart(c => [...c, test.name])}
                style={{ background: cart.includes(test.name) ? "rgba(16,185,129,0.15)" : "rgba(37,99,235,0.15)", border: `1px solid ${cart.includes(test.name) ? "rgba(16,185,129,0.4)" : "rgba(37,99,235,0.3)"}`, borderRadius: 10, padding: "6px 10px", color: cart.includes(test.name) ? "#34d399" : t.accent, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {cart.includes(test.name) ? "✓ Added" : "+ Add"}
              </button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 16, padding: "14px", marginTop: 4 }}>
            <div style={{ color: "#ffffff", fontWeight: 700, fontSize: 12, marginBottom: 4, fontFamily: "'Playfair Display', Georgia, serif" }}>{cart.length} Test(s) Selected</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginBottom: 10, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>Home Collection Available · Free Pick-up</div>
            <button style={{ width: "100%", background: "#fff", border: "none", borderRadius: 10, padding: "10px 0", color: "#1d4ed8", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif" }}>Book Home Collection →</button>
          </div>
        )}
      </div>
    </div>
  );
};

const PatPharmacy = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [ordered, setOrdered] = useState(false);
  const t = THEMES[theme];
  const total = Object.entries(cart).reduce((sum, [name, qty]) => {
    const med = MEDICINES.find(m => m.name === name);
    return sum + (med ? parseInt(med.price.replace("₹", "")) * qty : 0);
  }, 0);

  if (ordered) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", background: t.bg, padding: "0 24px", gap: 16 }}>
      <div style={{ background: "rgba(37,99,235,0.12)", borderRadius: 32, padding: 24, animation: "scaleIn 0.3s ease-out" }}>
        <Truck size={56} color="#93c5fd" strokeWidth={1.5} />
      </div>
      <div style={{ color: "#34d399", fontWeight: 800, fontSize: 20, textAlign: "center", fontFamily: "'Playfair Display', Georgia, serif" }}>Order Placed!</div>
      <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 18, padding: "18px", width: "100%", textAlign: "center" }}>
        <div style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>ORDER ID</div>
        <div style={{ color: t.text, fontWeight: 800, fontSize: 18, marginTop: 2, fontFamily: "'Playfair Display', Georgia, serif" }}>PH-2025-{Math.floor(Math.random() * 9000 + 1000)}</div>
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: 12 }}>
          {["Placed", "Packed", "Delivery", "Delivered"].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: i === 0 ? "#10b981" : t.inputBg, margin: "0 auto 4px" }} />
              <div style={{ color: i === 0 ? "#34d399" : t.subText, fontSize: 8, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => { setOrdered(false); setCart({}); }} style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 14, padding: "12px 28px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif" }}>Continue Shopping</button>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Pharmacy" subtitle="Order Medicines · Home Delivery" onBack={() => setScreen("pat_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 8 }} className="no-scrollbar">
        <div style={{ position: "relative" }}>
          <Search size={13} color={t.accent} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input placeholder="Search medicines..." style={{ width: "100%", background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 14px 10px 30px", color: t.text, fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "'Libre Baskerville', Georgia, serif" }} />
        </div>
        {MEDICINES.map(m => (
          <div key={m.name} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <Pill size={16} color={t.accent} />
            <div style={{ flex: 1 }}>
              <div style={{ color: t.text, fontSize: 12, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{m.name}</div>
              <div style={{ color: t.subText, fontSize: 9, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{m.category} · {m.price}/strip</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {cart[m.name] ? (
                <>
                  <button onClick={() => setCart(c => ({ ...c, [m.name]: Math.max(0, (c[m.name] || 0) - 1) }))} style={{ background: "rgba(239,68,68,0.2)", border: "none", borderRadius: 8, width: 26, height: 26, color: "#fca5a5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Minus size={12} /></button>
                  <span style={{ color: t.text, fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: "center", fontFamily: "'Playfair Display', Georgia, serif" }}>{cart[m.name]}</span>
                  <button onClick={() => setCart(c => ({ ...c, [m.name]: (c[m.name] || 0) + 1 }))} style={{ background: "rgba(16,185,129,0.2)", border: "none", borderRadius: 8, width: 26, height: 26, color: "#34d399", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={12} /></button>
                </>
              ) : (
                <button onClick={() => setCart(c => ({ ...c, [m.name]: 1 }))} style={{ background: "rgba(37,99,235,0.15)", border: `1px solid rgba(37,99,235,0.3)`, borderRadius: 10, padding: "6px 10px", color: t.accent, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>+ Add</button>
              )}
            </div>
          </div>
        ))}
        {total > 0 && (
          <div style={{ background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 16, padding: "14px", marginTop: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{Object.keys(cart).filter(k => cart[k] > 0).length} Items</span>
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 14, fontFamily: "'Playfair Display', Georgia, serif" }}>₹{total}</span>
            </div>
            <button onClick={() => setOrdered(true)} style={{ width: "100%", background: "#fff", border: "none", borderRadius: 10, padding: "11px 0", color: "#1d4ed8", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Playfair Display', Georgia, serif" }}>
              Place Order · ₹{total} →
            </button>
          </div>
        )}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
};

const PatSOS = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const [triggered, setTriggered] = useState(false);
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Emergency SOS" subtitle="24/7 Emergency Services" onBack={() => setScreen("pat_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }} className="no-scrollbar">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 16 }}>
          <button onClick={() => setTriggered(!triggered)}
            style={{ width: 130, height: 130, borderRadius: "50%", background: triggered ? "linear-gradient(135deg,#16a34a,#22c55e)" : "linear-gradient(135deg,#dc2626,#ef4444)", border: `4px solid ${triggered ? "#22c55e" : "#ef4444"}`, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${triggered ? "rgba(34,197,94,0.5)" : "rgba(220,38,38,0.6)"}`, gap: 4, animation: triggered ? "none" : "pulse-ring 2s infinite" }}>
            {triggered ? <CheckCircle size={40} color="#fff" strokeWidth={2} /> : <Ambulance size={40} color="#fff" strokeWidth={1.5} />}
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "'Playfair Display', Georgia, serif" }}>{triggered ? "CALLED" : "SOS"}</span>
          </button>
          <div style={{ color: triggered ? "#34d399" : "#fca5a5", fontSize: 13, fontWeight: 700, textAlign: "center", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
            {triggered ? "✓ Ambulance Dispatched · ETA 8 min" : "Tap for Emergency Ambulance"}
          </div>
        </div>

        {triggered && (
          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 16, padding: "14px", width: "100%", animation: "scaleIn 0.3s ease-out" }}>
            <div style={{ color: "#34d399", fontSize: 11, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 5, fontFamily: "'Playfair Display', Georgia, serif" }}>
              <Ambulance size={13} /> AMBULANCE EN ROUTE
            </div>
            <div style={{ color: t.text, fontSize: 12, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Vehicle: KA-01-AM-4521</div>
            <div style={{ color: t.subText, fontSize: 10, marginTop: 2, fontFamily: "'Libre Baskerville', Georgia, serif" }}>Driver: Suresh · +91 98001 23456</div>
            <div style={{ background: t.inputBg, borderRadius: 12, padding: "16px", marginTop: 8, textAlign: "center" }}>
              <Navigation size={32} color={t.subText} style={{ opacity: 0.4, margin: "0 auto" }} />
              <div style={{ color: t.subText, fontSize: 9, marginTop: 6, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>Real-time tracking active</div>
            </div>
          </div>
        )}

        <div style={{ width: "100%" }}>
          <div style={{ color: t.accent, fontSize: 11, fontWeight: 700, marginBottom: 8, fontFamily: "'Playfair Display', Georgia, serif" }}>QUICK EMERGENCY CALLS</div>
          {[
            { label: "Project 10 Hospital ER", num: "080-1234-5678", Icon: Building2 },
            { label: "National Ambulance",      num: "108",           Icon: Ambulance },
            { label: "Emergency (Police)",      num: "100",           Icon: Shield },
            { label: "Personal: Meera (Wife)", num: "+91 98765 11111", Icon: PhoneCall },
          ].map(c => (
            <div key={c.label} style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <c.Icon size={16} color="#fca5a5" />
                <div>
                  <div style={{ color: t.text, fontSize: 11, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{c.label}</div>
                  <div style={{ color: "#fca5a5", fontSize: 10, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{c.num}</div>
                </div>
              </div>
              <button style={{ background: "rgba(239,68,68,0.3)", border: "none", borderRadius: 10, padding: "7px 12px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Phone size={12} color="#fff" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PatVideo = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const [inCall, setInCall] = useState(false);
  const t = THEMES[theme];
  if (inCall) return (
    <div style={{ background: "#000", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, background: "linear-gradient(135deg,#0a1628,#0c4a6e)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <div style={{ background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: "50%", padding: 18, boxShadow: "0 0 30px rgba(37,99,235,0.5)" }}>
          <Stethoscope size={48} color="#fff" strokeWidth={1.5} />
        </div>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>Dr. Arjun Mehta</div>
        <div style={{ color: "#34d399", fontSize: 11, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>● Connected · 00:02:18</div>
      </div>
      <div style={{ background: "rgba(0,0,0,0.85)", padding: "16px 24px 20px", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {[{ Icon: Mic, color: "#374151" }, { Icon: Video, color: "#374151" }, { Icon: Phone, color: "#ef4444", big: true }, { Icon: MessageSquare, color: "#374151" }].map((ctrl, i) => (
          <button key={i} onClick={() => { if (i === 2) setInCall(false); }} style={{ background: ctrl.color, border: "none", borderRadius: "50%", width: (ctrl as any).big ? 56 : 44, height: (ctrl as any).big ? 56 : 44, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ctrl.Icon size={(ctrl as any).big ? 22 : 18} color="#fff" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Video Consultation" subtitle="Teleconsult · Project 10 Hospital" onBack={() => setScreen("pat_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
        <div style={{ background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 16, padding: "16px" }}>
          <div style={{ color: t.accent, fontSize: 10, fontWeight: 700, marginBottom: 8, letterSpacing: 1, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>SCHEDULED SESSION</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 14, padding: 10 }}>
              <Stethoscope size={28} color="#fff" strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ color: t.text, fontWeight: 700, fontSize: 14, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>Dr. Arjun Mehta</div>
              <div style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Cardiology · VC-2025-4521</div>
              <div style={{ color: "#fbbf24", fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Today · 5:00 PM · 15 mins</div>
            </div>
          </div>
          <button onClick={() => setInCall(true)} style={{ width: "100%", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 12, padding: "12px 0", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "'Playfair Display', Georgia, serif" }}>
            <Video size={14} /> Join Video Call Now
          </button>
        </div>
        <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: "14px" }}>
          <div style={{ color: "#34d399", fontSize: 10, fontWeight: 700, marginBottom: 6, letterSpacing: 1, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>LAST CONSULTATION — Rx</div>
          <div style={{ color: t.text, fontSize: 11, fontWeight: 600, fontFamily: "'Playfair Display', Georgia, serif" }}>Dr. Arjun Mehta · 15 Jan 2025</div>
          <div style={{ color: t.subText, fontSize: 10, marginTop: 4, fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }}>Amlodipine 5mg · 1-0-1 · 30D<br />Pantoprazole 40mg · 0-0-1 · 30D</div>
          <button style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "7px 14px", color: "#34d399", fontSize: 10, fontWeight: 600, cursor: "pointer", marginTop: 8, display: "flex", alignItems: "center", gap: 5, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            <FileText size={11} /> Download Rx PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const PatVitals = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Health Vitals Tracker" subtitle="Log · Monitor · Analyze" onBack={() => setScreen("pat_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 12 }} className="no-scrollbar">
        <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "14px" }}>
          <div style={{ color: t.accent, fontSize: 11, fontWeight: 700, marginBottom: 10, fontFamily: "'Playfair Display', Georgia, serif" }}>WEEKLY BP TREND</div>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={BP_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} />
              <XAxis dataKey="day" tick={{ fill: t.accent, fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: t.accent, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 10, color: t.text, fontSize: 11 }} />
              <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="diastolic" stroke="#93c5fd" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <span style={{ color: "#ef4444", fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>— Systolic</span>
            <span style={{ color: "#93c5fd", fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>— Diastolic</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {[
            { label: "BP", value: "138/88", Icon: Activity, color: "#ef4444", change: "+2" },
            { label: "Pulse", value: "76 bpm", Icon: Heart, color: "#f43f5e", change: "–" },
            { label: "SpO₂", value: "97%", Icon: Droplets, color: "#0ea5e9", change: "–" },
            { label: "Weight", value: "82 kg", Icon: Weight, color: "#10b981", change: "+0.5" },
            { label: "Temp", value: "98.6°F", Icon: Thermometer, color: "#f59e0b", change: "–" },
            { label: "RBS", value: "210 mg/dL", Icon: FlaskConical, color: "#8b5cf6", change: "+12" },
          ].map(v => (
            <div key={v.label} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                <v.Icon size={13} color={v.color} />
                <span style={{ color: t.subText, fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{v.label}</span>
              </div>
              <div style={{ color: t.text, fontWeight: 700, fontSize: 14, fontFamily: "'Playfair Display', Georgia, serif" }}>{v.value}</div>
              <div style={{ color: v.change !== "–" ? "#fbbf24" : t.subText, fontSize: 8.5, marginTop: 2, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{v.change !== "–" ? `${v.change} vs yesterday` : "Stable"}</div>
            </div>
          ))}
        </div>

        <button style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 14, padding: "14px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "'Playfair Display', Georgia, serif" }}>
          <Plus size={16} /> Log Today's Vitals
        </button>
      </div>
    </div>
  );
};

const PatBilling = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  const bills = [
    { desc: "OPD Consultation — Dr. Arjun Mehta", amount: "₹800", date: "15 Feb 2025", status: "Paid" },
    { desc: "CBC + LFT Lab Tests",                amount: "₹1,000", date: "14 Feb 2025", status: "Paid" },
    { desc: "Medicines — Metformin, Amlodipine",  amount: "₹340", date: "13 Feb 2025", status: "Pending" },
    { desc: "ECG + Echo",                         amount: "₹2,200", date: "10 Jan 2025", status: "Paid" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Billing & Payments" subtitle="Transaction History" onBack={() => setScreen("pat_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
        <div style={{ background: "linear-gradient(135deg,#1a3a6e,#2563eb)", borderRadius: 16, padding: "16px", textAlign: "center" }}>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: 1 }}>TOTAL SPEND — Feb 2025</div>
          <div style={{ color: "#ffffff", fontWeight: 900, fontSize: 28, fontFamily: "'Playfair Display', Georgia, serif" }}>₹4,340</div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>4 transactions</div>
        </div>
        {bills.map((b, i) => (
          <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", animation: `fadeInUp ${0.1 + i * 0.06}s ease-out` }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <div style={{ color: t.text, fontSize: 11, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{b.desc}</div>
              <div style={{ color: t.subText, fontSize: 9, marginTop: 2, display: "flex", alignItems: "center", gap: 3, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                <Calendar size={9} />{b.date}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: t.text, fontWeight: 700, fontSize: 13, fontFamily: "'Playfair Display', Georgia, serif" }}>{b.amount}</div>
              <span style={{ background: b.status === "Paid" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: b.status === "Paid" ? "#34d399" : "#fbbf24", fontSize: 9, padding: "2px 7px", borderRadius: 8, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{b.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PatNotifications = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  const icons: Record<string, React.ElementType> = { reminder: Calendar, report: FlaskConical, medicine: Pill, hospital: Building2 };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Notifications" subtitle="4 New" onBack={() => setScreen("pat_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
        {PAT_NOTIFICATIONS.map((n, i) => {
          const Icon = icons[n.type] || Bell;
          return (
            <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 14px", display: "flex", gap: 10, animation: `fadeInUp ${0.1 + i * 0.06}s ease-out` }}>
              <div style={{ background: "rgba(37,99,235,0.12)", borderRadius: 10, padding: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color={t.accent} />
              </div>
              <div>
                <div style={{ color: t.text, fontWeight: 700, fontSize: 12, fontFamily: "'Playfair Display', Georgia, serif" }}>{n.title}</div>
                <div style={{ color: t.subText, fontSize: 10, marginTop: 2, fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }}>{n.msg}</div>
                <div style={{ color: t.subText, fontSize: 9, marginTop: 4, opacity: 0.6, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{n.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PatFamily = ({ setScreen, theme }: { setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Family Members" subtitle={`${FAMILY_MEMBERS.length} members linked`} onBack={() => setScreen("pat_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 10 }} className="no-scrollbar">
        {FAMILY_MEMBERS.map((m, i) => (
          <div key={m.uhid} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "14px", display: "flex", gap: 10, alignItems: "center", animation: `fadeInUp ${0.1 + i * 0.07}s ease-out` }}>
            <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#0c4a6e,#0ea5e9)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <User size={20} color="#fff" strokeWidth={1.5} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: t.text, fontWeight: 700, fontSize: 13, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>{m.name}</div>
              <div style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{m.relation} · Age {m.age} · {m.blood}</div>
              <div style={{ color: t.accent, fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{m.uhid}</div>
            </div>
            <button style={{ background: "rgba(37,99,235,0.15)", border: "none", borderRadius: 10, padding: "6px 10px", color: t.accent, fontSize: 9, fontWeight: 600, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif" }}>View</button>
          </div>
        ))}
        <button style={{ background: t.inputBg, border: `1px dashed ${t.border}`, borderRadius: 16, padding: "14px 0", color: t.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          <Plus size={16} /> Add Family Member
        </button>
      </div>
    </div>
  );
};

const PatProfile = ({ setScreen, setRole, setCurrentScreen, theme, setTheme }: {
  setScreen: (s: Screen) => void; setRole: (r: Role) => void;
  setCurrentScreen: (s: Screen) => void; theme: ThemeMode; setTheme: (t: ThemeMode) => void;
}) => {
  const [activeTab, setActiveTab] = useState<"info" | "health" | "settings" | "emergency">("info");
  const [notifs, setNotifs] = useState(true);
  const [lang, setLang] = useState("English");
  const t = THEMES[theme];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: t.bg }}>
      <SectionHeader title="Patient Profile" subtitle="Project 10 Hospital" onBack={() => setScreen("pat_home")} theme={theme} />
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 12 }} className="no-scrollbar">
        <div style={{ background: "linear-gradient(135deg,#0c4a6e,#0ea5e9)", borderRadius: 20, padding: "18px", textAlign: "center", animation: "scaleIn 0.35s ease-out" }}>
          <PatientAvatar size={68} />
          <div style={{ color: "#ffffff", fontWeight: 800, fontSize: 17, marginTop: 10, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>Rajesh Sharma</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 2, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>Age 52 · Male · B+</div>
          <div style={{ color: "#bae6fd", fontSize: 10, marginTop: 4, fontFamily: "'Libre Baskerville', Georgia, serif" }}>UHID: P10-P-2024-5891</div>
        </div>

        <div style={{ display: "flex", background: t.inputBg, borderRadius: 14, padding: 4, gap: 3 }}>
          {([{ id: "info", label: "Info" }, { id: "health", label: "Health" }, { id: "settings", label: "Settings" }, { id: "emergency", label: "SOS" }] as const).map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, padding: "7px 0", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 10, fontWeight: activeTab === tab.id ? 700 : 400, background: activeTab === tab.id ? "linear-gradient(135deg,#0ea5e9,#0c4a6e)" : "transparent", color: activeTab === tab.id ? "#ffffff" : t.subText, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "info" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "scaleIn 0.2s ease-out" }}>
            {[
              { Icon: Shield,   label: "UHID",           value: "P10-P-2024-5891" },
              { Icon: Phone,    label: "Mobile",          value: "+91 98765 43210" },
              { Icon: Send,     label: "Email",           value: "rajesh@gmail.com" },
              { Icon: MapPin,   label: "Address",         value: "12, MG Road, Bangalore" },
              { Icon: Activity, label: "Primary Doctor",  value: "Dr. Arjun Mehta, Cardiology" },
            ].map(item => (
              <div key={item.label} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <item.Icon size={14} color={t.accent} />
                <div>
                  <div style={{ color: t.subText, fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{item.label}</div>
                  <div style={{ color: t.text, fontSize: 12, fontWeight: 600, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "health" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "scaleIn 0.2s ease-out" }}>
            {[
              { label: "Blood Group", value: "B Positive (B+)" },
              { label: "Allergies", value: "Penicillin — SEVERE" },
              { label: "Chronic Conditions", value: "Hypertension · Type 2 Diabetes" },
              { label: "Current Medications", value: "Amlodipine 5mg · Metformin 500mg" },
              { label: "Last Check-up", value: "15 Feb 2025" },
              { label: "Insurance", value: "Star Health · Policy: SH-123456" },
            ].map(item => (
              <div key={item.label} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 12, padding: "10px 14px" }}>
                <div style={{ color: t.subText, fontSize: 9, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{item.label}</div>
                <div style={{ color: t.text, fontSize: 12, fontWeight: 600, marginTop: 2, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{item.value}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "settings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "scaleIn 0.2s ease-out" }}>
            <div style={{ background: "linear-gradient(135deg,#0c4a6e,#0ea5e9)", borderRadius: 14, padding: "14px" }}>
              <div style={{ color: "#fff", fontSize: 12, fontWeight: 600, marginBottom: 10, fontFamily: "'Playfair Display', Georgia, serif", display: "flex", alignItems: "center", gap: 6 }}>
                <Sun size={14} color="#fbbf24" /> Display Theme
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {([{ id: "light" as ThemeMode, Icon: Sun, label: "Light" }, { id: "semidark" as ThemeMode, Icon: Sunset, label: "Semi Dark" }, { id: "dark" as ThemeMode, Icon: Moon, label: "Dark" }]).map(opt => (
                  <button key={opt.id} onClick={() => setTheme(opt.id)}
                    style={{ flex: 1, background: theme === opt.id ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)", border: `2px solid ${theme === opt.id ? "#fff" : "transparent"}`, borderRadius: 10, padding: "8px 4px", cursor: "pointer", color: "#fff", fontSize: 9, fontWeight: theme === opt.id ? 700 : 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: "'Cormorant Garamond', Georgia, serif", transition: "all 0.2s" }}>
                    <opt.Icon size={14} color="#fff" />{opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: t.text, fontSize: 12, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif", display: "flex", alignItems: "center", gap: 5 }}><Bell size={13} /> Notifications</div>
                  <div style={{ color: t.subText, fontSize: 9, marginTop: 2, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{notifs ? "All alerts enabled" : "Muted"}</div>
                </div>
                <button onClick={() => setNotifs(n => !n)} style={{ background: notifs ? "#0ea5e9" : t.inputBg, border: `2px solid ${notifs ? "#0ea5e9" : t.border}`, borderRadius: 14, width: 44, height: 26, cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                  <div style={{ width: 18, height: 18, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: notifs ? 22 : 2, transition: "left 0.2s" }} />
                </button>
              </div>
            </div>
            <div style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "14px" }}>
              <div style={{ color: t.text, fontSize: 12, fontWeight: 600, marginBottom: 8, fontFamily: "'Cormorant Garamond', Georgia, serif", display: "flex", alignItems: "center", gap: 5 }}><Globe size={13} /> Language</div>
              <div style={{ display: "flex", gap: 6 }}>
                {["English", "हिंदी", "ಕನ್ನಡ"].map(l => (
                  <button key={l} onClick={() => setLang(l)} style={{ flex: 1, background: lang === l ? "linear-gradient(135deg,#0ea5e9,#0c4a6e)" : t.inputBg, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 0", color: lang === l ? "#fff" : t.text, fontSize: 10, fontWeight: lang === l ? 700 : 400, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif", transition: "all 0.2s" }}>{l}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "emergency" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, animation: "scaleIn 0.2s ease-out" }}>
            <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 14, padding: "12px 14px" }}>
              <div style={{ color: "#fca5a5", fontSize: 10, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 5, fontFamily: "'Playfair Display', Georgia, serif" }}>
                <AlertTriangle size={12} color="#fca5a5" /> IN CASE OF EMERGENCY
              </div>
              <div style={{ color: t.text, fontSize: 11, fontWeight: 600, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Immediately inform medical staff of:</div>
              <div style={{ color: t.subText, fontSize: 10, marginTop: 4, fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic" }}>Blood Group: B+ · Allergies: Penicillin · Conditions: HTN, DM Type 2</div>
            </div>
            {[
              { name: "Meera Sharma",  relation: "Spouse (Primary)", phone: "+91 98765 11111" },
              { name: "Aryan Sharma",  relation: "Son",               phone: "+91 96543 22222" },
              { name: "Dr. Arjun Mehta", relation: "Primary Doctor", phone: "+91 80-1234-0001" },
            ].map((c, i) => (
              <div key={i} style={{ background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: 14, padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: t.text, fontSize: 12, fontWeight: 600, fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic" }}>{c.name}</div>
                  <div style={{ color: t.subText, fontSize: 10, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{c.relation}</div>
                  <div style={{ color: t.accent, fontSize: 10, fontWeight: 600, fontFamily: "'Libre Baskerville', Georgia, serif" }}>{c.phone}</div>
                </div>
                <button style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "8px 12px", color: "#34d399", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <Phone size={14} color="#34d399" />
                </button>
              </div>
            ))}
            <button style={{ background: t.inputBg, border: `1px dashed ${t.border}`, borderRadius: 14, padding: "12px 0", color: t.accent, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'Cormorant Garamond', Georgia, serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Plus size={14} /> Add Emergency Contact
            </button>
          </div>
        )}

        <button onClick={() => { setRole(null); setCurrentScreen("role"); }}
          style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 14, padding: "14px", color: "#fca5a5", fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Playfair Display', Georgia, serif" }}>
          <LogOut size={16} color="#fca5a5" /> Logout
        </button>
      </div>
    </div>
  );
};

// ─── BOTTOM NAVIGATION ────────────────────────────────────────────────────────
const DocBottomNav = ({ screen, setScreen, theme }: { screen: Screen; setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  const navItems = [
    { Icon: Home,         label: "Home",    screen: "doc_home"          as Screen },
    { Icon: Calendar,     label: "OPD",     screen: "doc_opd"           as Screen },
    { Icon: BedDouble,    label: "IPD",     screen: "doc_ipd"           as Screen },
    { Icon: Bell,         label: "Alerts",  screen: "doc_notifications" as Screen },
    { Icon: User,         label: "Profile", screen: "doc_profile"       as Screen },
  ];
  return (
    <div style={{ display: "flex", background: t.navBg, borderTop: `1px solid ${t.border}`, backdropFilter: "blur(20px)", padding: "8px 0 12px", flexShrink: 0 }}>
      {navItems.map(nav => {
        const active = screen === nav.screen;
        return (
          <button key={nav.label} onClick={() => setScreen(nav.screen)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", transition: "all 0.2s" }}>
            <nav.Icon size={active ? 22 : 18} color={active ? "#2563eb" : t.subText} style={{ transition: "all 0.2s" }} />
            <span style={{ fontSize: 9, fontWeight: active ? 700 : 400, color: active ? "#2563eb" : t.subText, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{nav.label}</span>
            {active && <div style={{ width: 18, height: 2, background: "#2563eb", borderRadius: 1 }} />}
          </button>
        );
      })}
    </div>
  );
};

const PatBottomNav = ({ screen, setScreen, theme }: { screen: Screen; setScreen: (s: Screen) => void; theme: ThemeMode }) => {
  const t = THEMES[theme];
  const navItems: { Icon: React.ElementType; label: string; screen: Screen; sos?: boolean }[] = [
    { Icon: Home,         label: "Home",    screen: "pat_home"         },
    { Icon: Calendar,     label: "Appts",   screen: "pat_appointments" },
    { Icon: Ambulance,    label: "SOS",     screen: "pat_sos",          sos: true },
    { Icon: ClipboardList, label: "Records", screen: "pat_records"     },
    { Icon: User,         label: "Profile", screen: "pat_profile"      },
  ];
  return (
    <div style={{ display: "flex", background: t.navBg, borderTop: `1px solid ${t.border}`, backdropFilter: "blur(20px)", padding: "8px 0 12px", flexShrink: 0, position: "relative" }}>
      {navItems.map(nav => {
        const active = screen === nav.screen;
        return (
          <button key={nav.label} onClick={() => setScreen(nav.screen)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "transparent", border: "none", cursor: "pointer", padding: "4px 0", position: "relative" }}>
            {nav.sos ? (
              <div style={{ width: 42, height: 42, background: "linear-gradient(135deg,#dc2626,#ef4444)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: -18, boxShadow: "0 4px 16px rgba(220,38,38,0.5)", border: `3px solid ${t.navBg}`, animation: "pulse-ring 2.5s infinite" }}>
                <Ambulance size={18} color="#fff" strokeWidth={1.5} />
              </div>
            ) : (
              <nav.Icon size={active ? 22 : 18} color={active ? "#0ea5e9" : t.subText} style={{ transition: "all 0.2s" }} />
            )}
            <span style={{ fontSize: 9, fontWeight: active ? 700 : 400, color: nav.sos ? "#fca5a5" : active ? "#0ea5e9" : t.subText, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{nav.label}</span>
            {active && !nav.sos && <div style={{ width: 18, height: 2, background: "#0ea5e9", borderRadius: 1 }} />}
          </button>
        );
      })}
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [role, setRole] = useState<Role>(null);
  const [selectedPatient, setSelectedPatient] = useState<typeof OPD_PATIENTS[0] | null>(null);
  const [theme, setTheme] = useState<ThemeMode>("light");

  const handleRoleSelect = useCallback((r: Role) => { setRole(r); setCurrentScreen("login"); }, []);
  const handleLogin     = useCallback(() => setCurrentScreen("otp"), []);
  const handleVerify    = useCallback(() => {
    if (role === "doctor") setCurrentScreen("doc_home");
    else setCurrentScreen("pat_home");
  }, [role]);

  const isDocScreen = currentScreen.startsWith("doc_");
  const isPatScreen = currentScreen.startsWith("pat_");

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":  return <SplashScreen onDone={() => setCurrentScreen("role")} />;
      case "role":    return <RoleSelection onSelect={handleRoleSelect} />;
      case "login":   return <LoginScreen role={role} onLogin={handleLogin} onBack={() => setCurrentScreen("role")} />;
      case "otp":     return <OTPScreen role={role} onVerify={handleVerify} onBack={() => setCurrentScreen("login")} />;
      case "doc_home":           return <DocHome setScreen={setCurrentScreen} theme={theme} setTheme={setTheme} />;
      case "doc_opd":            return <DocOPD setScreen={setCurrentScreen} setSelectedPatient={setSelectedPatient} theme={theme} />;
      case "doc_patient_detail": return <DocPatientDetail patient={selectedPatient} setScreen={setCurrentScreen} theme={theme} />;
      case "doc_ipd":            return <DocIPD setScreen={setCurrentScreen} theme={theme} />;
      case "doc_prescription":   return <DocPrescription setScreen={setCurrentScreen} theme={theme} />;
      case "doc_video":          return <DocVideo setScreen={setCurrentScreen} theme={theme} />;
      case "doc_leave":          return <DocLeave setScreen={setCurrentScreen} theme={theme} />;
      case "doc_notifications":  return <DocNotifications setScreen={setCurrentScreen} theme={theme} />;
      case "doc_reports":        return <DocReports setScreen={setCurrentScreen} theme={theme} />;
      case "doc_profile":        return <DocProfile setScreen={setCurrentScreen} setRole={setRole} setCurrentScreen={setCurrentScreen} theme={theme} setTheme={setTheme} />;
      case "pat_home":           return <PatHome setScreen={setCurrentScreen} theme={theme} setTheme={setTheme} />;
      case "pat_find_doctor":    return <PatFindDoctor setScreen={setCurrentScreen} theme={theme} />;
      case "pat_book_slot":      return <PatBookSlot setScreen={setCurrentScreen} theme={theme} />;
      case "pat_appointments":   return <PatAppointments setScreen={setCurrentScreen} theme={theme} />;
      case "pat_records":        return <PatRecords setScreen={setCurrentScreen} theme={theme} />;
      case "pat_lab":            return <PatLab setScreen={setCurrentScreen} theme={theme} />;
      case "pat_pharmacy":       return <PatPharmacy setScreen={setCurrentScreen} theme={theme} />;
      case "pat_sos":            return <PatSOS setScreen={setCurrentScreen} theme={theme} />;
      case "pat_video":          return <PatVideo setScreen={setCurrentScreen} theme={theme} />;
      case "pat_vitals":         return <PatVitals setScreen={setCurrentScreen} theme={theme} />;
      case "pat_billing":        return <PatBilling setScreen={setCurrentScreen} theme={theme} />;
      case "pat_notifications":  return <PatNotifications setScreen={setCurrentScreen} theme={theme} />;
      case "pat_family":         return <PatFamily setScreen={setCurrentScreen} theme={theme} />;
      case "pat_profile":        return <PatProfile setScreen={setCurrentScreen} setRole={setRole} setCurrentScreen={setCurrentScreen} theme={theme} setTheme={setTheme} />;
      default: return null;
    }
  };

  const outerBg = theme === "light" ? "#dde4f0" : "#030a14";

  return (
    <div style={{ minHeight: "100vh", background: outerBg, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 10px", fontFamily: "'Libre Baskerville', Georgia, 'Times New Roman', serif", transition: "background 0.4s" }}>
      {/* iPhone 16 Frame */}
      <div style={{
        width: 393, minWidth: 393, maxWidth: 393,
        height: "88vh", maxHeight: 852,
        background: "#000",
        borderRadius: 54,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 0 0 2px #2a2a2a, 0 0 0 4px #1a1a1a, 0 30px 80px rgba(0,0,0,0.8), 0 0 60px rgba(37,99,235,0.08)",
        position: "relative",
        border: "1px solid #333",
      }}>
        {/* Physical Buttons */}
        <div style={{ position: "absolute", left: -3, top: 120, width: 3, height: 40, background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: -3, top: 175, width: 3, height: 40, background: "#2a2a2a", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", right: -3, top: 150, width: 3, height: 70, background: "#2a2a2a", borderRadius: "0 2px 2px 0" }} />

        <StatusBar theme={theme} />

        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {renderScreen()}
          </div>
        </div>

        {isDocScreen && !["doc_patient_detail","doc_prescription","doc_video","doc_leave","doc_notifications","doc_reports"].includes(currentScreen) && (
          <DocBottomNav screen={currentScreen} setScreen={setCurrentScreen} theme={theme} />
        )}
        {isPatScreen && !["pat_find_doctor","pat_book_slot","pat_lab","pat_pharmacy","pat_video","pat_vitals","pat_billing","pat_notifications","pat_family"].includes(currentScreen) && (
          <PatBottomNav screen={currentScreen} setScreen={setCurrentScreen} theme={theme} />
        )}

        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 6, paddingTop: 4, background: theme === "light" ? "rgba(240,244,255,0.98)" : "rgba(0,0,0,0.95)", flexShrink: 0 }}>
          <div style={{ width: 120, height: 4, background: theme === "light" ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)", borderRadius: 2 }} />
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", textAlign: "center", color: "rgba(147,197,253,0.3)", fontSize: 10, letterSpacing: 2, fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic" }}>
        PROJECT 10 HOSPITAL · HEALTHCARE PLATFORM · v2.0
      </div>
    </div>
  );
};

export default Index;
