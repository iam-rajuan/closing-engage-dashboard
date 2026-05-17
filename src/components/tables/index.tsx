import { Eye, Pencil, Trash2, MoreVertical, UserPlus, Download, FileText } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { StatusBadge, Pagination, Avatar, SectionCard } from "../common";
import { profileGradients } from "../../data";
import type { StatusKey } from "../../types";

export function CompanyTable({ onViewCompany, rows }: { onViewCompany: () => void; rows: any[] }) {
  const { setCompanies, showConfirm } = useAppContext();

  const handleDelete = (name: string) => {
    showConfirm(
      "Delete Company?",
      `Are you sure you want to remove ${name} from the system? This action will permanently delete all associated data.`,
      () => setCompanies((prev) => prev.filter((c) => c[2] !== name))
    );
  };

  return (
    <SectionCard className="overflow-hidden">
      <table className="w-full">
        <thead className="table-head">
          <tr>
            <th className="px-5 py-4 text-left">Company Name</th>
            <th className="px-3 py-4 text-left">Contact Person</th>
            <th className="px-3 py-4 text-left">Contact Details</th>
            <th className="px-3 py-4 text-left">Status</th>
            <th className="px-3 py-4 text-left">Created Date</th>
            <th className="px-5 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([initials, color, companyName, contactPerson, email, phone, status, createdDate]) => (
            <tr key={companyName} className="border-t border-line bg-white text-[14px]">
              <td className="px-5 py-6">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-bold ${color}`}>
                    {initials}
                  </div>
                  <div className="max-w-[130px] text-[14px] font-semibold leading-5 text-slate-800">{companyName}</div>
                </div>
              </td>
              <td className="px-3 py-6 text-slate-700">{contactPerson}</td>
              <td className="px-3 py-6">
                <div className="leading-5 text-slate-700">{email}</div>
                <div className="mt-1 text-[12px] text-slate-500">{phone}</div>
              </td>
              <td className="px-3 py-6">
                <StatusBadge status={status as StatusKey} />
              </td>
              <td className="px-3 py-6 text-slate-500">{createdDate}</td>
              <td className="px-5 py-6">
                <div className="flex items-center gap-4 text-slate-500">
                  <button onClick={onViewCompany} className="hover:text-brand-500 focus:outline-none transition">
                    <Eye size={16} />
                  </button>
                  <button className="hover:text-brand-500 focus:outline-none transition">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(companyName)} className="hover:text-[#D14544] focus:outline-none transition">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination footer={`Showing 1 to ${rows.length} of ${rows.length} companies`} pages={["1"]} />
    </SectionCard>
  );
}

export function NotaryTable({ onViewNotary, rows }: { onViewNotary: () => void; rows: any[] }) {
  const { setNotaries, showConfirm } = useAppContext();

  const handleDelete = (name: string) => {
    showConfirm(
      "Delete Notary?",
      `Are you sure you want to remove ${name} from the network? This will revoke their access to the portal immediately.`,
      () => setNotaries((prev) => prev.filter((n) => n[2] !== name))
    );
  };

  return (
    <SectionCard className="overflow-hidden">
      <table className="w-full">
        <thead className="table-head">
          <tr>
            <th className="px-4 py-4 text-left">Name</th>
            <th className="px-4 py-4 text-left">Contact Details</th>
            <th className="px-4 py-4 text-left">License No.</th>
            <th className="px-4 py-4 text-left">Status</th>
            <th className="px-4 py-4 text-left">Created Date</th>
            <th className="px-4 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([initials, color, name, specialty, email, phone, license, status, createdDate]) => (
            <tr key={name} className="border-t border-line text-[14px]">
              <td className="px-4 py-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold ${color}`}>
                    {initials}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{name}</div>
                    <div className="text-[12px] text-slate-500">{specialty}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-5">
                <div className="text-slate-700">{email}</div>
                <div className="text-[12px] text-slate-500">{phone}</div>
              </td>
              <td className="px-4 py-5">
                <span className="rounded-md bg-[#EEF3FA] px-3 py-1 text-[13px] text-slate-600">{license}</span>
              </td>
              <td className="px-4 py-5">
                <StatusBadge status={status as StatusKey} />
              </td>
              <td className="px-4 py-5 text-slate-500">{createdDate}</td>
              <td className="px-4 py-5">
                <div className="flex items-center gap-4 text-slate-500">
                  <button onClick={onViewNotary} className="hover:text-brand-500 focus:outline-none transition">
                    <Eye size={16} />
                  </button>
                  <button className="hover:text-brand-500 focus:outline-none transition">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => handleDelete(name)} className="hover:text-[#D14544] focus:outline-none transition">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination footer={`Showing 1 to ${rows.length} of ${rows.length} notaries`} pages={["1"]} />
    </SectionCard>
  );
}

export function OrderTable({ onOpenOrder, rows }: { onOpenOrder: () => void; rows: any[] }) {
  return (
    <SectionCard className="overflow-hidden">
      <table className="w-full">
        <thead className="table-head">
          <tr>
            <th className="px-5 py-4 text-left">Order ID</th>
            <th className="px-5 py-4 text-left">Title Company</th>
            <th className="px-5 py-4 text-left">Assigned Notary</th>
            <th className="px-5 py-4 text-left">Property Location</th>
            <th className="px-5 py-4 text-left">Date</th>
            <th className="px-5 py-4 text-left">Status</th>
            <th className="px-5 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([id, company, companyInitials, notary, location, date, status, avatar]) => (
            <tr key={id} className="border-t border-line bg-white text-[14px]">
              <td className="px-5 py-5">
                <button
                  onClick={onOpenOrder}
                  className="whitespace-pre-line text-left font-semibold leading-6 text-brand-500 focus:outline-none hover:text-brand-600 transition animate-hover"
                >
                  {id.replace("-", "-\n")}
                </button>
              </td>
              <td className="px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E9EEF6] text-[12px] font-bold text-slate-500">
                    {companyInitials}
                  </div>
                  <div className="max-w-[118px] whitespace-pre-line leading-5 text-slate-800">{company}</div>
                </div>
              </td>
              <td className="px-5 py-5">
                {avatar === "none" ? (
                  <div className="text-[14px] italic text-slate-400">Unassigned</div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8" gradient={avatar === "jane" ? profileGradients.jane : profileGradients.mark} />
                    <div className="whitespace-pre-line leading-5 text-slate-800">{notary}</div>
                  </div>
                )}
              </td>
              <td className="px-5 py-5 whitespace-pre-line leading-5 text-slate-850">{location}</td>
              <td className="px-5 py-5 whitespace-pre-line leading-5 text-slate-500">{date}</td>
              <td className="px-5 py-5">
                <StatusBadge status={status as StatusKey} />
              </td>
              <td className="px-5 py-5">
                <div className="flex items-center gap-4 text-slate-500">
                  <button onClick={onOpenOrder} className="hover:text-brand-500 focus:outline-none transition">
                    <Eye size={16} />
                  </button>
                  <button className="hover:text-brand-500 focus:outline-none transition">
                    <UserPlus
                      size={16}
                      className={id === "#ORD-90208" ? "rounded-md bg-[#EEF5FF] p-1 text-brand-500" : ""}
                    />
                  </button>
                  <button className="hover:text-slate-700 focus:outline-none transition">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        footer={`Showing ${rows.length === 0 ? 0 : 1} to ${rows.length} of 248 orders`}
        pages={["1", "2", "3", "...", "25"]}
        withPrevious
      />
    </SectionCard>
  );
}

export function DocumentTable({ onOpenDocument, rows }: { onOpenDocument: () => void; rows: any[] }) {
  return (
    <SectionCard className="overflow-hidden">
      <table className="w-full">
        <thead className="table-head">
          <tr>
            <th className="px-5 py-4 text-left">File Name</th>
            <th className="px-5 py-4 text-left">Order ID</th>
            <th className="px-5 py-4 text-left">Uploaded By</th>
            <th className="px-5 py-4 text-left">Date</th>
            <th className="px-5 py-4 text-left">Size</th>
            <th className="px-5 py-4 text-left">Status</th>
            <th className="px-5 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([fileName, orderId, uploadedBy, date, size, status]) => (
            <tr key={fileName} className="border-t border-line bg-white">
              <td className="px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF0EF] text-[#EB5B53]">
                    <FileText size={16} />
                  </div>
                  <div className="font-semibold text-slate-800">{fileName}</div>
                </div>
              </td>
              <td className="px-5 py-4 font-semibold text-brand-500">{orderId}</td>
              <td className="px-5 py-4">
                <span className="rounded-md bg-[#EEF3FA] px-3 py-1 text-[11px] font-semibold tracking-[0.04em] text-slate-500">
                  {uploadedBy}
                </span>
              </td>
              <td className="px-5 py-4 text-slate-500">{date}</td>
              <td className="px-5 py-4 text-slate-500">{size}</td>
              <td className="px-5 py-4">
                <StatusBadge status={status as StatusKey} />
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-5 text-slate-500">
                  <button onClick={onOpenDocument} className="hover:text-brand-500 focus:outline-none transition">
                    <Eye size={16} />
                  </button>
                  <button className="hover:text-brand-500 focus:outline-none transition">
                    <Download size={16} />
                  </button>
                  <button className="hover:text-brand-500 focus:outline-none transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        footer={`Showing ${rows.length === 0 ? 0 : 1} to ${rows.length} of 124 results`}
        pages={["1", "2", "3", "...", "13"]}
        withPrevious
      />
    </SectionCard>
  );
}
