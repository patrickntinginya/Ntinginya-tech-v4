import { LegalPage } from "@/components/sections/LegalPage";
import { contactInfo } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Terms",
  description: "Terms for using Ntinginya Tech articles, guides and website services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      crumb="Terms"
      title="Terms of Use"
      intro="The terms that apply when you use the Ntinginya Tech website."
      sections={[
        {
          heading: "Using this website",
          body: (
            <p>
              You may use this website for lawful purposes. Please do not attempt to disrupt it, gain unauthorised access
              to it, or submit unlawful, abusive or misleading content through its forms.
            </p>
          ),
        },
        {
          heading: "Information on this website",
          body: (
            <p>
              Articles and guides are provided for general information. They do not replace individual professional
              advice. We aim to keep information useful and accurate, but content may be incomplete, change over time or
              contain errors. Please verify important information before acting on it.
            </p>
          ),
        },
        {
          heading: "Financial and digital-opportunity content",
          body: (
            <p>
              Articles about money, financial services, business and online work are educational. They are not a promise
              of earnings, investment returns, employment or business results, and they are not personal financial,
              legal, tax or investment advice. Results and risks vary by person, location, provider and circumstances.
            </p>
          ),
        },
        {
          heading: "Intellectual property",
          body: (
            <p>
              The Ntinginya Tech name, logo, website design and original content belong to Ntinginya Tech unless stated
              otherwise. You may share links to our pages. Please ask us before copying or republishing our content.
            </p>
          ),
        },
        {
          heading: "Third-party services and links",
          body: (
            <p>
              This website relies on third-party services (for example Supabase, Resend and Netlify) and may link to
              other websites, including advertising and affiliate partners. Some links or content may be sponsored or
              earn a commission; where applicable, we aim to identify that relationship. We do not control third-party
              services or sites and are not responsible for their content or practices.
            </p>
          ),
        },
        {
          heading: "Limitation of liability",
          body: (
            <p>
              To the extent permitted by law, Ntinginya Tech is not liable for losses arising from your use of, or
              inability to use, this website or from reliance on its content. Nothing in these terms limits liability that
              cannot be limited by law.
            </p>
          ),
        },
        {
          heading: "Changes",
          body: <p>We may update these terms. The date at the top of this page shows the latest version.</p>,
        },
        {
          heading: "Contact",
          body: <p>Questions about these terms can be sent to {contactInfo.email}.</p>,
        },
      ]}
    />
  );
}
