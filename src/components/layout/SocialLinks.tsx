import { getSiteSettings } from "@/lib/settings";
import { cn } from "@/lib/cn";

/** Renders real links when an href is configured, otherwise a quiet inactive label. */
export async function SocialLinks({ dark = false, className }: { dark?: boolean; className?: string }) {
  const { socialLinks } = await getSiteSettings();
  const active = dark ? "border-white/30 text-white hover:bg-white hover:text-deep" : "border-deep/30 text-deep hover:bg-deep hover:text-white";
  const inactive = dark ? "border-white/15 text-white/50" : "border-deep/15 text-deep/50";

  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Social media">
      {socialLinks.map((item) => (
        <li key={item.label}>
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("inline-flex min-h-9 items-center rounded-md border px-3 font-sans text-sm font-medium transition-colors", active)}
            >
              {item.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <span
              title="Profile coming soon"
              className={cn("inline-flex min-h-9 items-center rounded-md border border-dashed px-3 font-sans text-sm font-medium", inactive)}
            >
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
