import { useState } from "react";
import { Link2, ShieldCheck } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import type { CompanyUser } from "../../types";
import {
  ModalHeader,
  ModalInput,
  ModalSectionTitle,
  ModalCheckbox,
  ToggleOptionCard,
  ModalActionFooter,
} from "./Modal";

export function AddCompanyUserModal({
  onClose,
  onSwitchType,
  companyToEdit,
}: {
  onClose: () => void;
  onSwitchType: () => void;
  companyToEdit?: CompanyUser | null;
}) {
  const { setCompanies } = useAppContext();
  const isEdit = !!companyToEdit;

  const [form, setForm] = useState({
    companyName: companyToEdit?.companyName || "",
    businessEmail: companyToEdit?.businessEmail || "",
    phone: companyToEdit?.phone || "",
    contactPerson: companyToEdit?.contactPerson || "",
    address: companyToEdit?.address || "",
    contactEmail: companyToEdit?.contactEmail || "",
    userName: companyToEdit?.userName || "",
    password: companyToEdit?.password || "",
    sendInvite: companyToEdit?.sendInvite || false,
    active: companyToEdit ? companyToEdit.status !== "Inactive" : true,
    verify: companyToEdit ? !!companyToEdit.verify : false,
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
      (!isEdit && !form.password)
    ) {
      setError("Complete all required fields before saving.");
      return;
    }

    if (isEdit && companyToEdit) {
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyToEdit.id
            ? {
                ...c,
                companyName: form.companyName,
                contactPerson: form.contactPerson,
                businessEmail: form.businessEmail,
                phone: form.phone,
                status: form.active ? "Active" : "Inactive",
                verify: form.verify,
                address: form.address,
                contactEmail: form.contactEmail,
                userName: form.userName,
                password: form.password || c.password,
                sendInvite: form.sendInvite,
                initials: form.companyName.substring(0, 2).toUpperCase(),
              }
            : c
        )
      );
    } else {
      const newCompany: CompanyUser = {
        id: `COMP-${Date.now()}`,
        initials: form.companyName.substring(0, 2).toUpperCase(),
        color: "bg-[#DCE7FF] text-[#3165CF]",
        companyName: form.companyName,
        contactPerson: form.contactPerson,
        businessEmail: form.businessEmail,
        phone: form.phone,
        status: form.active ? "Active" : "Inactive",
        verify: form.verify,
        createdDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        address: form.address,
        contactEmail: form.contactEmail,
        userName: form.userName,
        password: form.password,
        sendInvite: form.sendInvite,
      };
      setCompanies((prev) => [newCompany, ...prev]);
    }

    setError("");
    onClose();
  };

  return (
    <div className="flex flex-col max-h-[88vh]">
      <ModalHeader
        title={isEdit ? "Edit Company User" : "Add New User"}
        subtitle={isEdit ? "Update this title company user account details" : "Create a new user account"}
        onClose={onClose}
      />
      <div className="flex-1 overflow-y-auto space-y-7 px-5 py-5">
        {!isEdit && (
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
        )}

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

        <div className="grid grid-cols-2 gap-5">
          <ToggleOptionCard
            title="Status"
            subtitle={form.active ? "Active" : "Inactive"}
            checked={form.active}
            onToggle={() => updateField("active", !form.active)}
            icon={<Link2 size={16} />}
            activeColor="text-emerald-600"
          />
          <ToggleOptionCard
            title="Verify Company"
            subtitle={form.verify ? "Verified" : "Pending Verification"}
            checked={form.verify}
            onToggle={() => updateField("verify", !form.verify)}
            icon={<ShieldCheck size={16} />}
            activeColor="text-brand-500"
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-[#FFD9D7] bg-[#FFF5F4] px-4 py-3 text-[14px] text-[#C84B45]">
            {error}
          </div>
        ) : null}
      </div>
      <ModalActionFooter onClose={onClose} onConfirm={handleSubmit} confirmLabel={isEdit ? "Save Changes" : "Create User"} />
    </div>
  );
}
