"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const NATIVE_BANNER_SCRIPT_ID = "ntinginya-adsterra-native-banner";
const SOCIAL_BAR_SCRIPT_ID = "ntinginya-adsterra-social-bar";
const BANNER_160X600_SCRIPT_ID = "ntinginya-adsterra-banner-160x600";
const BANNER_160X600_OPTIONS_SCRIPT_ID = "ntinginya-adsterra-banner-160x600-options";

function isExcludedPath(pathname: string) {
  return /^\/(admin|login|account|dashboard|auth|api|profile|settings|billing|checkout|payment)(?:\/|$)/i.test(
    pathname,
  );
}

function addNativeBanner(container: HTMLElement) {
  if (document.getElementById(NATIVE_BANNER_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = NATIVE_BANNER_SCRIPT_ID;
  script.setAttribute("async", "async");
  script.setAttribute("data-cfasync", "false");
  script.src = "https://bauval.org/21/4cce9220b9fd4301d28b88f67bfddd42";
  script.onerror = () => console.error("Failed to load the Adsterra native banner.");
  container.before(script);
}

function addSocialBar() {
  if (document.getElementById(SOCIAL_BAR_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = SOCIAL_BAR_SCRIPT_ID;
  script.setAttribute("data-cfasync", "false");
  script.src = "https://bauval.org/14/5d33c5086f404fd05d1f8ea9053d992e";
  script.onerror = () => console.error("Failed to load the Adsterra social bar.");
  document.body.append(script);
}

export function PublicAds() {
  const pathname = usePathname();
  const excluded = pathname ? isExcludedPath(pathname) : true;

  useEffect(() => {
    if (excluded) return;

    const container = document.getElementById("container-4cce9220b9fd4301d28b88f67bfddd42");
    if (container) addNativeBanner(container);
    addSocialBar();
  }, [excluded]);

  return (
    <section
      aria-label="Sponsored content"
      hidden={excluded}
      className="bg-paper px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
    >
      <div
        id="container-4cce9220b9fd4301d28b88f67bfddd42"
        className="mx-auto w-full max-w-7xl"
      />
    </section>
  );
}

export function AdsterraSidebar() {
  const pathname = usePathname();
  const excluded = pathname ? isExcludedPath(pathname) : true;

  useEffect(() => {
    if (excluded) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const loadBanner = () => {
      if (!desktop.matches || document.getElementById(BANNER_160X600_SCRIPT_ID)) return;

      const container = document.getElementById("ntinginya-adsterra-banner-160x600-slot");
      if (!container) return;

      const optionsScript = document.createElement("script");
      optionsScript.id = BANNER_160X600_OPTIONS_SCRIPT_ID;
      optionsScript.textContent = `atOptions = {
  'key' : '0e3406045488c7f2107372a812a3b62b',
  'format' : 'iframe',
  'height' : 600,
  'width' : 160,
  'params' : {}
};`;

      const script = document.createElement("script");
      script.id = BANNER_160X600_SCRIPT_ID;
      script.src = "https://bauval.org/22/0e3406045488c7f2107372a812a3b62b";
      script.onerror = () => console.error("Failed to load the Adsterra 160x600 banner.");

      container.append(optionsScript, script);
    };

    loadBanner();
    desktop.addEventListener("change", loadBanner);
    return () => desktop.removeEventListener("change", loadBanner);
  }, [excluded]);

  return (
    <aside aria-label="Sponsored content" className="hidden lg:block">
      <div
        id="ntinginya-adsterra-banner-160x600-slot"
        className="min-h-[600px] w-[160px]"
      />
    </aside>
  );
}
