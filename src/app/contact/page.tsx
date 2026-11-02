import { ContactSection } from "@/components/sections/ContactSection";
import { PageHero } from "@/components/sections/PageHero";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact Ntinginya Tech with questions, corrections, story ideas or responsible advertising and sponsorship enquiries.",
  path: "/contact",
});

type SearchParams = { subject?: string | string[] };

export default async function ContactPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { subject } = await searchParams;
  const defaultSubject = (Array.isArray(subject) ? subject[0] : subject)?.slice(0, 200) ?? "";

  return (
    <>
      <PageHero
        crumb="Contact"
        title="Get in touch."
        description="Send a question, suggest a story, report a correction or enquire about responsible advertising and sponsorship."
      />
      <ContactSection defaultSubject={defaultSubject} />
    </>
  );
}
