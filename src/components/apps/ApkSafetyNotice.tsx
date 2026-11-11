import { ShieldAlert } from "lucide-react";

export default function ApkSafetyNotice() {
  return (
    <aside
      className="my-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950"
      aria-label="APK download safety information"
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <h2 className="font-semibold">Before installing this APK</h2>
          <p className="mt-2 text-sm leading-relaxed">
            Download apps only from the official Ntinginya Tech website.
            Chrome may display a general warning when downloading APK files
            from outside Google Play. This warning alone does not confirm
            that an app is harmful or that it is safe.
          </p>
          <p className="mt-2 text-sm font-medium leading-relaxed">
            Check the app name and version before installing. If Google Play
            Protect specifically reports that the app is harmful or blocks
            installation, do not bypass the warning. Cancel the installation
            and contact Ntinginya Tech.
          </p>
        </div>
      </div>
    </aside>
  );
}
