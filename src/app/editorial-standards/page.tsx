import Link from "next/link";
import { LegalPage } from "@/components/sections/LegalPage";
import { contactInfo } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Editorial Standards",
  description: "How Ntinginya Tech approaches accuracy, sources, AI-assisted writing, corrections and commercial content.",
  path: "/editorial-standards",
});

export default function EditorialStandardsPage() {
  return (
    <LegalPage
      crumb="Editorial Standards"
      title="Editorial standards"
      intro="The principles we use to make technology, business, finance and digital-opportunity information useful and responsible."
      sections={[
        {
          heading: "Accuracy and sources",
          body: (
            <p>
              We aim to check factual claims, names, dates and figures against reliable sources, and to link or identify
              sources where practical. We avoid fabricated statistics, unsupported claims and copied articles. When
              information is uncertain or likely to change, we aim to make that clear.
            </p>
          ),
        },
        {
          heading: "AI-assisted work",
          body: (
            <p>
              AI tools may assist research, outlining or drafting. AI output is not treated as a verified source: a
              person must review, fact-check and materially edit AI-assisted work before publication. We do not publish
              unreviewed AI-generated articles.
            </p>
          ),
        },
        {
          heading: "Finance and online opportunities",
          body: (
            <p>
              Financial and digital-work coverage should explain material risks and avoid guaranteed earnings,
              investment or business claims. Articles are informational, not personalized professional advice. Readers
              should independently confirm eligibility, fees and terms with providers.
            </p>
          ),
        },
        {
          heading: "Reviews and commercial relationships",
          body: (
            <p>
              Sponsored material and affiliate relationships should be identified clearly. Advertising does not
              represent an endorsement or guarantee. Editorial content should not promise positive coverage in exchange
              for payment.
            </p>
          ),
        },
        {
          heading: "Corrections and updates",
          body: (
            <p>
              If you spot a factual error or material change, contact us at {contactInfo.email} with the article link and
              supporting details. We review correction requests and update content when warranted. Material article
              updates may be reflected in the published updated date.
            </p>
          ),
        },
        {
          heading: "Contact",
          body: (
            <p>
              For an editorial question or story idea, use our <Link href="/contact" className="font-semibold underline underline-offset-4">contact page</Link>.
            </p>
          ),
        },
      ]}
    />
  );
}
