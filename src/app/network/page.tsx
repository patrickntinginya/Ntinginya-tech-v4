import { Code, FlaskConical, Palette, Megaphone, Sprout, Users, type LucideIcon } from "lucide-react";
import { ExpertForm } from "@/components/sections/ExpertForm";
import { PageHero } from "@/components/sections/PageHero";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Join the Ntinginya Tech Network",
  description:
    "Developers, agriculture experts, designers, researchers, marketers and other professionals: tell Ntinginya Tech about your skills and how you would like to work or collaborate with us.",
  path: "/network",
});

const roles: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: "Developers and engineers", text: "Web, mobile, data and AI work for business and agriculture.", icon: Code },
  { title: "Agriculture and livestock experts", text: "Agronomists, veterinarians, extension officers and practitioners.", icon: Sprout },
  { title: "Designers", text: "Product, interface and brand design for tools people actually use.", icon: Palette },
  { title: "Researchers", text: "Studying problems and testing what works in Tanzanian conditions.", icon: FlaskConical },
  { title: "Marketing and communication", text: "Helping useful products and knowledge reach the people who need them.", icon: Megaphone },
  { title: "Other specialists", text: "If your skills could help, tell us what you do.", icon: Users },
];

export default function NetworkPage() {
  return (
    <>
      <PageHero
        crumb="Expert Network"
        title="Join the Ntinginya Tech Network."
        description="We want to hear from professionals who would like to work or collaborate with us on technology and agriculture. Sending your details does not create a job or a contract; it tells us who you are."
      />

      <Section tone="paper" id="who">
        <SectionHeading
          title="Who we would like to hear from"
          description="Ntinginya Tech is at an early stage. We are building a list of people with useful skills so we can reach out when a project fits."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <li key={role.title} className="reveal flex">
                <Card as="article" surface="white" className="w-full">
                  <Icon aria-hidden="true" className="h-7 w-7 text-field-700" strokeWidth={1.6} />
                  <h3 className="mt-4 font-sans text-lg font-semibold tracking-tight">{role.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-deep/80">{role.text}</p>
                </Card>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section tone="mist" id="apply">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="font-sans text-3xl font-semibold leading-tight tracking-[-0.02em] text-balance sm:text-4xl">Tell us about yourself</h2>
            <p className="mt-4 text-lg leading-relaxed text-deep/80">
              It takes about three minutes. Only name, email, profession, skills and area of interest are required.
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-deep/75">
              We use these details only to consider you for collaboration with Ntinginya Tech. See our privacy policy for how we handle
              information.
            </p>
          </div>
          <div className="rounded-card border border-deep/20 bg-paper p-6 shadow-card sm:p-8 lg:col-span-8">
            <ExpertForm />
          </div>
        </div>
      </Section>
    </>
  );
}
