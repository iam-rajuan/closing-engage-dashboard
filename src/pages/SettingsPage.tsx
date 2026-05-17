import { useState } from "react";
import { Check, Mail, FileText, Save } from "lucide-react";
import { Avatar, SectionCard, GhostButton, PrimaryButton, FormSection, NotificationRow } from "../components/common";
import { profileGradients } from "../data";

export function SettingsPage() {
  const initialProfile = {
    fullName: "Alex Thompson",
    email: "alex.t@estateflux.com",
    phone: "+1 (555) 902-4412",
    companyName: "Estate Flux Title",
    companyEmail: "ops@estateflux.com",
    contactNumber: "+1 (555) 200-1100",
    businessAddress: "782 Commerce Blvd, Austin TX",
  };
  const initialSecurity = {
    currentPassword: "••••••••",
    newPassword: "••••••••",
    confirmPassword: "••••••••",
  };
  const initialNotifications = {
    emailNotifications: true,
    orderUpdates: true,
    documentUpdates: false,
  };

  const [profileForm, setProfileForm] = useState(initialProfile);
  const [securityForm, setSecurityForm] = useState(initialSecurity);
  const [notificationForm, setNotificationForm] = useState(initialNotifications);
  const [saveMessage, setSaveMessage] = useState("");

  const updateProfile = (field: keyof typeof initialProfile, value: string) =>
    setProfileForm((current) => ({ ...current, [field]: value }));
  const updateSecurity = (field: keyof typeof initialSecurity, value: string) =>
    setSecurityForm((current) => ({ ...current, [field]: value }));
  const toggleNotification = (field: keyof typeof initialNotifications) =>
    setNotificationForm((current) => ({ ...current, [field]: !current[field] }));

  const handleReset = () => {
    setProfileForm(initialProfile);
    setSecurityForm(initialSecurity);
    setNotificationForm(initialNotifications);
    setSaveMessage("Changes were reset.");
  };

  const handleSave = () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setSaveMessage("Passwords do not match.");
      return;
    }

    setSaveMessage("Settings saved successfully.");
  };

  return (
    <div className="space-y-5">
      <SectionCard className="flex items-center justify-between px-5 py-5 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-[52px] w-[52px] rounded-xl" gradient={profileGradients.alex} />
            <div className="absolute -bottom-1 -right-1 rounded-full bg-brand-500 p-1 text-white shadow-md">
              <Check size={10} strokeWidth={3} />
            </div>
          </div>
          <div>
            <div className="text-[18px] font-bold text-slate-900">{profileForm.fullName}</div>
            <div className="mt-1 flex items-center gap-2 text-[13px] text-slate-500 font-semibold">
              <Mail size={13} />
              {profileForm.email}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[13px] text-slate-500 font-semibold">
              <FileText size={13} />
              {profileForm.companyName}
            </div>
          </div>
        </div>
        <GhostButton>Edit Profile</GhostButton>
      </SectionCard>

      <div className="grid grid-cols-[1.85fr_0.9fr] gap-5">
        <div className="space-y-5">
          <FormSection title="Personal Information">
            <div className="grid grid-cols-2 gap-4">
              <SettingsInput label="Full Name" value={profileForm.fullName} onChange={(value) => updateProfile("fullName", value)} />
              <SettingsInput label="Email Address" value={profileForm.email} onChange={(value) => updateProfile("email", value)} />
              <div className="col-span-2">
                <SettingsInput label="Phone Number" value={profileForm.phone} onChange={(value) => updateProfile("phone", value)} />
              </div>
            </div>
          </FormSection>

          <FormSection title="Company Information">
            <div className="grid grid-cols-2 gap-4">
              <SettingsInput label="Company Name" value={profileForm.companyName} onChange={(value) => updateProfile("companyName", value)} />
              <SettingsInput label="Company Email" value={profileForm.companyEmail} onChange={(value) => updateProfile("companyEmail", value)} />
              <SettingsInput label="Contact Number" value={profileForm.contactNumber} onChange={(value) => updateProfile("contactNumber", value)} />
              <SettingsInput label="Business Address" value={profileForm.businessAddress} onChange={(value) => updateProfile("businessAddress", value)} />
            </div>
          </FormSection>
        </div>

        <div className="space-y-5">
          <FormSection title="Security Settings">
            <div className="space-y-4">
              <SettingsInput
                label="Current Password"
                value={securityForm.currentPassword}
                onChange={(value) => updateSecurity("currentPassword", value)}
                type="password"
              />
              <SettingsInput
                label="New Password"
                value={securityForm.newPassword}
                onChange={(value) => updateSecurity("newPassword", value)}
                type="password"
              />
              <SettingsInput
                label="Confirm New Password"
                value={securityForm.confirmPassword}
                onChange={(value) => updateSecurity("confirmPassword", value)}
                type="password"
              />
              <GhostButton className="w-full justify-center text-brand-500 hover:bg-brand-50 transition border-brand-500/20">
                Update Password
              </GhostButton>
            </div>
          </FormSection>

          <FormSection title="Notification Preferences">
            <div className="space-y-5">
              <NotificationRow
                title="Email Notifications"
                text="Receive global summary emails"
                checked={notificationForm.emailNotifications}
                onToggle={() => toggleNotification("emailNotifications")}
              />
              <NotificationRow
                title="Order Updates"
                text="Real-time alerts for escrow changes"
                checked={notificationForm.orderUpdates}
                onToggle={() => toggleNotification("orderUpdates")}
              />
              <NotificationRow
                title="Document Updates"
                text="Alerts when new documents are signed"
                checked={notificationForm.documentUpdates}
                onToggle={() => toggleNotification("documentUpdates")}
              />
            </div>
          </FormSection>
        </div>
      </div>

      <div className="border-t border-[#E7EAF1] pt-5">
        <div className="flex justify-end gap-3">
          <GhostButton onClick={handleReset}>Cancel</GhostButton>
          <PrimaryButton onClick={handleSave}>
            <Save size={16} />
            Save Changes
          </PrimaryButton>
        </div>
        {saveMessage ? <div className="mt-3 text-right text-[13px] font-semibold text-slate-500">{saveMessage}</div> : null}
      </div>
    </div>
  );
}

function SettingsInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        className="h-12 w-full rounded-xl border border-[#DBE4F3] bg-[#F8FAFF] px-4 text-[14px] text-slate-700 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500/20"
      />
    </label>
  );
}
