import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import {
  ModalHeader,
  ModalInput,
  ModalSectionTitle,
  ModalCheckbox,
  SegmentedToggle,
  ModalActionFooter,
} from "./Modal";

export function AddCompanyUserModal({
  onClose,
  onSwitchType,
}: {
  onClose: () => void;
  onSwitchType: () => void;
}) {
  const { setCompanies } = useAppContext();
  const [form, setForm] = useState({
    companyName: "",
    businessEmail: "",
    phone: "",
    contactPerson: "",
    address: "",
    contactEmail: "",
    userName: "",
    password: "",
    sendInvite: false,
    active: true,
  });
  const [error, setError] = useState("");

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    if (
      !form.companyName ||
      !form.businessEmail ||
      !form.contactPerson ||
      !form.contactEmail ||
      !form.userName ||
      !form.password
    ) {
      setError("Complete all required fields before creating the company user.");
      return;
    }

    const newCompany = [
      form.companyName.substring(0, 2).toUpperCase(),
      "bg-[#DCE7FF] text-[#3165CF]",
      form.companyName,
      form.contactPerson,
      form.businessEmail,
      form.phone,
      form.active ? "Active" : "Inactive",
      "Just now",
    ];
    setCompanies((prev) => [newCompany, ...prev]);

    setError("");
    onClose();
  };

  return (
    <div className="flex flex-col max-h-[88vh]">
      <ModalHeader title="Add New User" subtitle="Create a new user account" onClose={onClose} />
      <div className="flex-1 overflow-y-auto space-y-7 px-5 py-5">
        <div>
          <div className="mb-3 text-[14px] font-semibold text-slate-600">User Type Selection</div>
          <div className="inline-flex rounded-xl bg-[#EDF1F7] p-1">
            <button className="rounded-lg bg-white px-5 py-2 text-[14px] font-semibold text-brand-500 shadow-sm">
              Title Company
            </button>
            <button onClick={onSwitchType} className="px-5 py-2 text-[14px] font-medium text-slate-500 hover:text-slate-700 transition">
              Notary
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <ModalInput
            label="Company Name"
            placeholder="e.g. Acme Title Co."
            value={form.companyName}
            onChange={(value) => updateField("companyName", value)}
          />
          <ModalInput
            label="Business Email"
            placeholder="contact@company.com"
            value={form.businessEmail}
            onChange={(value) => updateField("businessEmail", value)}
          />
          <ModalInput
            label="Phone"
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={(value) => updateField("phone", value)}
          />
          <ModalInput
            label="Contact Person Name"
            placeholder="Full name"
            value={form.contactPerson}
            onChange={(value) => updateField("contactPerson", value)}
          />
          <div className="col-span-2">
            <ModalInput
              label="Address"
              placeholder="Street address, City, State, ZIP"
              value={form.address}
              onChange={(value) => updateField("address", value)}
            />
          </div>
          <div className="col-span-2">
            <ModalInput
              label="Contact Email"
              placeholder="person@company.com"
              value={form.contactEmail}
              onChange={(value) => updateField("contactEmail", value)}
            />
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

        <div className="flex items-center justify-between">
          <div>
            <div className="text-[16px] font-semibold text-slate-700">User Status</div>
            <div className="text-[13px] text-slate-500">Set initial account state</div>
          </div>
          <SegmentedToggle
            left="Active"
            right="Inactive"
            active={form.active ? "left" : "right"}
            onChange={(value) => updateField("active", value === "left")}
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
