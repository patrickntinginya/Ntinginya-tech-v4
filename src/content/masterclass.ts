export const masterclassLevels = [
  { name: "Foundation", text: "Modern agricultural knowledge" },
  { name: "Professional", text: "Technology, management and advanced practices" },
  { name: "Innovation", text: "AgriTech, AI, data and global agricultural innovation" },
];

export const masterclassAudience = [
  "Agricultural officers",
  "Livestock officers",
  "Agricultural professionals",
  "Large-scale farmers",
  "Large-scale livestock keepers",
  "Agribusiness professionals",
  "Technology innovators",
];

/** What the Masterclass is designed to give people. Written as intent, not as results already achieved. */
export const masterclassBenefits = [
  { title: "Practical, not only theory", text: "Lessons built around real farm, livestock and agribusiness situations in Tanzania." },
  { title: "Technology explained plainly", text: "AgriTech, data and AI explained for working professionals, without jargon." },
  { title: "Three clear levels", text: "Start at Foundation, move to Professional, then Innovation, at the pace that suits you." },
  { title: "Built for real connections", text: "Designed to connect learners with experts and with each other." },
];

export type MasterclassSession = { title: string; date: string; location: string; registerHref?: string };
export type MasterclassInstructor = { name: string; role: string; bio?: string };
export type MasterclassTestimonial = { quote: string; name: string; role: string };

/**
 * Add real entries here when they exist and the page will show them. While these lists are empty the
 * page says so honestly. Never add sample sessions, instructors or testimonials.
 */
export const masterclassSessions: MasterclassSession[] = [];
export const masterclassInstructors: MasterclassInstructor[] = [];
export const masterclassTestimonials: MasterclassTestimonial[] = [];

export const masterclassFaq = [
  {
    q: "Can I enrol now?",
    a: "Not yet. The Masterclass has not launched and the curriculum has not been published. You can register your interest and we will tell you when something opens.",
  },
  {
    q: "Who is the Masterclass for?",
    a: "Agricultural and livestock officers, agricultural professionals, large-scale farmers and livestock keepers, agribusiness professionals and technology innovators.",
  },
  {
    q: "What will it cost?",
    a: "Pricing has not been decided. We will publish it here before enrolment opens.",
  },
  {
    q: "What language will it be taught in?",
    a: "This has not been decided yet. Tell us your preference when you register your interest.",
  },
  {
    q: "How do I stay informed?",
    a: "Use the registration link on this page. We will contact you using the details you give us.",
  },
];
