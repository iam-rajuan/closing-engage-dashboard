import { useAppContext } from "../context/AppContext";
import {
  PageHeader,
  GhostButton,
  SectionCard,
  StatusBadge,
  InfoBlock,
  SmallMetricCard,
  TableHeader,
} from "../components/common";
import { FileText, Mail, Link2, MapPin } from "lucide-react";
import { teamMembers, recentOrders } from "../data";
import type { StatusKey } from "../types";

export function CompanyDetailsPage() {
  const { setCompanies } = useAppContext();

  const handleDeactivate = () => {
    setCompanies((prev: any) =>
      prev.map((c: any) =>
        c[2] === "Northway Holdings" ? [...c.slice(0, 6), "Inactive", c[7]] : c
      )
    );
  };

  const handleDelete = () => {
    setCompanies((prev: any) => prev.filter((c: any) => c[2] !== "Northway Holdings"));
  };

  return (
    <div className="space-y-5">
      <div className="text-[12px] text-slate-500 font-semibold tracking-wide">
        Title Companies &nbsp;›&nbsp; Northway Holdings
      </div>
      <PageHeader
        title="Northway Holdings"
        action={
          <div className="flex gap-3">
            <GhostButton className="border-[#D8E1EE]">Edit Company</GhostButton>
            <GhostButton onClick={handleDeactivate} className="border-[#F3C7C6] text-[#D14544] hover:bg-red-50 transition">
              Deactivate
            </GhostButton>
            <button
              onClick={handleDelete}
              className="rounded-xl bg-[#D92E2A] px-5 py-3 text-[14px] font-semibold text-white shadow-md hover:bg-red-700 transition focus:outline-none"
            >
              Delete
            </button>
          </div>
        }
      />
      <div className="grid grid-cols-[2fr_0.95fr] gap-5">
        <SectionCard className="p-6">
          <div className="flex gap-4">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-[#DCE7FF] text-brand-500">
              <FileText size={24} />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-3">
                <h3 className="text-[18px] font-semibold text-slate-800">Northway Holdings</h3>
                <StatusBadge status="Active" />
              </div>
              <p className="text-[15px] text-slate-500">Full-service Title &amp; Escrow Partner</p>
              <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-7">
                <InfoBlock label="Primary Contact" lines={["Sarah J. Miller", "Senior Escrow Officer"]} strongFirst />
                <InfoBlock label="Contact Information" lines={["sarah.m@northway.com", "+1 (555) 012-3456"]} icons={[Mail, Link2]} />
                <InfoBlock label="Office Address" lines={["123 Executive Way, Suite 400,", "Austin, TX 78701"]} icons={[MapPin]} />
              </div>
            </div>
          </div>
        </SectionCard>
        <div className="space-y-4">
          <SmallMetricCard title="Total Orders" value="248" tone="blue" />
          <SmallMetricCard title="Active Orders" value="12" tone="blue2" />
          <SmallMetricCard title="Completed Orders" value="236" tone="green" />
        </div>
      </div>
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
              {teamMembers.map(([initials, color, name, email, role]) => (
                <tr key={email} className="border-t border-line text-[14px]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${color}`}>
                        {initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{name}</div>
                        <div className="text-[13px] text-slate-500">{email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">{role}</td>
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
              {recentOrders.map(([id, status, date]) => (
                <tr key={id} className="border-t border-line text-[14px]">
                  <td className="px-6 py-4 font-semibold text-brand-500">{id}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={status as StatusKey} />
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500 font-semibold">{date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </div>
  );
}
