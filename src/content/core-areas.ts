import { BrainCircuit, Code, Globe, GraduationCap, Sprout, Users, type LucideIcon } from "lucide-react";
import type { StatusKey } from "./types";

export type CoreArea = {
  id: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  href: string;
  chips?: string[];
  note?: string;
  status?: StatusKey;
};

export const coreAreas: CoreArea[] = [
  {
    id: "01",
    title: "Technology & Software Solutions",
    summary: "Build software and digital platforms that solve business and organizational problems.",
    icon: Code,
    href: "/solutions",
    chips: [
      "Business management systems",
      "Custom software",
      "Web applications",
      "Mobile applications",
      "Automation",
      "AI solutions",
      "Data systems",
    ],
  },
  {
    id: "02",
    title: "Agriculture & Livestock Technology",
    summary:
      "Use digital technology to improve farm and livestock management, productivity, access to information and decision-making.",
    icon: Sprout,
    href: "/agriculture",
  },
  {
    id: "03",
    title: "Global AgriTech Innovation Hub",
    summary:
      "A future platform for discovering and studying modern agricultural and livestock technologies from around the world.",
    icon: Globe,
    href: "/innovation",
    status: "future",
    chips: [
      "China",
      "Russia",
      "Japan",
      "Israel",
      "Netherlands",
      "South Korea",
      "India",
      "United States",
      "Brazil",
      "Tanzania",
      "Other African countries",
    ],
    note: "We do not assume that a technology that works in one country will work in Tanzania. Every idea is analyzed, tested and adapted first.",
  },
  {
    id: "04",
    title: "Agriculture & Livestock Masterclass",
    summary:
      "A future professional learning platform for agricultural officers, livestock officers, agribusiness professionals, large-scale farmers, livestock keepers and technology innovators.",
    icon: GraduationCap,
    href: "/masterclass",
    status: "future",
  },
  {
    id: "05",
    title: "Farmer Agent Network",
    summary:
      "A future network designed to help transfer useful agricultural knowledge, technology and digital tools to smallholder farmers.",
    icon: Users,
    href: "/products/farmer-agent-network",
    status: "proposed",
  },
  {
    id: "06",
    title: "AI & Digital Innovation",
    summary:
      "Apply AI and digital systems to improve business processes, education, research, agriculture and other practical use cases.",
    icon: BrainCircuit,
    href: "/solutions#ai",
  },
];
