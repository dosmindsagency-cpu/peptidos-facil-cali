import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Baby,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FlaskConical,
  HeartPulse,
  LockKeyhole,
  Moon,
  Scale,
  ShieldCheck,
  Sparkles,
  UserRoundSearch,
  Zap,
} from "lucide-react";

export type HomeLinkCard = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const quickAccessItems: HomeLinkCard[] = [
  { title: "Aprende", description: "Guías claras y actualizadas sobre péptidos.", href: "/aprende", icon: BookOpen },
  { title: "Calculadoras", description: "Herramientas simples para organizar información.", href: "/calculadoras", icon: Scale },
  { title: "Pep", description: "Explora preguntas frecuentes con tu asistente educativo.", href: "/pep", icon: BrainCircuit },
  { title: "Dónde comprar", description: "Información sobre proveedores y criterios de evaluación.", href: "/donde-comprar", icon: UserRoundSearch },
];

export const goalItems: HomeLinkCard[] = [
  { title: "Control de peso", description: "Conceptos y preguntas para explorar con contexto.", href: "/aprende?objetivo=peso", icon: Scale },
  { title: "Recuperación", description: "Aprende sobre hábitos, descanso y recuperación.", href: "/aprende?objetivo=recuperacion", icon: Activity },
  { title: "Composición corporal", description: "Organiza conceptos para entender mejor la información.", href: "/aprende?objetivo=composicion", icon: FlaskConical },
  { title: "Energía", description: "Recursos educativos para conversar con más claridad.", href: "/aprende?objetivo=energia", icon: Zap },
  { title: "Envejecimiento saludable", description: "Una mirada amplia, informada y sin promesas.", href: "/aprende?objetivo=longevidad", icon: Sparkles },
  { title: "Sueño y bienestar", description: "Explora definiciones y preguntas frecuentes.", href: "/aprende?objetivo=sueno", icon: Moon },
  { title: "Salud metabólica", description: "Comprende términos y fuentes con calma.", href: "/aprende?objetivo=metabolica", icon: HeartPulse },
  { title: "Rendimiento", description: "Información para orientar tu propia investigación.", href: "/aprende?objetivo=rendimiento", icon: Baby },
];

export const trustItems = [
  { title: "Información basada en evidencia", description: "Priorizamos contexto, claridad y fuentes que puedas revisar.", icon: CheckCircle2 },
  { title: "Privacidad y seguridad", description: "Diseñamos la plataforma con protección y transparencia desde la base.", icon: LockKeyhole },
  { title: "Actualizaciones constantes", description: "Mantenemos los contenidos claros, útiles y alineados con nueva información.", icon: ShieldCheck },
  { title: "Orientación educativa", description: "Te ayudamos a formular mejores preguntas, sin sustituir a un profesional.", icon: CircleHelp },
];

export const featuredContent = [
  { category: "Conceptos básicos", title: "¿Qué es un péptido?", summary: "Una introducción clara para entender qué son y cómo se describen.", readingTime: "4 min", href: "/aprende/que-es-un-peptido" },
  { category: "Guías prácticas", title: "Cómo leer una ficha de producto", summary: "Los datos que conviene identificar y las preguntas que vale la pena hacer.", readingTime: "6 min", href: "/aprende/leer-ficha-de-producto" },
  { category: "Seguridad", title: "Diferencia entre dosis y reconstitución", summary: "Dos conceptos distintos, explicados con lenguaje sencillo.", readingTime: "5 min", href: "/aprende/dosis-y-reconstitucion" },
];

export const toolItems = [
  { title: "Calculadora de reconstitución", description: "Organiza concentraciones, volúmenes y unidades de manera visual.", href: "/calculadoras/reconstitucion", button: "Abrir calculadora", icon: FlaskConical },
  { title: "Calendario personal", description: "Crea una referencia organizada de fechas y recordatorios.", href: "/calendario", button: "Crear calendario", icon: CalendarDays },
];

export const navigationItems = [
  { label: "Inicio", href: "/" },
  { label: "Aprende", href: "/aprende" },
  { label: "Calculadoras", href: "/calculadoras" },
  { label: "Pep", href: "/pep" },
  { label: "Dónde comprar", href: "/donde-comprar" },
  { label: "Recursos", href: "/recursos" },
];

export const footerLegalItems = [
  { label: "Aviso médico", href: "/aviso-medico" },
  { label: "Política de privacidad", href: "/privacidad" },
  { label: "Términos", href: "/terminos" },
  { label: "Divulgación de afiliados", href: "/divulgacion-afiliados" },
];

export const readingIcon = Clock3;
export const homeStatusIcon = ShieldCheck;

export type FeaturedContentItem = (typeof featuredContent)[number];
export type ToolItem = (typeof toolItems)[number];
export type GoalItem = (typeof goalItems)[number];
export type TrustItem = (typeof trustItems)[number];

export const futureHeroAssets = [
  "/bioverso/hero/hero-anatomy-desktop.webp",
  "/bioverso/hero/hero-anatomy-mobile.webp",
] as const;

// Reserved for the official PF BioVerse hero art. The CSS preview remains the complete fallback.
export const heroAssetNote = "Official PF BioVerse hero image slot; intentionally not rendered until approved assets are available.";

export const navIcon = BrainCircuit;
