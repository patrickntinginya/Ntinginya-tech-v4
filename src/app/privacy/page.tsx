import { LegalPage } from "@/components/sections/LegalPage";
import { contactInfo } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Ntinginya Tech handles personal information submitted through this website.",
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
                <strong>Visitors.</strong> Browsing this website does not require an account. We do not run advertising or
                analytics trackers on this website.
              </p>
            </>
          ),
        },
        {
          heading: "Accounts and cookies",
          body: (
            <p>
              Only Ntinginya Tech administrators can sign in. When an administrator signs in, our authentication provider
              sets session cookies that keep them signed in and expire after a period of time. These cookies are needed
              for the sign-in to work. Public visitors are not given sign-in cookies.
            </p>
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
          body: <p>Questions about this policy can be sent to {contactInfo.email}.</p>,
        },
      ]}
    />
  );
}
