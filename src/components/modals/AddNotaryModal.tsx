import { useState } from "react";
import { Calendar, MapPin, Link2, ShieldCheck } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import {
  ModalHeader,
  ModalInput,
  ModalSectionTitle,
  ModalCheckbox,
  ToggleOptionCard,
  ModalActionFooter,
} from "./Modal";

export function AddNotaryModal({ onClose }: { onClose: () => void }) {
  const { setNotaries } = useAppContext();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    license: "",
    expiry: "",
    serviceArea: "",
    userName: "",
    password: "",
    sendInvite: false,
    active: true,
    verify: false,
  });
  const [error, setError] = useState("");

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    if (
      !form.fullName ||
      !form.email ||
      !form.license ||
      !form.expiry ||
      !form.serviceArea ||
      !form.userName ||
      !form.password
    ) {
      setError("Complete all required fields before creating the notary user.");
      return;
    }

    const newNotary = [
      form.fullName.substring(0, 2).toUpperCase(),
      "bg-[#DCE7FF] text-[#3165CF]",
      form.fullName,
      "Notary",
      form.email,
      form.phone,
      form.license,
      form.active ? "Active" : "Inactive",
      "Just now",
    ];
    setNotaries((prev) => [newNotary, ...prev]);

    setError("");
    onClose();
  };

  return (
    <div className="flex flex-col max-h-[88vh]">
      <ModalHeader title="Add Notary" subtitle="Create a new notary account" onClose={onClose} />
      <div className="flex-1 overflow-y-auto space-y-7 px-5 py-5">
        <div>
          <ModalSectionTitle title="Personal Information" />
          <div className="mt-5 grid grid-cols-2 gap-5">
            <ModalInput
              label="Full Name"
              placeholder="e.g. Jane Doe"
              value={form.fullName}
              onChange={(value) => updateField("fullName", value)}
            />
            <ModalInput
              label="Email Address"
              placeholder="jane.doe@example.com"
              value={form.email}
              onChange={(value) => updateField("email", value)}
            />
            <div className="col-span-2">
              <ModalInput
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
              />
            </div>
          </div>
        </div>

        <div>
          <ModalSectionTitle title="Professional Details" />
          <div className="mt-5 grid grid-cols-2 gap-5">
            <ModalInput
              label="License Number"
              placeholder="LIC-99882211"
              value={form.license}
              onChange={(value) => updateField("license", value)}
            />
            <ModalInput
              label="Commission Expiry Date"
              placeholder="mm/dd/yyyy"
              value={form.expiry}
              onChange={(value) => updateField("expiry", value)}
              icon={<Calendar size={16} className="text-slate-500" />}
            />
            <div className="col-span-2">
              <ModalInput
                label="Service Area / Location"
                placeholder="City, State or County"
                value={form.serviceArea}
                onChange={(value) => updateField("serviceArea", value)}
                icon={<MapPin size={16} className="text-slate-500" />}
              />
            </div>
          </div>
        </div>

        <div>
          <ModalSectionTitle title="Account Setup" />
          <div className="mt-5 grid grid-cols-2 gap-5">
            <ModalInput
              label="User Name"
              placeholder="Create username"
              value={form.userName}
              onChange={(value) => updateField("userName", value)}
            />
            <ModalInput
              label="Confirm Password"
              placeholder="••••••••"
              value={form.password}
              onChange={(value) => updateField("password", value)}
              type="password"
            />
          </div>
          <ModalCheckbox
            checked={form.sendInvite}
            onToggle={() => updateField("sendInvite", !form.sendInvite)}
            label="Send invitation email to this user"
            className="mt-4"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <ToggleOptionCard
            title="Status"
            subtitle="Active / Inactive"
            checked={form.active}
            onToggle={() => updateField("active", !form.active)}
            icon={<Link2 size={16} />}
          />
          <ToggleOptionCard
            title="Verify Notary"
            subtitle="Credentials Check"
            checked={form.verify}
            onToggle={() => updateField("verify", !form.verify)}
            icon={<ShieldCheck size={16} />}
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-[#FFD9D7] bg-[#FFF5F4] px-4 py-3 text-[14px] text-[#C84B45]">
            {error}
          </div>
        ) : null}
      </div>
      <ModalActionFooter onClose={onClose} onConfirm={handleSubmit} confirmLabel="Create User" />
    </div>
  );
}
