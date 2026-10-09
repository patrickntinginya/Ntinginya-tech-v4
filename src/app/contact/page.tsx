import { ContactSection } from "@/components/sections/ContactSection";
import { PageHero } from "@/components/sections/PageHero";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Talk to Ntinginya Tech about software, agriculture technology, the Masterclass, research or partnerships.",
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
        title="Talk to Ntinginya Tech."
        description="Tell us what you are working on or what problem you want solved."
      />
      <ContactSection defaultSubject={defaultSubject} />
    </>
  );
}
