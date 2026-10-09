import { ProfileNameForm, SettingsForm } from "@/components/admin/SimpleForms";
import { Card, PageHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { getSettingsRow } from "@/lib/cms/admin";
import { contactInfo, siteConfig } from "@/config/site";
import { SOCIAL_KEYS } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const profile = await requireStaff();
  const row = await getSettingsRow();
  const values = {
    site_name: row?.site_name ?? siteConfig.name,
    site_description: row?.site_description ?? siteConfig.description,
    contact_email: row?.contact_email ?? contactInfo.email,
    contact_phone: row?.contact_phone ?? contactInfo.phone,
    whatsapp: row?.whatsapp ?? "",
    default_seo_title: row?.default_seo_title ?? "",
    default_seo_description: row?.default_seo_description ?? "",
    social: row?.social_links ?? {},
  };
  return (
    <>
      <PageHeader title="Settings" description="Public contact details, default SEO text and social links. Secrets never belong here." />
      <div className="grid max-w-3xl gap-6">
        <Card>
          <h2 className="mb-4 font-sans text-xl font-semibold">Your profile</h2>
          <ProfileNameForm name={profile.full_name ?? ""} />
        </Card>
        <Card>
          <h2 className="mb-4 font-sans text-xl font-semibold">Site settings</h2>
          <SettingsForm values={values} socialKeys={SOCIAL_KEYS} />
        </Card>
      </div>
    </>
  );
}
