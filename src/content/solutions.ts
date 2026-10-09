import { BrainCircuit, Briefcase, Code, Globe, Smartphone, Workflow, type LucideIcon } from "lucide-react";

export type Capability = {
  id: string;
  title: string;
  text: string;
  icon: LucideIcon;
  /** Pre-fills the Service field on the contact form. */
  subject: string;
};

export const capabilities: Capability[] = [
  {
    id: "custom-software",
    title: "Software solutions",
    text: "Tailored software built around the way your organization actually works.",
    icon: Code,
    subject: "Software or a custom solution",
  },
  {
    id: "web",
    title: "Web applications",
    text: "Fast, accessible web platforms for businesses, communities and institutions.",
    icon: Globe,
    subject: "Web application",
  },
  {
    id: "mobile",
    title: "Mobile applications",
    text: "Mobile-first tools designed for phones, real networks and everyday use.",
    icon: Smartphone,
    subject: "Mobile application",
  },
  {
    id: "ai",
    title: "AI solutions",
    text: "Practical AI for business processes, education, research and agriculture, used where it genuinely helps.",
    icon: BrainCircuit,
    subject: "AI solution",
  },
  {
    id: "business-systems",
    title: "Business systems",
    text: "Software that helps organizations run stock, sales, customers, expenses and reporting in one place.",
    icon: Briefcase,
    subject: "Business system",
  },
  {
    id: "digital-transformation",
    title: "Digital transformation",
    text: "Moving manual, paper-based work into digital systems step by step, including automation and data systems that make decisions easier.",
    icon: Workflow,
    subject: "Digital transformation",
  },
];

export const engagementSteps = [
  { label: "Conversation", note: "Tell us about the problem and who it affects." },
  { label: "Problem definition", note: "We research, ask questions and agree what to solve first." },
  { label: "Build and test", note: "We design and build a first version, then test it with real users." },
  { label: "Launch and improve", note: "We release, listen and keep improving." },
];
