import { LegalPage } from "@/components/sections/LegalPage";
import { contactInfo } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Disclaimer",
  description: "Important information about the financial, business, technology and digital-opportunity content on Ntinginya Tech.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <LegalPage
      crumb="Disclaimer"
      title="Content disclaimer"
      intro="How to understand and use the information published on Ntinginya Tech."
      sections={[
        {
          heading: "General information",
          body: (
            <p>
              Articles, reviews and guides are for general educational and informational purposes. They are not a
              substitute for advice tailored to your circumstances from a qualified professional. We make reasonable
              efforts to present information clearly, but technologies, products, prices, laws and services can change.
              Check current details with the relevant provider before making a decision.
            </p>
          ),
        },
        {
          heading: "Finance, business and earning opportunities",
          body: (
            <p>
              Nothing on this website is a promise or guarantee of income, investment performance, employment, business
              success or access to a financial product. Every opportunity has risks, costs and eligibility requirements.
              Consider your own situation and seek qualified advice where appropriate. Be cautious of anyone asking for
              upfront payments or promising guaranteed returns.
            </p>
          ),
        },
        {
          heading: "Reviews, sponsorship and affiliate links",
          body: (
            <p>
              A review reflects the information and assessment available to its author when it was written. If an article
              is sponsored or contains an affiliate link, we aim to disclose that clearly. A commercial relationship does
              not remove the need for accurate and responsible coverage. Readers should evaluate products and services
              independently.
            </p>
          ),
        },
        {
          heading: "Corrections and questions",
          body: <p>Send a correction request or question to {contactInfo.email}.</p>,
        },
      ]}
    />
  );
}
