import {
  masterclassBenefits,
  masterclassFaq,
  masterclassInstructors,
  masterclassSessions,
  masterclassTestimonials,
} from "@/content/masterclass";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { listEntries } from "@/lib/cms/entries";
import { formatDate } from "@/lib/format";
import { FaqList } from "./FaqList";

/**
 * Masterclass detail sections. Sessions come from /admin/content (kind: Masterclass session) plus any
 * built-in ones in content/masterclass.ts. Nothing appears unless a real entry exists.
 * Registration is not automatic: the button sends people to ask for information.
 */
export async function MasterclassDetail() {
  const dbSessions = (await listEntries("masterclass", 24)).filter((e) => !e.event_at || new Date(e.event_at).getTime() > Date.now() - 24 * 3600 * 1000);
  const sessions = [
    ...masterclassSessions.map((s) => ({ key: `${s.title}-${s.date}`, title: s.title, date: s.date as string | null, location: s.location as string | null, by: null as string | null, summary: null as string | null, href: s.registerHref ?? null, label: "Request information" })),
    ...dbSessions.map((e) => ({ key: e.id, title: e.title, date: e.event_at, location: e.location, by: e.byline, summary: e.summary, href: e.cta_url, label: e.cta_label || "Request information" })),
  ];
  const instructors = [
    ...masterclassInstructors.map((i) => ({ name: i.name, role: i.role, bio: i.bio ?? null })),
    ...Array.from(new Set(dbSessions.map((e) => e.byline).filter((b): b is string => Boolean(b)))).map((name) => ({ name, role: "Instructor", bio: null as string | null })),
  ];
  return (
    <>
      <Section tone="mist" id="benefits">
        <SectionHeading title="What the Masterclass is designed to give you" />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {masterclassBenefits.map((b) => (
            <li key={b.title} className="reveal flex">
              <Card as="article" surface="white" className="w-full">
                <h3 className="font-sans text-lg font-semibold leading-snug tracking-tight">{b.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-deep/80">{b.text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper" id="sessions">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-sans text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">Upcoming sessions</h2>
            <div className="mt-6">
              {sessions.length === 0 ? (
                <EmptyState title="No sessions are scheduled yet.">
                  <p>Register your interest and we will tell you when the first session is announced.</p>
                </EmptyState>
              ) : (
                <ul className="space-y-4">
                  {sessions.map((s) => (
                    <li key={s.key}>
                      <Card as="article" surface="white">
                        <h3 className="font-sans text-xl font-semibold tracking-tight">{s.title}</h3>
                        <p className="mt-1 text-[0.9375rem] text-deep/75">
                          {s.date ? <time dateTime={s.date}>{formatDate(s.date)}</time> : "Date to be confirmed"}
                          {s.location ? ` · ${s.location}` : ""}
                          {s.by ? ` · ${s.by}` : ""}
                        </p>
                        {s.summary ? <p className="mt-2 text-base leading-relaxed text-deep/80">{s.summary}</p> : null}
                        <ButtonLink href={s.href || "/contact?subject=Ntinginya%20Masterclass"} variant="dark" className="mt-4">
                          {s.label}
                        </ButtonLink>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div id="instructors">
            <h2 className="font-sans text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">Instructors</h2>
            <div className="mt-6">
              {instructors.length === 0 ? (
                <EmptyState title="Instructors will be announced.">
                  <p>
                    We will publish who is teaching, and their experience, before enrolment opens. If you are an expert who would like
                    to teach, join the Expert Network.
                  </p>
                </EmptyState>
              ) : (
                <ul className="space-y-4">
                  {instructors.map((i) => (
                    <li key={i.name}>
                      <Card as="article" surface="white">
                        <h3 className="font-sans text-xl font-semibold tracking-tight">{i.name}</h3>
                        <p className="text-[0.9375rem] text-deep/75">{i.role}</p>
                        {i.bio ? <p className="mt-2 text-base leading-relaxed text-deep/80">{i.bio}</p> : null}
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
              {instructors.length === 0 ? (
                <ButtonLink href="/network" variant="outline" className="mt-5">
                  Join the Expert Network
                </ButtonLink>
              ) : null}
            </div>
          </div>
        </div>
      </Section>

      {masterclassTestimonials.length > 0 ? (
        <Section tone="deep" id="testimonials">
          <SectionHeading dark title="What learners say" />
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {masterclassTestimonials.map((t) => (
              <li key={`${t.name}-${t.quote.slice(0, 20)}`}>
                <Card as="article" surface="dark">
                  <blockquote className="text-lg leading-relaxed">{t.quote}</blockquote>
                  <p className="mt-4 font-sans text-sm font-semibold">
                    {t.name}, <span className="font-normal text-white/75">{t.role}</span>
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section tone="mist" id="faq">
        <div className="grid gap-10 lg:grid-cols-12">
          <h2 className="font-sans text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl lg:col-span-4">
            Frequently asked questions
          </h2>
          <div className="lg:col-span-8">
            <FaqList items={masterclassFaq} />
          </div>
        </div>
      </Section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: masterclassFaq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
    </>
  );
}
