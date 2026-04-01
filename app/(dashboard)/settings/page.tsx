import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-slate-800">
        <h1 className="text-xl font-bold text-slate-50">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your account and preferences.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 max-w-2xl space-y-8">
        {/* Profile section */}
        <section>
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Profile</h2>
          <div className="rounded-xl bg-slate-800 border border-slate-700 divide-y divide-slate-700">
            <SettingRow label="Name" value="—" />
            <SettingRow label="Email" value="—" />
            <SettingRow label="Plan" value="Free" badge />
          </div>
        </section>

        {/* Grammar preferences */}
        <section>
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Grammar</h2>
          <div className="rounded-xl bg-slate-800 border border-slate-700 divide-y divide-slate-700">
            <ToggleRow label="Auto-check on typing" description="Run grammar check 500ms after you stop typing" defaultChecked />
            <ToggleRow label="Show suggestions" description="Include style suggestions alongside errors and warnings" defaultChecked />
            <ToggleRow label="Highlight errors inline" description="Show underlines directly in the editor" defaultChecked />
          </div>
        </section>

        {/* Plagiarism preferences */}
        <section>
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Plagiarism</h2>
          <div className="rounded-xl bg-slate-800 border border-slate-700 divide-y divide-slate-700">
            <ToggleRow label="Web search" description="Compare against publicly available web content" defaultChecked />
            <ToggleRow label="Academic databases" description="Include academic and research publications" />
            <ToggleRow label="Internal documents" description="Compare against your own saved documents" />
          </div>
        </section>

        {/* Danger zone */}
        <section>
          <h2 className="text-sm font-semibold text-red-400 mb-4">Danger zone</h2>
          <div className="rounded-xl bg-red-950/30 border border-red-800 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-200">Delete account</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Permanently delete your account and all documents. This cannot be undone.
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-400 border border-red-700 hover:bg-red-900/50 transition-colors flex-shrink-0">
              Delete
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function SettingRow({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      {badge ? (
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30 font-medium">
          {value}
        </span>
      ) : (
        <span className="text-sm text-slate-300">{value}</span>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  defaultChecked = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-4 px-4 py-3 cursor-pointer group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-300 group-hover:text-slate-50 transition-colors">
          {label}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      {/* Native checkbox styled as toggle */}
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="w-4 h-4 rounded accent-blue-600 flex-shrink-0"
        aria-label={label}
      />
    </label>
  );
}
