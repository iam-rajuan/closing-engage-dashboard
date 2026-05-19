import { useState } from "react";
import { Link2, ShieldCheck } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { usersApi } from "../../api/users";
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
  prefillData,
  requestId,
}: {
  onClose: () => void;
  onSwitchType: () => void;
  companyToEdit?: CompanyUser | null;
  prefillData?: Partial<CompanyUser> | null;
  requestId?: string | null;
}) {
  const { setCompanies, setRegistrationRequests } = useAppContext();
  const isEdit = !!companyToEdit;

  const [form, setForm] = useState({
    companyName: companyToEdit?.companyName || prefillData?.companyName || "",
    businessEmail: companyToEdit?.businessEmail || prefillData?.businessEmail || "",
    phone: companyToEdit?.phone || prefillData?.phone || "",
    contactPerson: companyToEdit?.contactPerson || prefillData?.contactPerson || "",
    address: companyToEdit?.address || prefillData?.address || "",
    contactEmail: companyToEdit?.contactEmail || prefillData?.contactEmail || "",
    userName: companyToEdit?.userName || prefillData?.userName || "",
    password: companyToEdit?.password || prefillData?.password || "",
    sendInvite: companyToEdit?.sendInvite || prefillData?.sendInvite || false,
    active: companyToEdit ? companyToEdit.status !== "Inactive" : true,
    verify: companyToEdit ? !!companyToEdit.verify : (prefillData ? true : false),
  });
  const [error, setError] = useState("");
  const nextStatus: CompanyUser["status"] = form.active ? "Active" : "Inactive";

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async () => {
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

    const payload = {
      companyName: form.companyName,
      contactPerson: form.contactPerson,
      businessEmail: form.businessEmail,
      phone: form.phone,
      status: nextStatus,
      verify: form.verify,
      address: form.address,
      contactEmail: form.contactEmail,
      userName: form.userName,
      password: form.password,
      sendInvite: form.sendInvite,
    };

    try {
      if (isEdit && companyToEdit) {
        const updatedCompany = await usersApi.updateCompany(companyToEdit.id, payload);
        setCompanies((prev) => prev.map((c) => (c.id === companyToEdit.id ? updatedCompany : c)));
      } else {
        const newCompany = await usersApi.createCompany(payload);
        setCompanies((prev) => [newCompany, ...prev]);

        if (requestId) {
          const updatedRequest = await usersApi.updateAccessRequestStatus(requestId, "Approved");
          setRegistrationRequests((prev) => prev.map((r) => (r.id === requestId ? updatedRequest : r)));
        }
      }
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : "Failed to save company user.");
      return;
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
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-slate-600">Password Setup</span>
                <button
                  type="button"
                  onClick={() => {
                    const generated = Math.random().toString(36).substring(2, 10).toUpperCase() + Math.floor(100 + Math.random() * 900);
                    updateField("password", generated);
                  }}
                  className="text-[11px] font-extrabold text-brand-500 hover:text-brand-600 uppercase tracking-wider cursor-pointer"
                >
                  Generate Password
                </button>
              </div>
              <div className="flex h-11 items-center gap-3 rounded-lg border border-[#E1E7F0] bg-[#F5F8FC] px-4">
                <input
                  type="text"
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="••••••••"
                  className="w-full border-0 bg-transparent text-[14px] text-slate-700 outline-none placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>
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
