import { Mail, MapPin, Phone } from "lucide-react";
import { contactInfo } from "@/config/site";
import { getSiteSettings } from "@/lib/settings";
import { Section } from "@/components/ui/Section";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { ContactForm } from "./ContactForm";

export async function ContactSection({ defaultSubject = "" }: { defaultSubject?: string }) {
  const settings = await getSiteSettings();
  const contact = { ...contactInfo, email: settings.contactEmail, phone: settings.contactPhone };
  const phoneHref = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;
  return (
    <Section tone="paper" id="contact">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 className="font-sans text-3xl font-semibold leading-tight tracking-[-0.02em] text-balance sm:text-4xl">Tell us about the problem</h2>
          <p className="mt-4 text-lg leading-relaxed text-deep/80">
            Whether you need software, want to explore agriculture technology, are interested in the Masterclass or
            want to collaborate on research, start with a message.
          </p>

          <dl className="mt-10 space-y-6">
            <div className="flex gap-4">
              <Mail aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-field-700" />
              <div>
                <dt className="font-sans text-sm font-semibold">Email</dt>
                <dd>
                  <a href={`mailto:${contact.email}`} className="underline underline-offset-4">
                    {contact.email}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-field-700" />
              <div>
                <dt className="font-sans text-sm font-semibold">Phone</dt>
                <dd>
                  <a href={phoneHref} className="underline underline-offset-4">
                    {contact.phone}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-field-700" />
              <div>
                <dt className="font-sans text-sm font-semibold">Location</dt>
                <dd>{contactInfo.location}</dd>
              </div>
            </div>
          </dl>

          <div className="mt-10">
            <h3 className="font-sans text-sm font-semibold">Social media</h3>
            <SocialLinks className="mt-3" />
          </div>
        </div>

        <div className="rounded-2xl border border-deep/20 bg-mist p-6 sm:p-8 lg:col-span-7">
          <ContactForm defaultSubject={defaultSubject} />
        </div>
      </div>
    </Section>
  );
}
