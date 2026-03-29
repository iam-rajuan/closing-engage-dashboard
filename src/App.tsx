import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Download,
  Eye,
  FileText,
  Filter,
  Link2,
  Mail,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  UserPlus,
  X,
} from "lucide-react";
import {
  analyticsMetrics,
  assignableNotaries,
  assignedOrders,
  companyRows,
  dashboardMetrics,
  documentRows,
  documentTimeline,
  navItems,
  notaryRows,
  orderRows,
  orderTimeline,
  pageGroups,
  profileGradients,
  quickActions,
  recentOrders,
  statusConfig,
  stepItems,
  teamMembers,
  uploadActivity,
} from "./data";
import type { PageKey } from "./types";

type UserModalMode = "company" | "notary";
type StatusKey = keyof typeof statusConfig;

export default function App() {
  const [page, setPage] = useState<PageKey>("dashboard");
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<UserModalMode>("company");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const activeNav = useMemo(() => pageGroups[page], [page]);

  const openUserModal = (mode: UserModalMode) => {
    setUserModalMode(mode);
    setUserModalOpen(true);
  };

  return (
    <div className="h-full bg-canvas text-slate-800">
      <Sidebar
        activeKey={activeNav}
        onSelect={(key) => {
          if (key === "usersCompanies") {
            setPage("usersCompanies");
            return;
          }
          setPage(key);
        }}
      />
      <TopNavbar />
      <main className="ml-[176px] pt-[50px]">
        <div className="px-4 py-4">
          <div className="w-full max-w-none">
            {page === "dashboard" && <DashboardPage onQuickUser={() => openUserModal("company")} />}
            {page === "usersCompanies" && (
              <UsersCompaniesPage
                onAddUser={() => openUserModal("company")}
                onOpenNotaries={() => setPage("usersNotaries")}
                onViewCompany={() => setPage("companyDetails")}
              />
            )}
            {page === "usersNotaries" && (
              <UsersNotariesPage
                onAddUser={() => openUserModal("notary")}
                onOpenCompanies={() => setPage("usersCompanies")}
                onViewNotary={() => setPage("notaryProfile")}
              />
            )}
            {page === "companyDetails" && <CompanyDetailsPage />}
            {page === "notaryProfile" && <NotaryProfilePage />}
            {page === "orders" && <OrdersPage onOpenOrder={() => setPage("orderDetails")} />}
            {page === "orderDetails" && <OrderDetailsPage onBack={() => setPage("orders")} onAssign={() => setAssignModalOpen(true)} />}
            {page === "documents" && <DocumentsPage onOpenDocument={() => setPage("documentView")} />}
            {page === "documentView" && <DocumentViewPage onBack={() => setPage("documents")} />}
            {page === "analytics" && <AnalyticsPage />}
            {page === "settings" && <SettingsPage />}
          </div>
        </div>
      </main>

      {userModalOpen ? (
        <Modal onClose={() => setUserModalOpen(false)} widthClass="max-w-[720px]">
          {userModalMode === "company" ? <AddCompanyUserModal onClose={() => setUserModalOpen(false)} /> : <AddNotaryModal onClose={() => setUserModalOpen(false)} />}
        </Modal>
      ) : null}

      {assignModalOpen ? (
        <Modal onClose={() => setAssignModalOpen(false)} widthClass="max-w-[700px]">
          <AssignNotaryModal onClose={() => setAssignModalOpen(false)} />
        </Modal>
      ) : null}
    </div>
  );
}

function Sidebar({
  activeKey,
  onSelect,
}: {
  activeKey: string;
  onSelect: (key: "dashboard" | "usersCompanies" | "orders" | "documents" | "analytics" | "settings") => void;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-[176px] border-r border-slate-200 bg-white">
      <div className="flex h-[66px] items-center gap-2 border-b border-[#65b486] px-5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#1e7ce8] text-white">
          <div className="absolute h-7 w-7 rounded-full border-4 border-white/70 border-r-transparent" />
          <span className="relative text-xs font-black">CE</span>
        </div>
        <div className="text-[14px] font-semibold text-slate-700">Closing Engage</div>
      </div>
      <nav className="space-y-2 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`flex h-12 w-full items-center gap-3 rounded-lg px-4 text-left text-[14px] font-medium ${
                isActive ? "bg-[#EEF5FF] text-brand-500" : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              <span className={`h-6 w-1 rounded-full ${isActive ? "bg-brand-500" : "bg-transparent"}`} />
              <Icon size={18} strokeWidth={1.9} />
              <span className="-ml-1">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function TopNavbar() {
  return (
    <header className="fixed left-[176px] right-0 top-0 z-20 h-[50px] border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex h-9 w-[346px] items-center gap-2 rounded-lg bg-[#F5F7FB] px-4 text-slate-400">
          <Search size={15} />
          <span className="text-[13px]">Search orders, notaries, or documents...</span>
        </div>
        <div className="flex items-center gap-6">
          <Bell size={18} className="text-slate-700" />
          <div className="h-7 w-px bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <div className="text-[12px] font-semibold text-slate-800">Alex Sterling</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Admin</div>
            </div>
            <Avatar className="h-8 w-8" gradient={profileGradients.mark} />
          </div>
        </div>
      </div>
    </header>
  );
}

function DashboardPage({ onQuickUser }: { onQuickUser: () => void }) {
  return (
    <div className="space-y-4">
      <PageHeader
        title="System Overview"
        description="Real-time performance metrics for Closing Engage ecosystem."
        action={
          <PrimaryButton>
            <Download size={15} />
            Export Report
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-5 gap-4">
        {dashboardMetrics.map((metric) => (
          <MetricPanel key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid grid-cols-[2.1fr_0.95fr] gap-4">
        <SectionCard className="p-5">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h3 className="text-[18px] font-semibold text-slate-800">Active Users Trend</h3>
              <p className="text-[13px] text-slate-500">Daily unique engagement across the portal</p>
            </div>
            <div className="rounded-md bg-[#EFF3FA] px-4 py-2 text-[12px] font-semibold text-slate-600">Last 30 days</div>
          </div>
          <ChartPlaceholder />
        </SectionCard>

        <SectionCard className="p-5">
          <div className="mb-6">
            <h3 className="text-[18px] font-semibold text-slate-800">Quick Actions</h3>
            <p className="text-[13px] text-slate-500">Frequent administrative tasks</p>
          </div>
          <div className="space-y-4">
            {quickActions.map((action) => (
              <button
                key={action.title}
                onClick={action.title === "Add User" ? onQuickUser : undefined}
                className="flex w-full items-start gap-4 rounded-xl border border-line bg-white px-4 py-4 text-left"
              >
                <IconBadge tone={action.tone}>
                  <action.icon size={18} />
                </IconBadge>
                <div>
                  <div className="text-[16px] font-semibold text-slate-800">{action.title}</div>
                  <div className="max-w-[190px] text-[13px] leading-5 text-slate-500">{action.description}</div>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function UsersCompaniesPage({
  onAddUser,
  onOpenNotaries,
  onViewCompany,
}: {
  onAddUser: () => void;
  onOpenNotaries: () => void;
  onViewCompany: () => void;
}) {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Users Management"
        description="Manage title companies and notaries within Closing Engage."
        action={
          <PrimaryButton onClick={onAddUser}>
            <Plus size={16} />
            Add User
          </PrimaryButton>
        }
      />
      <UsersTabs active="companies" onCompanies={() => {}} onNotaries={onOpenNotaries} companyCount="24" notaryCount="142" />
      <FilterBar />
      <div className="grid max-w-[760px] grid-cols-2 gap-3">
        <SimpleStatCard title="Total Companies" value="24" note="+12% vs last mo" icon="building" />
        <SimpleStatCard title="Active Notaries" value="152" note="Global coverage for Closing Engage" icon="shield" />
      </div>
      <CompanyTable onViewCompany={onViewCompany} />
    </div>
  );
}

function UsersNotariesPage({
  onAddUser,
  onOpenCompanies,
  onViewNotary,
}: {
  onAddUser: () => void;
  onOpenCompanies: () => void;
  onViewNotary: () => void;
}) {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Users Management"
        description="Manage title companies and notaries within Closing Engage."
        action={
          <PrimaryButton onClick={onAddUser}>
            <Plus size={16} />
            Add User
          </PrimaryButton>
        }
      />
      <UsersTabs active="notaries" onCompanies={onOpenCompanies} onNotaries={() => {}} companyCount="142" notaryCount="142" />
      <FilterBar />
      <div className="grid max-w-[760px] grid-cols-2 gap-3">
        <SimpleStatCard title="Total Companies" value="24" note="+12% vs last mo" icon="building" />
        <SimpleStatCard title="Active Notaries" value="142" note="Global coverage for Closing Engage" icon="shield" />
      </div>
      <NotaryTable onViewNotary={onViewNotary} />
    </div>
  );
}

function CompanyDetailsPage() {
  return (
    <div className="space-y-4">
      <div className="text-[12px] text-slate-500">Title Companies &nbsp;›&nbsp; Northway Holdings</div>
      <PageHeader
        title="Northway Holdings"
        action={
          <div className="flex gap-3">
            <GhostButton>Edit Company</GhostButton>
            <GhostButton className="border-[#F3C7C6] text-[#D14544]">Deactivate</GhostButton>
            <button className="rounded-lg bg-[#D92E2A] px-5 py-3 text-[14px] font-semibold text-white">Delete</button>
          </div>
        }
      />
      <div className="grid grid-cols-[2fr_0.9fr] gap-4">
        <SectionCard className="p-5">
          <div className="flex gap-4">
            <IconBadge tone="blue" large>
              <FileText size={24} />
            </IconBadge>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-3">
                <h3 className="text-[18px] font-semibold">Northway Holdings</h3>
                <StatusBadge status="Active" />
              </div>
              <p className="text-[15px] text-slate-500">Full-service Title &amp; Escrow Partner</p>
              <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6">
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
      <div className="grid grid-cols-2 gap-4">
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
                <tr key={email} className="border-t border-line">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${color}`}>{initials}</div>
                      <div>
                        <div className="font-semibold">{name}</div>
                        <div className="text-[13px] text-slate-500">{email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{role}</td>
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
                <tr key={id} className="border-t border-line">
                  <td className="px-6 py-4 font-semibold text-brand-500">{id}</td>
                  <td className="px-6 py-4"><StatusBadge status={status as StatusKey} /></td>
                  <td className="px-6 py-4 text-right text-slate-500">{date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </div>
  );
}

function NotaryProfilePage() {
  return (
    <div className="space-y-4">
      <div className="text-[12px] text-slate-500">Notaries &nbsp;›&nbsp; Notary Profile</div>
      <PageHeader
        title="Jane Simmons"
        action={
          <div className="flex gap-3">
            <GhostButton>Edit</GhostButton>
            <PrimaryButton>Verify Notary</PrimaryButton>
            <GhostButton className="border-transparent bg-white text-[#D14544]">Actions</GhostButton>
          </div>
        }
      />
      <div className="grid grid-cols-[2fr_0.95fr] gap-4">
        <SectionCard className="p-5">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-[110px] w-[110px] rounded-3xl" gradient={profileGradients.jane} />
              <div className="absolute bottom-2 right-2 rounded-full bg-[#EEF5FF] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-500">Active</div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-y-6">
              <InfoBlock label="Email Address" lines={["jane.simmons@example.com"]} strongFirst />
              <InfoBlock label="Phone Number" lines={["(555) 123-4567"]} strongFirst />
              <InfoBlock label="Notary License" lines={["#NY-88210-24"]} strongFirst />
              <InfoBlock label="Location Base" lines={["New York, NY"]} strongFirst />
            </div>
          </div>
        </SectionCard>
        <div className="rounded-xl bg-[#2866D1] p-8 text-white shadow-sm">
          <h3 className="text-[18px] font-semibold">Professional Credentials</h3>
          <div className="mt-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">Commission Expiry</div>
          <div className="mt-2 text-[20px] font-semibold">Oct 24, 2026</div>
          <div className="mt-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">Service Area</div>
          <div className="mt-2 max-w-[220px] text-[16px] leading-7 text-white/85">Greater New York Area (Manhattan, Brooklyn, Queens)</div>
        </div>
      </div>
      <div className="grid grid-cols-[1.65fr_1fr] gap-4">
        <SectionCard className="overflow-hidden">
          <TableHeader title="Assigned Orders" action="View All Orders" />
          <table className="w-full">
            <thead className="table-head">
              <tr>
                <th className="px-6 py-4 text-left">Order ID</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedOrders.map(([id, status, date]) => (
                <tr key={id} className="border-t border-line">
                  <td className="px-6 py-4">{id}</td>
                  <td className="px-6 py-4"><StatusBadge status={status as StatusKey} /></td>
                  <td className="px-6 py-4 text-slate-500">{date}</td>
                  <td className="px-6 py-4 text-right text-brand-500"><Eye size={16} className="ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
        <SectionCard className="p-5">
          <h3 className="text-[18px] font-semibold">Upload Activity</h3>
          <div className="mt-6 space-y-5">
            {uploadActivity.map(([title, date]) => (
              <div key={title} className="flex items-center gap-4 rounded-xl border border-line px-4 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF3FA] text-[#D94A45]"><FileText size={18} /></div>
                <div className="flex-1">
                  <div className="font-semibold">{title}</div>
                  <div className="text-[13px] text-slate-500">{date}</div>
                </div>
                <Download size={18} className="text-slate-500" />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function OrdersPage({ onOpenOrder }: { onOpenOrder: () => void }) {
  const filters = ["All Orders", "Received", "Assigned", "Under Review", "Approved", "Completed"];
  return (
    <div className="space-y-4">
      <PageHeader
        title="Orders Management"
        description="Manage and track all closing orders across your portfolio."
        action={
          <PrimaryButton>
            <Plus size={16} />
            Create Order
          </PrimaryButton>
        }
      />
      <div className="grid grid-cols-[1fr_220px] gap-4">
        <SectionCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Quick Filters</div>
            <button className="text-[13px] font-semibold text-brand-500">Reset All</button>
          </div>
          <div className="flex gap-3">
            {filters.map((filter, index) => (
              <button key={filter} className={`rounded-xl px-4 py-2 text-[13px] font-semibold ${index === 0 ? "bg-brand-500 text-white shadow-panel" : "bg-[#EFF3FA] text-slate-600"}`}>{filter}</button>
            ))}
          </div>
        </SectionCard>
        <SectionCard className="p-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Time Period</div>
          <div className="mt-3 flex h-11 items-center justify-between rounded-lg border border-line bg-[#F7FAFD] px-4 text-[14px] text-slate-700">
            <span className="flex items-center gap-2"><Calendar size={16} className="text-brand-500" /> Last 30 Days</span>
            <ChevronDown size={16} />
          </div>
        </SectionCard>
      </div>
      <OrderTable onOpenOrder={onOpenOrder} />
    </div>
  );
}

function OrderDetailsPage({ onBack, onAssign }: { onBack: () => void; onAssign: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button onClick={onBack} className="mt-1 rounded-full border border-line bg-white p-2 text-brand-500"><ArrowLeft size={16} /></button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[18px] font-bold text-slate-900">#ORD-78241</h1>
              <StatusBadge status="Under Review" />
            </div>
            <div className="mt-1 text-[14px] text-slate-500">Order created on Oct 20, 2024</div>
          </div>
        </div>
        <div className="flex gap-3">
          <GhostButton className="text-brand-500">Change Status</GhostButton>
          <PrimaryButton onClick={onAssign}>Assign Notary</PrimaryButton>
        </div>
      </div>
      <SectionCard className="p-5"><StepProgress current={2} /></SectionCard>
      <div className="grid grid-cols-[1.65fr_0.95fr] gap-4">
        <div className="space-y-5">
          <SectionCard className="overflow-hidden">
            <div className="table-head flex items-center justify-between px-5 py-4">
              <span>Order Information</span>
              <Link2 size={14} className="text-brand-500" />
            </div>
            <div className="grid grid-cols-2 gap-6 p-5">
              <InfoBlock label="Title Company" lines={["Grand Peak Title"]} strongFirst />
              <InfoBlock label="Signing Date & Time" lines={["Oct 24, 2024 at 2:00 PM"]} strongFirst icons={[Calendar]} />
              <div className="col-span-2"><InfoBlock label="Property Address" lines={["452 Pine St, San Francisco, CA 94104"]} strongFirst icons={[MapPin]} /></div>
            </div>
          </SectionCard>
          <SectionCard className="p-5">
            <div className="mb-4 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFF2E8] text-[#D57D38]">i</span>
              Special Instructions
            </div>
            <div className="rounded-lg bg-[#FFF2EA] px-5 py-4 text-[14px] leading-6 text-[#7E5A49]">
              Please ensure all signatures are in blue ink. Borrower requires a physical copy of the closing disclosure. Verify ID against provided scanbacks meticulously.
            </div>
          </SectionCard>
          <SectionCard className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Title Documents</div>
              <button className="text-[12px] font-semibold text-brand-500">Add Documents</button>
            </div>
            <div className="space-y-4">
              {[
                ["Closing_Package.pdf", "4.2 MB • Uploaded 2h ago"],
                ["Instructions_Sheet.pdf", "1.1 MB • Uploaded 2h ago"],
              ].map(([name, meta]) => (
                <div key={name} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF0EF] text-[#EB5B53]"><FileText size={18} /></div>
                  <div>
                    <div className="font-semibold">{name}</div>
                    <div className="text-[13px] text-slate-500">{meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
        <div className="space-y-5">
          <SectionCard className="p-4">
            <div className="mb-5 flex items-center justify-between">
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Notary Scanbacks</div>
              <span className="rounded-full bg-[#EEF5FF] px-2 py-1 text-[10px] font-semibold text-brand-500">1 New</span>
            </div>
            <div className="rounded-xl border border-line bg-[#F8FAFD] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-[#EB5B53] shadow-sm"><FileText size={18} /></div>
                <div className="flex-1">
                  <div className="font-semibold">Scanback_V1.pdf</div>
                  <div className="text-[13px] text-slate-500">Uploaded on Oct 24, 2024 at 4:15 PM</div>
                  <button className="mt-1 text-[12px] font-semibold text-brand-500">Preview File</button>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="rounded-lg border border-[#EA8D8C] py-3 text-[14px] font-semibold text-[#D94A45]">Reject</button>
                <button className="rounded-lg bg-[#1EA94B] py-3 text-[14px] font-semibold text-white">Approve</button>
              </div>
            </div>
          </SectionCard>
          <ActivityLog title="Activity Log" items={orderTimeline.map(([title, date, tone]) => ({ title, date, tone }))} footer="View Full Audit Trail" />
        </div>
      </div>
    </div>
  );
}

function DocumentsPage({ onOpenDocument }: { onOpenDocument: () => void }) {
  return (
    <div className="space-y-4">
      <PageHeader title="Documents" description="Manage and access all uploaded files within the transaction pipeline." />
      <div className="grid grid-cols-[1.55fr_repeat(4,0.62fr)] gap-3">
        <SearchField placeholder="Search by file name or order ID" />
        <DropdownField label="File Type: All" />
        <DropdownField label="Uploaded By: All" />
        <DropdownField label="Status: All" />
        <DropdownField label="Date Range" icon={<Calendar size={16} className="text-slate-400" />} />
      </div>
      <DocumentTable onOpenDocument={onOpenDocument} />
      <div className="grid grid-cols-3 gap-4">
        <SimpleStatCard title="Total Files" value="2,482" note="+12% this month" icon="folder" />
        <SimpleStatCard title="Needs Approval" value="48" note="Action required" icon="approval" />
        <SimpleStatCard title="Storage Health" value="62%" note="" icon="cloud" progress={62} />
      </div>
    </div>
  );
}

function DocumentViewPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-[12px] font-semibold text-brand-500">← Back to Documents</button>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-bold leading-none text-slate-900">Closing_Disclosure_Final.pdf</h1>
            <StatusBadge status="Pending Review" />
          </div>
          <div className="mt-2 flex items-center gap-4 text-[14px] text-slate-500">
            <span>Order ID: <span className="font-semibold text-brand-500">#ORD-882190</span></span>
            <span>Priority: High</span>
          </div>
        </div>
        <div className="flex gap-3">
          <GhostButton><Upload size={15} />Share</GhostButton>
          <PrimaryButton><Download size={15} />Version History</PrimaryButton>
        </div>
      </div>
      <div className="grid grid-cols-[1.6fr_0.8fr] gap-4">
        <SectionCard className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-line bg-white px-5 py-3">
            <div className="flex items-center gap-3 text-[12px] font-semibold text-slate-600">
              <button className="rounded bg-[#F2F5FA] px-3 py-1">−</button>
              <span>100%</span>
              <button className="rounded bg-[#F2F5FA] px-3 py-1">+</button>
            </div>
            <div className="text-[12px] font-semibold text-slate-600">Page 1 of 5</div>
            <div className="flex items-center gap-4 text-slate-500">
              <Download size={15} />
              <Search size={15} />
              <MoreVertical size={15} />
            </div>
          </div>
          <div className="bg-[#DDE6F2] p-8"><FilePreview /></div>
        </SectionCard>
        <div className="space-y-5">
          <SectionCard className="p-5">
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Verification Action</div>
            <div className="space-y-3">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-[14px] font-semibold text-white"><ShieldCheck size={16} />Approve Document</button>
              <button className="w-full rounded-lg border border-[#EF9B98] py-3 text-[14px] font-semibold text-[#DD514B]">Reject &amp; Request Changes</button>
              <button className="w-full rounded-lg bg-[#EEF3FA] py-3 text-[14px] font-semibold text-slate-600">Download File</button>
            </div>
          </SectionCard>
          <SectionCard className="p-5">
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">File Information</div>
            <KeyValue rows={[["Size", "1.2 MB"], ["Type", "PDF Document"], ["Upload Date", "Oct 24, 2023"], ["Uploaded By", "Northway Holdings"]]} />
          </SectionCard>
          <SectionCard className="p-5">
            <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Order Context</div>
            <div className="space-y-3 text-[14px]">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded bg-[#EEF5FF] p-2 text-brand-500"><UserPlus size={14} /></div>
                <div><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Assigned Notary</div><div className="font-semibold">Jane Simmons</div></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded bg-[#EEF5FF] p-2 text-brand-500"><MapPin size={14} /></div>
                <div><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Property Location</div><div className="font-semibold">123 Maple St, Austin, TX</div></div>
              </div>
            </div>
          </SectionCard>
          <ActivityLog title="Activity Log" items={documentTimeline.map(([title, date, tone]) => ({ title, date, tone }))} footer="View Full History" />
        </div>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold leading-none text-slate-900">Analytics</h1>
          <p className="mt-2 text-[14px] text-slate-500">Track system performance and insights</p>
        </div>
        <div className="flex gap-2 rounded-full bg-white p-1">
          {["Today", "Last 7 days", "Last 30 days", "Custom range"].map((label, index) => (
            <button key={label} className={`rounded-full px-4 py-2 text-[12px] font-semibold ${index === 2 ? "bg-[#EEF5FF] text-brand-500" : "text-slate-500"}`}>{label}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3">{analyticsMetrics.map((metric) => <MetricPanel key={metric.title} {...metric} compact />)}</div>
      <div className="grid grid-cols-2 gap-4">
        <SectionCard className="p-5">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-[18px] font-semibold">Orders by Status</h3><MoreVertical size={16} className="text-slate-400" /></div>
          <BarPlaceholder />
        </SectionCard>
        <SectionCard className="p-5">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-[18px] font-semibold">Orders Trend</h3><div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500"><span className="h-2 w-2 rounded-full bg-brand-500" />Last 30 Days</div></div>
          <LinePlaceholder />
        </SectionCard>
      </div>
      <div className="grid grid-cols-[1.05fr_1fr] gap-4">
        <SectionCard className="overflow-hidden">
          <TableHeader title="Notary Performance" action="View All" />
          <table className="w-full">
            <thead className="table-head">
              <tr>
                <th className="px-5 py-4 text-left">Name</th>
                <th className="px-5 py-4 text-left">Completed</th>
                <th className="px-5 py-4 text-left">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["SC", "Sarah Connor", "142", "98.5%"],
                ["MK", "Michael K.", "128", "96.2%"],
                ["RW", "Rebecca White", "94", "94.8%"],
              ].map(([initials, name, completed, rate], index) => (
                <tr key={name} className="border-t border-line">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${index === 0 ? "bg-[#DCE7FF] text-[#3165CF]" : "bg-[#EEF3FA] text-slate-500"}`}>{initials}</div>
                      <span className="font-medium">{name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">{completed}</td>
                  <td className="px-5 py-4"><span className="rounded-full bg-[#E3EEFF] px-3 py-1 text-[12px] font-semibold text-brand-500">{rate}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
        <SectionCard className="overflow-hidden">
          <TableHeader title="Title Company Activity" action="Full List" />
          <div className="divide-y divide-line">
            {[
              ["First American Title", "Enterprise Client", "412", "Orders"],
              ["Old Republic Title", "Active Partner", "389", "Orders"],
              ["Stewart Title", "Regional Lead", "276", "Orders"],
            ].map(([name, sub, value, label]) => (
              <div key={name} className="flex items-center justify-between px-5 py-5">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-[#EEF3FA] p-3 text-slate-500"><FileText size={16} /></div>
                  <div><div className="font-semibold">{name}</div><div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-400">{sub}</div></div>
                </div>
                <div className="text-right"><div className="text-[24px] font-semibold leading-none">{value}</div><div className="mt-1 text-[12px] text-slate-400">{label}</div></div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <SectionCard className="flex items-center justify-between px-6 py-7">
        <div>
          <h3 className="text-[24px] font-semibold">File Upload Performance</h3>
          <p className="mt-2 max-w-[520px] text-[15px] leading-6 text-slate-500">Comprehensive tracking of system-wide document processing and automated compliance checks.</p>
        </div>
        <div className="flex items-center gap-12">
          <MetricStrip title="Total Uploads" value="12.4k" />
          <MetricStrip title="Pending Approval" value="1.2k" />
          <MetricStrip title="Approval Rate" value="94.2%" dot />
          <PrimaryButton><Download size={15} />Export Report</PrimaryButton>
        </div>
      </SectionCard>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-4">
      <SectionCard className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="relative"><Avatar className="h-[58px] w-[58px] rounded-2xl" gradient={profileGradients.alex} /><div className="absolute bottom-0 right-0 rounded-full bg-brand-500 p-1 text-white"><Check size={10} /></div></div>
          <div>
            <div className="text-[18px] font-semibold">Alex Thompson</div>
            <div className="mt-1 flex items-center gap-2 text-[14px] text-slate-500"><Mail size={14} />alex.t@estateflux.com</div>
            <div className="mt-1 flex items-center gap-2 text-[14px] text-slate-500"><FileText size={14} />Estate Flux Title</div>
          </div>
        </div>
        <GhostButton>Edit Profile</GhostButton>
      </SectionCard>
      <div className="grid grid-cols-[1.85fr_0.85fr] gap-4">
        <div className="space-y-5">
          <FormSection title="Personal Information">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Full Name" value="Alex Thompson" />
              <FormField label="Email Address" value="alex.t@estateflux.com" />
              <div className="col-span-2"><FormField label="Phone Number" value="+1 (555) 902-4412" /></div>
            </div>
          </FormSection>
          <FormSection title="Company Information">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Company Name" value="Estate Flux Title" />
              <FormField label="Company Email" value="ops@estateflux.com" />
              <FormField label="Contact Number" value="+1 (555) 200-1100" />
              <FormField label="Business Address" value="782 Commerce Blvd, Austin TX" />
            </div>
          </FormSection>
        </div>
        <div className="space-y-5">
          <FormSection title="Security Settings">
            <div className="space-y-4">
              <FormField label="Current Password" value="••••••••" />
              <FormField label="New Password" value="••••••••" />
              <FormField label="Confirm New Password" value="••••••••" />
              <GhostButton className="w-full justify-center text-brand-500">Update Password</GhostButton>
            </div>
          </FormSection>
          <FormSection title="Notification Preferences">
            <div className="space-y-5">
              <NotificationRow title="Email Notifications" text="Receive global summary emails" checked />
              <NotificationRow title="Order Updates" text="Real-time alerts for escrow changes" checked />
              <NotificationRow title="Document Updates" text="Alerts when new documents are signed" checked={false} />
            </div>
          </FormSection>
        </div>
      </div>
      <div className="flex justify-end gap-4 border-t border-[#E9EDF6] pt-5">
        <GhostButton>Cancel</GhostButton>
        <button className="rounded-lg bg-brand-500 px-8 py-3 text-[14px] font-semibold text-white">Save Changes</button>
      </div>
    </div>
  );
}

function CompanyTable({ onViewCompany }: { onViewCompany: () => void }) {
  return (
    <SectionCard className="overflow-hidden">
      <table className="w-full">
        <thead className="table-head"><tr><th className="px-5 py-4 text-left">Company Name</th><th className="px-3 py-4 text-left">Contact Person</th><th className="px-3 py-4 text-left">Contact Details</th><th className="px-3 py-4 text-left">Status</th><th className="px-3 py-4 text-left">Created Date</th><th className="px-5 py-4 text-left">Actions</th></tr></thead>
        <tbody>
          {companyRows.map(([initials, color, companyName, contactPerson, email, phone, status, createdDate]) => (
            <tr key={companyName} className="border-t border-line bg-white text-[14px]">
              <td className="px-5 py-6"><div className="flex items-center gap-3"><div className={`flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-bold ${color}`}>{initials}</div><div className="max-w-[130px] text-[14px] font-semibold leading-5">{companyName}</div></div></td>
              <td className="px-3 py-6">{contactPerson}</td>
              <td className="px-3 py-6"><div>{email}</div><div className="mt-1 text-[12px] text-slate-500">{phone}</div></td>
              <td className="px-3 py-6"><StatusBadge status={status as StatusKey} /></td>
              <td className="px-3 py-6 text-slate-500">{createdDate}</td>
              <td className="px-5 py-6"><div className="flex items-center gap-4 text-slate-500"><button onClick={onViewCompany}><Eye size={16} /></button><button><Pencil size={15} /></button><button><Trash2 size={15} /></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination footer="Showing 1 to 4 of 24 companies" pages={["1", "2", "3", "...", "6"]} />
    </SectionCard>
  );
}

function NotaryTable({ onViewNotary }: { onViewNotary: () => void }) {
  return (
    <SectionCard className="overflow-hidden">
      <table className="w-full">
        <thead className="table-head"><tr><th className="px-4 py-4 text-left">Name</th><th className="px-4 py-4 text-left">Contact Details</th><th className="px-4 py-4 text-left">License No.</th><th className="px-4 py-4 text-left">Status</th><th className="px-4 py-4 text-left">Created Date</th><th className="px-4 py-4 text-left">Actions</th></tr></thead>
        <tbody>
          {notaryRows.map(([initials, color, name, specialty, email, phone, license, status, createdDate]) => (
            <tr key={name} className="border-t border-line text-[14px]">
              <td className="px-4 py-5"><div className="flex items-center gap-3"><div className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold ${color}`}>{initials}</div><div><div className="font-semibold">{name}</div><div className="text-[12px] text-slate-500">{specialty}</div></div></div></td>
              <td className="px-4 py-5"><div>{email}</div><div className="text-[12px] text-slate-500">{phone}</div></td>
              <td className="px-4 py-5"><span className="rounded-md bg-[#EEF3FA] px-3 py-1 text-[13px] text-slate-600">{license}</span></td>
              <td className="px-4 py-5"><StatusBadge status={status as StatusKey} /></td>
              <td className="px-4 py-5 text-slate-500">{createdDate}</td>
              <td className="px-4 py-5"><div className="flex items-center gap-4 text-slate-500"><button onClick={onViewNotary}><Eye size={16} /></button><button><Pencil size={15} /></button><button><Trash2 size={15} /></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination footer="Showing 1 - 10 of 142 notaries" pages={["1", "2", "3", "...", "129"]} />
    </SectionCard>
  );
}

function OrderTable({ onOpenOrder }: { onOpenOrder: () => void }) {
  return (
    <SectionCard className="overflow-hidden">
      <table className="w-full">
        <thead className="table-head"><tr><th className="px-5 py-4 text-left">Order ID</th><th className="px-5 py-4 text-left">Title Company</th><th className="px-5 py-4 text-left">Assigned Notary</th><th className="px-5 py-4 text-left">Property Location</th><th className="px-5 py-4 text-left">Date</th><th className="px-5 py-4 text-left">Status</th><th className="px-5 py-4 text-left">Actions</th></tr></thead>
        <tbody>
          {orderRows.map(([id, company, companyInitials, notary, location, date, status, avatar]) => (
            <tr key={id} className="border-t border-line">
              <td className="px-5 py-5"><button onClick={onOpenOrder} className="whitespace-pre-line text-left font-semibold leading-6 text-brand-500">{id.replace("-", "-\n")}</button></td>
              <td className="px-5 py-5"><div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E9EEF6] text-[12px] font-bold text-slate-500">{companyInitials}</div><div className="max-w-[110px] whitespace-pre-line leading-5">{company}</div></div></td>
              <td className="px-5 py-5">{avatar === "none" ? <div className="text-[14px] italic text-slate-400">Unassigned</div> : <div className="flex items-center gap-3"><Avatar className="h-8 w-8" gradient={avatar === "jane" ? profileGradients.jane : profileGradients.mark} /><div className="whitespace-pre-line leading-5">{notary}</div></div>}</td>
              <td className="px-5 py-5 whitespace-pre-line leading-5">{location}</td>
              <td className="px-5 py-5 whitespace-pre-line leading-5 text-slate-500">{date}</td>
              <td className="px-5 py-5"><StatusBadge status={status as StatusKey} /></td>
              <td className="px-5 py-5"><div className="flex items-center gap-4 text-slate-500"><button onClick={onOpenOrder}><Eye size={16} /></button><button><UserPlus size={16} className={id === "#ORD-90208" ? "rounded-md bg-[#EEF5FF] p-1 text-brand-500" : ""} /></button><button><MoreVertical size={16} /></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination footer="Showing 1 to 10 of 248 orders" pages={["1", "2", "3", "...", "25"]} withPrevious />
    </SectionCard>
  );
}

function DocumentTable({ onOpenDocument }: { onOpenDocument: () => void }) {
  return (
    <SectionCard className="overflow-hidden">
      <table className="w-full">
        <thead className="table-head"><tr><th className="px-5 py-4 text-left">File Name</th><th className="px-5 py-4 text-left">Order ID</th><th className="px-5 py-4 text-left">Uploaded By</th><th className="px-5 py-4 text-left">Date</th><th className="px-5 py-4 text-left">Size</th><th className="px-5 py-4 text-left">Status</th><th className="px-5 py-4 text-left">Actions</th></tr></thead>
        <tbody>
          {documentRows.map(([fileName, orderId, uploadedBy, date, size, status]) => (
            <tr key={fileName} className="border-t border-line">
              <td className="px-5 py-4"><div className="flex items-center gap-4"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF0EF] text-[#EB5B53]"><FileText size={16} /></div><div className="font-semibold">{fileName}</div></div></td>
              <td className="px-5 py-4 font-semibold text-brand-500">{orderId}</td>
              <td className="px-5 py-4"><span className="rounded-md bg-[#EEF3FA] px-3 py-1 text-[11px] font-semibold tracking-[0.04em] text-slate-500">{uploadedBy}</span></td>
              <td className="px-5 py-4 text-slate-500">{date}</td>
              <td className="px-5 py-4 text-slate-500">{size}</td>
              <td className="px-5 py-4"><StatusBadge status={status as StatusKey} /></td>
              <td className="px-5 py-4"><div className="flex items-center gap-5 text-slate-500"><button onClick={onOpenDocument}><Eye size={16} /></button><button><Download size={16} /></button><button><Trash2 size={16} /></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination footer="Showing 1 to 10 of 124 results" pages={["1", "2", "3", "...", "13"]} withPrevious />
    </SectionCard>
  );
}

function AddCompanyUserModal({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <ModalHeader title="Add New User" subtitle="Create a new user account" onClose={onClose} />
      <div className="space-y-6 px-5 py-5">
        <div>
          <div className="mb-3 text-[14px] font-semibold text-slate-600">User Type Selection</div>
          <div className="inline-flex rounded-xl bg-[#EDF1F7] p-1"><button className="rounded-lg bg-white px-5 py-2 text-[14px] font-semibold text-brand-500 shadow-sm">Title Company</button><button className="px-5 py-2 text-[14px] font-medium text-slate-500">Notary</button></div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <InputField label="Company Name" placeholder="e.g. Acme Title Co." />
          <InputField label="Business Email" placeholder="contact@company.com" />
          <InputField label="Phone" placeholder="+1 (555) 000-0000" />
          <InputField label="Contact Person Name" placeholder="Full name" />
          <div className="col-span-2"><InputField label="Address" placeholder="Street address, City, State, ZIP" /></div>
          <div className="col-span-2"><InputField label="Contact Email" placeholder="person@company.com" /></div>
        </div>
        <div>
          <div className="mb-4 flex items-center gap-2 text-[16px] font-semibold uppercase tracking-[0.12em] text-brand-500"><ShieldCheck size={16} />Account Setup</div>
          <div className="grid grid-cols-2 gap-5">
            <InputField label="User Name" placeholder="" />
            <InputField label="Confirm Password" placeholder="••••••••" />
          </div>
          <label className="mt-4 flex items-center gap-3 text-[14px] text-slate-600"><span className="h-5 w-5 rounded border border-line bg-white" />Send invitation email to this user</label>
        </div>
        <div className="flex items-center justify-between">
          <div><div className="text-[16px] font-semibold text-slate-700">User Status</div><div className="text-[13px] text-slate-500">Set initial account state</div></div>
          <ToggleGroup left="Active" right="Inactive" active="left" />
        </div>
      </div>
      <ModalFooter onClose={onClose} confirmLabel="Create User" />
    </div>
  );
}

function AddNotaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <ModalHeader title="Add Notary" subtitle="Create a new notary account" onClose={onClose} />
      <div className="space-y-6 px-5 py-5">
        <ModalSectionTitle title="Personal Information" />
        <div className="grid grid-cols-2 gap-5">
          <InputField label="Full Name" placeholder="e.g. Jane Doe" />
          <InputField label="Email Address" placeholder="jane.doe@example.com" />
          <div className="col-span-2"><InputField label="Phone Number" placeholder="+1 (555) 000-0000" /></div>
        </div>
        <ModalSectionTitle title="Professional Details" />
        <div className="grid grid-cols-2 gap-5">
          <InputField label="License Number" placeholder="LIC-99882211" />
          <InputField label="Commission Expiry Date" placeholder="mm/dd/yyyy" />
          <div className="col-span-2"><InputField label="Service Area / Location" placeholder="City, State or County" icon={<MapPin size={16} className="text-slate-400" />} /></div>
        </div>
        <ModalSectionTitle title="Account Setup" />
        <div className="grid grid-cols-2 gap-5">
          <InputField label="User Name" placeholder="" />
          <InputField label="Confirm Password" placeholder="••••••••" />
        </div>
        <label className="flex items-center gap-3 text-[14px] text-slate-600"><span className="h-5 w-5 rounded border border-line bg-white" />Send invitation email to this user</label>
        <div className="grid grid-cols-2 gap-5">
          <ToggleCard title="Status" subtitle="Active / Inactive" checked />
          <ToggleCard title="Verify Notary" subtitle="Credentials Check" checked={false} />
        </div>
      </div>
      <ModalFooter onClose={onClose} confirmLabel="Create User" />
    </div>
  );
}

function AssignNotaryModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between">
        <div><h2 className="text-[24px] font-bold text-slate-900">Assign Notary</h2><p className="text-[15px] text-slate-500">Select a notary for this order</p></div>
        <button onClick={onClose} className="text-slate-500"><X size={30} strokeWidth={1.5} /></button>
      </div>
      <div className="rounded-2xl bg-[#EEF3FA] p-5">
        <div className="grid grid-cols-[130px_1fr] gap-y-4 text-[16px]">
          <div className="font-semibold uppercase tracking-[0.08em] text-slate-500">Order ID</div>
          <div className="text-right font-semibold">#ORD-90212</div>
          <div className="font-semibold uppercase tracking-[0.08em] text-slate-500">Location</div>
          <div className="text-right font-semibold">123 Maple St, Austin, TX</div>
        </div>
      </div>
      <div className="mt-7"><SearchField placeholder="Search by name or location..." /></div>
      <div className="mt-8 space-y-10">
        {assignableNotaries.map(([name, meta, status]) => (
          <div key={name} className="flex items-center justify-between">
            <div className="flex items-start gap-5">
              <button className="mt-1 h-7 w-7 rounded-full border-2 border-[#D4DAE5] bg-white" />
              <div>
                <div className="flex items-center gap-3"><span className="text-[20px] font-semibold">{name}</span><StatusBadge status={status as StatusKey} /></div>
                <div className="mt-1 text-[16px] text-slate-500">{meta}</div>
              </div>
            </div>
            <div className="rounded-full p-2 text-brand-500"><ShieldCheck size={18} /></div>
          </div>
        ))}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4">
        <button className="rounded-xl bg-brand-500 py-4 text-[16px] font-semibold text-white">Assign Notary</button>
        <button onClick={onClose} className="rounded-xl bg-[#E8EDF6] py-4 text-[16px] font-semibold text-slate-600">Cancel</button>
      </div>
    </div>
  );
}

function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="flex items-start justify-between"><div><h1 className="text-[24px] font-bold leading-none text-slate-900">{title}</h1>{description ? <p className="mt-2 text-[14px] text-slate-500">{description}</p> : null}</div>{action}</div>;
}

function MetricPanel({ title, value, note, tone = "slate", icon: Icon, compact = false }: { title: string; value: string; note?: string; tone?: "blue" | "green" | "amber" | "slate"; icon: typeof FileText; compact?: boolean; }) {
  return (
    <SectionCard className={`p-5 ${compact ? "min-h-[96px]" : "min-h-[142px]"}`}>
      <div className="mb-4 flex items-start justify-between">
        <IconBadge tone={tone}><Icon size={18} /></IconBadge>
        {note ? <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${tone === "amber" ? "text-[#D4882F]" : tone === "green" ? "text-[#2F9E54]" : "text-[#44B887]"}`}>{note}</span> : null}
      </div>
      <div className="text-[15px] font-medium leading-5 text-slate-600">{title}</div>
      <div className="mt-2 text-[18px] font-bold text-slate-900">{value}</div>
    </SectionCard>
  );
}

function IconBadge({ tone, children, large = false }: { tone: string; children: ReactNode; large?: boolean }) {
  const toneClass = tone === "blue" ? "bg-[#EEF5FF] text-brand-500" : tone === "green" ? "bg-[#EEF9F0] text-[#30A35A]" : tone === "amber" ? "bg-[#FFF1E6] text-[#D68A42]" : tone === "blue2" ? "bg-[#F2F7FF] text-[#3B82F6]" : "bg-[#EFF3F8] text-slate-500";
  return <div className={`flex items-center justify-center rounded-2xl ${large ? "h-14 w-14" : "h-12 w-12"} ${toneClass}`}>{children}</div>;
}

function SectionCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{children}</section>;
}

function SimpleStatCard({ title, value, note, icon, progress }: { title: string; value: string; note: string; icon: "building" | "shield" | "folder" | "approval" | "cloud"; progress?: number; }) {
  const tone = icon === "approval" ? "amber" : icon === "shield" ? "green" : "blue";
  return (
    <SectionCard className="p-5">
      <div className="mb-7 flex items-start justify-between">
        <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</div>
        <IconBadge tone={tone}><FileText size={18} /></IconBadge>
      </div>
      <div className="text-[18px] font-bold">{value}</div>
      {progress ? <div className="mt-4 h-1.5 w-20 rounded-full bg-[#E5EAF2]"><div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${progress}%` }} /></div> : <div className={`mt-2 text-[12px] font-semibold ${note.includes("+") ? "text-[#38A868]" : "text-brand-500"}`}>{note}</div>}
    </SectionCard>
  );
}

function UsersTabs({ active, onCompanies, onNotaries, companyCount, notaryCount }: { active: "companies" | "notaries"; onCompanies: () => void; onNotaries: () => void; companyCount: string; notaryCount: string; }) {
  return <div className="border-b border-[#E7EAF1]"><div className="flex gap-8"><button onClick={onCompanies} className={`relative pb-4 text-[14px] font-semibold ${active === "companies" ? "text-brand-500" : "text-slate-500"}`}>Title Companies <span className="ml-2 rounded-full bg-[#EEF3FA] px-2 py-0.5 text-[10px] text-slate-500">{companyCount}</span>{active === "companies" ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-500" /> : null}</button><button onClick={onNotaries} className={`relative pb-4 text-[14px] font-semibold ${active === "notaries" ? "text-brand-500" : "text-slate-500"}`}>Notaries <span className="ml-2 rounded-full bg-[#EEF3FA] px-2 py-0.5 text-[10px] text-slate-500">{notaryCount}</span>{active === "notaries" ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-500" /> : null}</button></div></div>;
}

function FilterBar() {
  return <div className="flex items-center gap-4 rounded-xl bg-white px-4 py-3 shadow-sm"><div className="flex h-11 flex-1 items-center gap-3 rounded-lg bg-[#F5F8FC] px-4 text-slate-400"><Filter size={15} /><span className="text-[14px]">Filter by name, ID or city...</span></div><DropdownField label="All Status" /><DropdownField label="Sort by: Newest" /><Download size={16} className="text-slate-500" /></div>;
}

function SearchField({ placeholder }: { placeholder: string }) {
  return <div className="flex h-11 items-center gap-3 rounded-xl border border-line bg-white px-4"><Search size={16} className="text-slate-400" /><span className="text-[14px] text-slate-400">{placeholder}</span></div>;
}

function DropdownField({ label, icon }: { label: string; icon?: ReactNode }) {
  return <div className="flex h-11 items-center justify-between rounded-xl border border-line bg-white px-4 text-[14px] text-slate-600"><span className="flex items-center gap-2">{icon}{label}</span><ChevronDown size={16} className="text-slate-400" /></div>;
}

function StatusBadge({ status }: { status: StatusKey }) {
  return <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusConfig[status]}`}>{status}</span>;
}

function Pagination({ footer, pages, withPrevious = false }: { footer: string; pages: string[]; withPrevious?: boolean; }) {
  return <div className="flex items-center justify-between bg-[#EEF3FA] px-4 py-3 text-[13px] text-slate-500"><div>{footer}</div><div className="flex items-center gap-2">{withPrevious ? <button className="flex items-center gap-1 text-slate-400"><ChevronLeft size={14} /> Previous</button> : <ChevronLeft size={14} className="text-slate-400" />}{pages.map((page, index) => <button key={`${page}-${index}`} className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[13px] ${index === 0 ? "bg-brand-500 text-white" : "text-slate-600"}`}>{page}</button>)}{withPrevious ? <button className="flex items-center gap-1 text-slate-600">Next <ChevronRight size={14} /></button> : <ChevronRight size={14} className="text-slate-500" />}</div></div>;
}

function ChartPlaceholder() {
  const bars = [60, 92, 78, 132, 174, 142, 110, 98, 104];
  return <div className="relative h-[240px] rounded-xl bg-white"><div className="absolute left-[44%] top-[10%] rounded bg-[#3A3E43] px-3 py-1 text-[11px] text-white">Peak: 1,240</div><svg viewBox="0 0 620 230" className="absolute inset-0 h-full w-full"><path d="M20,140 C90,120 120,118 170,124 C220,130 260,116 300,92 C346,64 400,28 470,50 C530,70 540,130 600,122" fill="none" stroke="#1D5DC3" strokeWidth="3" /></svg><div className="absolute bottom-10 left-0 right-0 flex items-end justify-between gap-3 px-6">{bars.map((bar, index) => <div key={index} className={`flex-1 rounded-t-md ${index === 4 ? "bg-[#1657C0]" : "bg-[#C9DBF7]"}`} style={{ height: `${bar}px` }} />)}</div><div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate-500"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div></div>;
}

function BarPlaceholder() {
  const bars = [75, 120, 98, 142, 110, 58, 66];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return <div className="h-[134px]"><div className="flex h-[118px] items-end justify-between gap-4">{bars.map((bar, index) => <div key={labels[index]} className="flex flex-1 flex-col items-center justify-end gap-3"><div className={`w-full rounded-t-2xl ${index === 2 ? "bg-brand-500" : "bg-[#EEF3FA]"}`} style={{ height: `${bar}px` }} /><span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{labels[index]}</span></div>)}</div></div>;
}

function LinePlaceholder() {
  return <div className="relative h-[140px] overflow-hidden"><svg viewBox="0 0 360 140" className="absolute inset-0 h-full w-full"><path d="M0 100 C60 88 90 40 150 60 C210 80 230 110 280 48 C320 0 350 32 360 58 L360 140 L0 140 Z" fill="#D9E7FD" /><path d="M0 100 C60 88 90 40 150 60 C210 80 230 110 280 48 C320 0 350 32 360 58" fill="none" stroke="#1D5DC3" strokeWidth="3" /></svg><div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400"><span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span></div></div>;
}

function TableHeader({ title, action }: { title: string; action: string }) {
  return <div className="flex items-center justify-between px-5 py-4"><h3 className="text-[18px] font-semibold">{title}</h3><button className="text-[13px] font-semibold text-brand-500">{action}</button></div>;
}

function InfoBlock({ label, lines, strongFirst = false, icons = [] }: { label: string; lines: string[]; strongFirst?: boolean; icons?: Array<any>; }) {
  return <div><div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</div>{lines.map((line, index) => { const Icon = icons[index] ?? icons[0]; return <div key={`${label}-${line}-${index}`} className={`flex items-center gap-2 ${index > 0 ? "mt-1" : ""}`}>{Icon ? <Icon size={14} className="text-brand-500" /> : null}<div className={`${strongFirst && index === 0 ? "font-semibold text-slate-800" : "text-slate-600"}`}>{line}</div></div>; })}</div>;
}

function SmallMetricCard({ title, value, tone }: { title: string; value: string; tone: "blue" | "blue2" | "green"; }) {
  return <SectionCard className="flex items-center gap-4 p-5"><IconBadge tone={tone}><FileText size={18} /></IconBadge><div><div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</div><div className={`mt-1 text-[18px] font-bold ${tone === "green" ? "text-[#2E9F54]" : tone === "blue2" ? "text-[#2381FF]" : "text-slate-900"}`}>{value}</div></div></SectionCard>;
}

function ActivityLog({ title, items, footer }: { title: string; items: Array<{ title: string; date: string; tone: string }>; footer: string; }) {
  return <SectionCard className="p-4"><div className="mb-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">{title}</div><div className="space-y-5">{items.map((item, index) => <div key={item.title} className="relative flex gap-4"><div className="relative mt-1 flex flex-col items-center"><div className={`flex h-4 w-4 items-center justify-center rounded-full ${item.tone === "green" ? "bg-[#DCF9E5] text-[#2E9F54]" : item.tone === "blue" ? "bg-[#EEF5FF] text-brand-500" : "bg-[#EFF3FA] text-slate-400"}`}><div className="h-2 w-2 rounded-full bg-current" /></div>{index < items.length - 1 ? <div className="mt-2 h-10 w-px bg-[#E7ECF4]" /> : null}</div><div><div className="text-[14px] font-semibold text-slate-700">{item.title}</div><div className="text-[12px] text-slate-400">{item.date}</div></div></div>)}</div><button className="mt-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">{footer}</button></SectionCard>;
}

function StepProgress({ current }: { current: number }) {
  return <div className="flex items-center justify-between">{stepItems.map((item, index) => { const active = index <= current; const isCurrent = index === current; return <div key={item} className="relative flex flex-1 flex-col items-center">{index < stepItems.length - 1 ? <div className={`absolute left-1/2 top-4 h-[2px] w-full ${index < current ? "bg-brand-500" : "bg-[#E3E8F1]"}`} /> : null}<div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${isCurrent ? "border-brand-500 bg-white text-brand-500" : active ? "border-brand-500 bg-brand-500 text-white" : "border-[#E1E6EF] bg-[#F6F8FC] text-slate-400"}`}>{active && !isCurrent ? <Check size={14} /> : <Circle size={12} fill="currentColor" />}</div><div className={`mt-4 text-[12px] font-semibold uppercase tracking-[0.08em] ${isCurrent ? "text-brand-500" : "text-slate-500"}`}>{item}</div></div>; })}</div>;
}

function FilePreview() {
  return <div className="mx-auto aspect-[0.75] w-[325px] rounded-sm bg-white px-8 py-7 shadow-[0_20px_40px_rgba(30,41,59,0.18)]"><div className="flex items-start justify-between"><div className="text-[10px] font-bold uppercase">Closing Disclosure</div><div className="text-right text-[6px] text-slate-400"><div>OMB No. 3170-0015</div><div>Expires 01/31/2024</div></div></div><div className="mt-2 h-px bg-slate-600" /><div className="mt-4 grid grid-cols-2 gap-3"><div className="h-3 rounded bg-[#EFF3FA]" /><div className="h-3 rounded bg-[#EFF3FA]" /></div><div className="mt-5 flex h-[74px] items-center justify-center rounded border border-dashed border-[#D8E1ED] bg-[#F9FBFE] text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-300">Document Content Placeholder</div><div className="mt-5 space-y-3"><div className="h-3 rounded bg-[#EFF3FA]" /><div className="h-3 w-11/12 rounded bg-[#EFF3FA]" /><div className="h-3 w-10/12 rounded bg-[#EFF3FA]" /></div><div className="mt-24 flex justify-between"><div className="h-6 w-[70px] rounded bg-[#F5F7FB]" /><div className="h-6 w-[70px] rounded bg-[#F5F7FB]" /></div></div>;
}

function KeyValue({ rows }: { rows: Array<[string, string]> }) {
  return <div className="space-y-4 text-[14px]">{rows.map(([key, value]) => <div key={key} className="flex items-center justify-between"><span className="text-slate-500">{key}</span><span className="font-semibold">{value}</span></div>)}</div>;
}

function MetricStrip({ title, value, dot = false }: { title: string; value: string; dot?: boolean; }) {
  return <div><div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{title}</div><div className="mt-1 flex items-center gap-2 text-[18px] font-bold">{value}{dot ? <span className="h-2.5 w-2.5 rounded-full border border-brand-500" /> : null}</div></div>;
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return <SectionCard className="overflow-hidden"><div className="border-b border-line px-4 py-3.5 text-[18px] font-semibold">{title}</div><div className="p-4">{children}</div></SectionCard>;
}

function FormField({ label, value }: { label: string; value: string }) {
  return <div><div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</div><div className="input-base flex items-center">{value}</div></div>;
}

function NotificationRow({ title, text, checked }: { title: string; text: string; checked: boolean }) {
  return <div className="flex items-center justify-between"><div><div className="text-[14px] font-semibold">{title}</div><div className="text-[12px] text-slate-500">{text}</div></div><Switch checked={checked} /></div>;
}

function Modal({ children, onClose, widthClass }: { children: ReactNode; onClose: () => void; widthClass: string; }) {
  return <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/18 p-4" onClick={onClose}><div className={`w-full rounded-[28px] bg-white shadow-modal ${widthClass}`} onClick={(e) => e.stopPropagation()}>{children}</div></div>;
}

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void; }) {
  return <div className="flex items-start justify-between border-b border-line px-5 py-5"><div><h2 className="text-[24px] font-bold">{title}</h2><p className="text-[15px] text-slate-500">{subtitle}</p></div><button onClick={onClose} className="text-slate-500"><X size={28} strokeWidth={1.5} /></button></div>;
}

function ModalFooter({ onClose, confirmLabel }: { onClose: () => void; confirmLabel: string; }) {
  return <div className="flex items-center justify-end gap-5 rounded-b-[28px] bg-[#EEF3FA] px-5 py-4"><button onClick={onClose} className="text-[16px] font-semibold text-slate-600">Cancel</button><button className="rounded-lg bg-brand-500 px-8 py-3 text-[15px] font-semibold text-white">{confirmLabel}</button></div>;
}

function InputField({ label, placeholder, icon }: { label: string; placeholder: string; icon?: ReactNode; }) {
  return <div><div className="mb-2 text-[14px] font-semibold text-slate-600">{label}</div><div className="input-base flex items-center gap-3">{icon}<span className="text-slate-400">{placeholder}</span></div></div>;
}

function ToggleGroup({ left, right, active }: { left: string; right: string; active: "left" | "right"; }) {
  return <div className="flex rounded-full bg-[#E9EEF6] p-1"><button className={`rounded-full px-5 py-2 text-[13px] font-semibold ${active === "left" ? "bg-white text-brand-500 shadow-sm" : "text-slate-500"}`}>{left}</button><button className={`rounded-full px-5 py-2 text-[13px] font-semibold ${active === "right" ? "bg-white text-brand-500 shadow-sm" : "text-slate-500"}`}>{right}</button></div>;
}

function ToggleCard({ title, subtitle, checked }: { title: string; subtitle: string; checked: boolean; }) {
  return <div className="rounded-2xl bg-[#F6F8FC] px-5 py-4"><div className="flex items-center justify-between"><div><div className="text-[16px] font-semibold text-slate-700">{title}</div><div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">{subtitle}</div></div><Switch checked={checked} /></div></div>;
}

function ModalSectionTitle({ title }: { title: string }) {
  return <div className="flex items-center gap-2 text-[16px] font-semibold uppercase tracking-[0.12em] text-brand-500"><ShieldCheck size={16} />{title}</div>;
}

function Switch({ checked }: { checked: boolean }) {
  return <div className={`relative h-7 w-12 rounded-full ${checked ? "bg-brand-500" : "bg-[#D9E1EE]"}`}><div className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${checked ? "left-6" : "left-1"}`} /></div>;
}

function PrimaryButton({ children, onClick }: { children: ReactNode; onClick?: () => void; }) {
  return <button onClick={onClick} className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(37,99,214,0.22)]">{children}</button>;
}

function GhostButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <button className={`inline-flex items-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-[14px] font-semibold text-slate-600 ${className}`}>{children}</button>;
}

function Avatar({ className, gradient }: { className: string; gradient: string }) {
  return <div className={`${className} overflow-hidden border border-white/50 shadow-sm ${gradient}`} />;
}
