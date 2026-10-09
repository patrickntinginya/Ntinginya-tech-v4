import type { StatusKey } from "./types";
import {
  BrainCircuit,
  ClipboardList,
  Database,
  Droplets,
  Globe,
  GraduationCap,
  Radio,
  Sprout,
  Sun,
  Beef,
  type LucideIcon,
} from "lucide-react";

export type AgriArea = { title: string; text: string; icon: LucideIcon };

export const agriAreas: AgriArea[] = [
  { title: "Smart Farming", text: "Exploring practical ways technology can support everyday farm decisions.", icon: Sprout },
  { title: "Farm Management", text: "Simple digital records for plots, inputs, work and production.", icon: ClipboardList },
  { title: "Livestock Management", text: "Digital tools for herd records, health notes and productivity tracking.", icon: Beef },
  { title: "AI in Agriculture", text: "Studying where AI can genuinely help, and where it cannot.", icon: BrainCircuit },
  { title: "IoT & Sensors", text: "Learning which connected devices are affordable and useful in real farm conditions.", icon: Radio },
  { title: "Irrigation Technology", text: "Researching water-efficient approaches suited to local conditions.", icon: Droplets },
  { title: "Greenhouse Technology", text: "Understanding protected cultivation and what it takes to run it well.", icon: Sun },
  { title: "Digital Education", text: "Practical learning for farmers, officers and agribusiness professionals.", icon: GraduationCap },
  { title: "Agricultural Data", text: "Turning records and observations into information people can act on.", icon: Database },
  { title: "Global AgriTech Innovation", text: "Studying how the world farms, then testing what suits Tanzania.", icon: Globe },
];

export const agriJourney = [
  { label: "Global innovation", note: "Find promising ideas worldwide." },
  { label: "Research", note: "Study how and why they work." },
  { label: "Tanzania context", note: "Check fit with local conditions." },
  { label: "Pilot", note: "Test small before going big." },
  { label: "Adaptation", note: "Change what needs changing." },
  { label: "Farmer", note: "Put something useful in real hands." },
];

/** Agriculture & Livestock initiatives. None is operational yet; each badge says exactly where it stands. */
export const agriInitiatives: Array<{ title: string; text: string; audience?: string; status: StatusKey; href?: string }> = [
  {
    title: "Masterclass ya Kilimo na Ufugaji",
    text: "Professional learning on modern agriculture, livestock management and agricultural technology.",
    audience: "Agricultural officers, livestock officers, large-scale farmers, large-scale livestock keepers and agricultural professionals.",
    status: "future",
    href: "/masterclass",
  },
  {
    title: "AgriTech Innovation Hub",
    text: "A place to showcase modern farming and livestock technology from around the world, including China, Russia and other countries, and to test what could suit Tanzania.",
    status: "future",
    href: "/innovation",
  },
  {
    title: "Farmer Education Agent Network",
    text: "A planned network of trained agents who help bring better agricultural education to smallholder farmers in their own communities.",
    audience: "Smallholder farmers, reached through local agents.",
    status: "proposed",
  },
];
