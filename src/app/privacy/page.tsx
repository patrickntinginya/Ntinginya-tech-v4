import { LegalPage } from "@/components/sections/LegalPage";
import { contactInfo } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Ntinginya Tech handles contact messages, website advertising and other personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      crumb="Privacy Policy"
      title="Privacy Policy"
      intro="How Ntinginya Tech collects, uses and protects personal information on this website."
      sections={[
        {
          heading: "Information we collect",
          body: (
            <>
              <p>
                <strong>Contact form.</strong> When you send us a message we collect the details you type: your name,
                email address, phone number (optional), company (optional), subject (optional) and message.
              </p>
              <p>
                <strong>Spam and abuse protection.</strong> To limit repeated submissions we store a one-way, keyed hash of
                your network address with your message. We do not store the address itself.
              </p>
              <p>
                <strong>Visitors.</strong> Browsing this website does not require an account. Our pages include third-party
                advertising delivered by Adsterra. We do not currently operate a first-party analytics dashboard.
              </p>
            </>
          ),
        },
        {
          heading: "Accounts, advertising and cookies",
          body: (
            <>
              <p>
                Only Ntinginya Tech administrators can sign in. When an administrator signs in, our authentication
                provider sets session cookies needed to keep them signed in. Public visitors are not given sign-in
                cookies.
              </p>
              <p>
                Adsterra and its advertising partners may use cookies, device identifiers or similar technologies and
                process technical information (which may include IP address, browser or device details, and ad
                interactions) to deliver or measure advertising, subject to their own practices and applicable law.
                Ntinginya Tech does not control how third parties process information through their services. Ads are
                not loaded on administrator, login or account-related routes.
              </p>
            </>
          ),
        },
        {
          heading: "How we use information",
          body: (
            <p>
              We use contact-form details only to read and reply to your enquiry and to keep a record of it. We do not sell
              your information.
            </p>
          ),
        },
        {
          heading: "Service providers",
          body: (
            <>
              <p>We use these providers to run the website. They process data on our behalf:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Supabase: database, authentication and image storage, where contact messages and site content are stored.</li>
                <li>Resend: sends us an email notification when a contact message arrives. The notification contains the details you submitted.</li>
                <li>Netlify: hosts the website and may keep standard server logs.</li>
                <li>Adsterra: delivers advertising on public pages and may process information as described in its own privacy materials.</li>
              </ul>
            </>
          ),
        },
        {
          heading: "Retention and security",
          body: (
            <p>
              Contact messages are kept for as long as we need them to respond and keep our records, and can be deleted
              on request. Access to stored messages is limited to authorised administrators, and the database enforces
              access rules. No method of transmission or storage is perfectly secure, but we take reasonable steps to
              protect your information.
            </p>
          ),
        },
        {
          heading: "Your rights",
          body: (
            <p>
              You can ask us to tell you what personal information we hold about you, to correct it, or to delete it,
              subject to applicable data-protection law. Write to us at the address below.
            </p>
          ),
        },
        {
          heading: "Changes",
          body: <p>If we change how this website handles personal information, we will update this page and its date.</p>,
        },
        {
          heading: "Contact",
          body: (
            <p>
              Questions about this policy or a request concerning your information can be sent to {contactInfo.email}.
              For information about data handled directly by an advertising provider, please also consult that provider&apos;s
              privacy materials.
            </p>
          ),
        },
      ]}
    />
  );
}
