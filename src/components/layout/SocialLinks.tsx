import { getSiteSettings } from "@/lib/settings";
import { cn } from "@/lib/cn";

/** Renders real links when an href is configured, otherwise a quiet inactive label. */
export async function SocialLinks({ dark = false, className }: { dark?: boolean; className?: string }) {
  const { socialLinks } = await getSiteSettings();
  const configured = socialLinks.filter((item) => item.href);
  if (!configured.length) return null;

  const active = dark ? "border-white/30 text-white hover:bg-white hover:text-deep" : "border-deep/30 text-deep hover:bg-deep hover:text-white";

  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Social media">
      {configured.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("inline-flex min-h-9 items-center rounded-md border px-3 font-sans text-sm font-medium transition-colors", active)}
          >
            {item.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
