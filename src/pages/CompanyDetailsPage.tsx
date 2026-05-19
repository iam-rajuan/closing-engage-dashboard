import { useAppContext } from "../context/AppContext";
import { usersApi } from "../api/users";
import {
  PageHeader,
  GhostButton,
  SectionCard,
  StatusBadge,
  InfoBlock,
  SmallMetricCard,
  TableHeader,
} from "../components/common";
import { FileText, Mail, Link2, MapPin, ArrowLeft, ShieldCheck, KeyRound, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import type { StatusKey, CompanyUser } from "../types";
import { firstPasswordVault } from "../utils/firstPasswordVault";

export function CompanyDetailsPage({
  company,
  onBack,
  onEdit,
}: {
  company: CompanyUser | null;
  onBack: () => void;
  onEdit: (company: CompanyUser) => void;
}) {
  const { setCompanies, showConfirm } = useAppContext();
  const fallbackPassword = company ? firstPasswordVault.get(company.id) : null;
  const visiblePassword = company?.adminVisiblePassword
    ? {
        password: company.adminVisiblePassword,
        userName: company.userName,
        email: company.contactEmail || company.businessEmail,
      }
    : fallbackPassword;
  const [passwordCopied, setPasswordCopied] = useState(false);

  const handleDeactivate = () => {
    if (!company) return;
    const action = company.status === "Active" ? "Deactivate" : "Activate";
    showConfirm(
      `${action} Company?`,
      `Are you sure you want to ${action.toLowerCase()} ${company.companyName}? This will toggle their system access status.`,
      () => {
        void usersApi
          .updateCompany(company.id, { status: company.status === "Active" ? "Inactive" : "Active" })
          .then((updatedCompany) => {
            setCompanies((prev) => prev.map((c) => (c.id === company.id ? updatedCompany : c)));
          });
      },
      action,
      company.status === "Active" ? "warning" : "info"
    );
  };

  const handleVerify = () => {
    if (!company) return;
    const isCurrentlyVerified = !!company.verify;
    const actionText = isCurrentlyVerified ? "Revoke" : "Verify";
    const variant = isCurrentlyVerified ? "warning" : "info";

    showConfirm(
      `${isCurrentlyVerified ? "Revoke Verification" : "Verify Company"}?`,
      `Are you sure you want to ${isCurrentlyVerified ? "revoke verification for" : "verify and approve"} ${company.companyName}? This will instantly update their system authorization status.`,
      () => {
        void usersApi.updateCompany(company.id, { verify: !isCurrentlyVerified }).then((updatedCompany) => {
          setCompanies((prev) => prev.map((c) => (c.id === company.id ? updatedCompany : c)));
        });
      },
      isCurrentlyVerified ? "Revoke" : "Verify",
      variant
    );
  };

  const handleDelete = () => {
    if (!company) return;
    showConfirm(
      "Delete Company?",
      `Are you sure you want to permanently delete ${company.companyName}? This action will remove all associated system data.`,
      () => {
        void usersApi.deleteCompany(company.id).then(() => {
          setCompanies((prev) => prev.filter((c) => c.id !== company.id));
          onBack();
        });
      },
      "Delete",
      "danger"
    );
  };

  // Dynamic mock generation to be 100% backend and api ready
  const companyTeam = useMemo(() => {
    if (!company) return [];
    if (company.companyName.toLowerCase().includes("northway")) {
      return [
        { initials: "SM", color: "bg-[#DCE7FF] text-[#4259B2]", name: "Sarah J. Miller", email: "sarah.m@northway.com", role: "Senior Escrow Officer" },
        { initials: "MC", color: "bg-[#DFE6FF] text-[#5B6AAE]", name: "Marcus Chen", email: "m.chen@northway.com", role: "Director of Operations" },
        { initials: "ER", color: "bg-[#FFE1D2] text-[#C87846]", name: "Elena Rodriguez", email: "elena.r@northway.com", role: "Founder" }
      ];
    }
    return [
      {
        initials: company.initials,
        color: company.color,
        name: company.contactPerson,
        email: company.contactEmail || company.businessEmail,
        role: "Primary Contact / Admin"
      },
      {
        initials: "JS",
        color: "bg-[#DFE6FF] text-[#5B6AAE]",
        name: "John Smith",
        email: `j.smith@${company.businessEmail.split("@")[1] || "domain.com"}`,
        role: "Escrow Agent"
      }
    ];
  }, [company]);

  const companyOrders = useMemo(() => {
    if (!company) return [];
    if (company.companyName.toLowerCase().includes("northway")) {
      return [
        { id: "#ORD-90212", status: "In Progress", date: "Mar 20, 2026" },
        { id: "#ORD-90208", status: "Approved", date: "Mar 15, 2026" },
        { id: "#ORD-88421", status: "Completed", date: "Feb 24, 2026" }
      ];
    }
    return [
      { id: "#ORD-77401", status: "Completed", date: "May 10, 2026" },
      { id: "#ORD-77290", status: "Assigned", date: "May 08, 2026" }
    ];
  }, [company]);

  const stats = useMemo(() => {
    if (!company) return { total: "0", active: "0", completed: "0" };
    if (company.companyName.toLowerCase().includes("northway")) {
      return { total: "248", active: "12", completed: "236" };
    }
    return { total: "15", active: "2", completed: "13" };
  }, [company]);

  if (!company) {
    return (
      <div className="space-y-4 py-8 text-center bg-white rounded-xl border border-line">
        <p className="text-slate-500 font-medium">No company selected.</p>
        <GhostButton onClick={onBack}>&larr; Back to Title Companies</GhostButton>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-[12px] text-slate-500 font-semibold tracking-wide">
        <button onClick={onBack} className="hover:text-brand-500 transition">
          Title Companies
        </button>
        <span>&nbsp;›&nbsp;</span>
        <span className="text-slate-700">{company.companyName}</span>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="mt-1 rounded-full border border-line bg-white p-2 text-brand-500 hover:bg-slate-50 transition focus:outline-none"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-bold text-slate-900">{company.companyName}</h1>
              <StatusBadge status={company.status as StatusKey} />
              {company.verify ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[12px] font-semibold text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                  Verified
                </span>
              ) : (
                <button
                  onClick={handleVerify}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 hover:bg-brand-100 px-2.5 py-0.5 text-[12px] font-semibold text-brand-700 border border-brand-200 hover:border-brand-300 transition focus:outline-none"
                >
                  <ShieldCheck size={14} className="text-brand-600 shrink-0" />
                  Verify
                </button>
              )}
            </div>
            <div className="mt-1 text-[14px] text-slate-500 font-medium">Created on {company.createdDate}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <GhostButton
            onClick={() => onEdit(company)}
            className="w-[140px] h-[46px] justify-center border-brand-300 text-brand-600 bg-brand-50/50 hover:bg-brand-50 px-0"
          >
            Edit Company
          </GhostButton>
          <GhostButton
            onClick={handleDeactivate}
            className={`w-[140px] h-[46px] justify-center transition px-0 ${
              company.status === "Active"
                ? "border-amber-200 text-amber-600 bg-amber-50/30 hover:bg-amber-50"
                : "border-emerald-200 text-emerald-600 bg-emerald-50/30 hover:bg-emerald-50"
            }`}
          >
            {company.status === "Active" ? "Deactivate" : "Activate"}
          </GhostButton>
          <button
            onClick={handleDelete}
            className="inline-flex items-center justify-center rounded-lg bg-rose-500 w-[140px] h-[46px] text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(244,63,94,0.2)] hover:bg-rose-600 transition focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1.9fr)_minmax(320px,0.8fr)] gap-5">
        <SectionCard className="overflow-hidden p-0">
          <div className="border-b border-line bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-6 py-5">
            <div className="flex items-start justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="flex h-[54px] w-[54px] items-center justify-center rounded-[16px] bg-[#EAF2FF] text-brand-600 ring-1 ring-brand-100">
                  <FileText size={23} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[18px] font-bold tracking-tight text-slate-900">{company.companyName}</h3>
                    <StatusBadge status={company.status as StatusKey} />
                  </div>
                  <p className="mt-1 text-[14px] font-medium text-slate-500">Title company workspace and account access profile</p>
                  {company.publicId && (
                    <div className="mt-3 inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-[12px] font-bold text-slate-600">
                      {company.publicId}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-5 px-6 py-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <InfoBlock label="Primary Contact" lines={[company.contactPerson, "Senior Escrow Officer"]} strongFirst />
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <InfoBlock label="Contact Information" lines={[company.contactEmail || company.businessEmail, company.phone]} icons={[Mail, Link2]} />
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <InfoBlock label="Office Address" lines={company.address ? company.address.split(",") : ["Address Not Provided"]} icons={[MapPin]} />
            </div>
          </div>
        </SectionCard>
        <div className="grid gap-4">
          <SmallMetricCard title="Total Orders" value={stats.total} tone="blue" />
          <SmallMetricCard title="Active Orders" value={stats.active} tone="blue2" />
          <SmallMetricCard title="Completed Orders" value={stats.completed} tone="green" />
        </div>
      </div>

      <SectionCard className="overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
          <div className="flex gap-4 px-6 py-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#EEF5FF] text-brand-600 ring-1 ring-brand-100">
              <KeyRound size={20} />
            </div>
            <div>
              <div className="text-[12px] font-bold uppercase tracking-[0.16em] text-slate-400">Account Password</div>
              <div className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                company.passwordChangedBy === "user"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}>
                {company.passwordStatus || "Password is not reset or changed by user"}
              </div>
              {visiblePassword ? (
                <>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 font-mono text-[15px] font-bold tracking-wide text-slate-900">
                      {visiblePassword.password}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard?.writeText(visiblePassword.password);
                        setPasswordCopied(true);
                        window.setTimeout(() => setPasswordCopied(false), 1400);
                      }}
                      className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-[12px] font-bold transition focus:outline-none ${
                        passwordCopied
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-brand-200 bg-brand-50 text-brand-600 hover:bg-brand-100"
                      }`}
                    >
                      <Copy size={14} />
                      {passwordCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="mt-3 text-[12px] font-semibold text-slate-500">
                    Username: {visiblePassword.userName || company.userName || "Not set"} · Email: {visiblePassword.email}
                  </div>
                </>
              ) : (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[14px] font-medium text-slate-500">
                  No admin-set temporary password is available right now. Use Edit Company to set a new temporary password if needed.
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-line bg-amber-50/70 px-6 py-5 text-[12px] leading-5 text-amber-900 lg:border-l lg:border-t-0">
            <div className="font-bold uppercase tracking-[0.14em] text-amber-700">Security Note</div>
            <p className="mt-2">
              This temporary password is available only while the account is still using an admin-set password.
              Once the user changes or resets it, the visible copy is removed.
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-5">
        <SectionCard className="overflow-hidden">
          <TableHeader title="Team Members" action="Manage Team" />
          <table className="w-full">
            <thead className="table-head">
              <tr>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {companyTeam.map((member) => (
                <tr key={member.email} className="border-t border-line text-[14px]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${member.color}`}>
                        {member.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{member.name}</div>
                        <div className="text-[13px] text-slate-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">{member.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
        <SectionCard className="overflow-hidden">
          <TableHeader title="Recent Orders" action="View All" />
          <table className="w-full">
            <thead className="table-head">
              <tr>
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {companyOrders.map((order) => (
                <tr key={order.id} className="border-t border-line text-[14px]">
                  <td className="px-6 py-4 font-semibold text-brand-500">{order.id}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status as StatusKey} />
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500 font-semibold">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </div>
  );
}
