import { useState, Fragment } from "react";
import { 
  Building2, 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  FileText, 
  Check, 
  X,
  Sparkles,
  ShieldCheck,
  Award,
  CheckCircle2
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { PageHeader, UsersTabs, FilterBar, SimpleStatCard, SectionCard } from "../components/common";
import { useToast } from "../components/Toast";
import type { RegistrationRequest, CompanyUser, NotaryUser } from "../types";

export function UsersRequestsPage({
  onOpenCompanies,
  onOpenNotaries,
  onApproveRequest,
}: {
  onOpenCompanies: () => void;
  onOpenNotaries: () => void;
  onApproveRequest: (req: RegistrationRequest) => void;
}) {
  const { 
    companies, 
    setCompanies, 
    notaries, 
    setNotaries, 
    registrationRequests, 
    setRegistrationRequests,
    showConfirm
  } = useAppContext();
  
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Requests"); // "All Requests", "Title Company", "Notary"
  const [sortOrder, setSortOrder] = useState("Newest");
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const pendingRequests = registrationRequests.filter(r => r.status === "Pending");
  const approvedRequests = registrationRequests.filter(r => r.status === "Approved");
  const declinedRequests = registrationRequests.filter(r => r.status === "Declined");

  const filtered = registrationRequests.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      (r.companyName && r.companyName.toLowerCase().includes(search.toLowerCase())) ||
      r.coverageArea.toLowerCase().includes(search.toLowerCase());
      
    const matchesRole = 
      roleFilter === "All Requests" || 
      (roleFilter === "Title Company" && r.role === "company") ||
      (roleFilter === "Notary" && r.role === "notary");
      
    return matchesSearch && matchesRole;
  });

  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.createdDate).getTime();
    const dateB = new Date(b.createdDate).getTime();
    return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
  });

  const toggleExpand = (id: string) => {
    setExpandedRequestId(expandedRequestId === id ? null : id);
  };

  const handleApprove = (req: RegistrationRequest) => {
    onApproveRequest(req);
  };

  const handleDecline = (req: RegistrationRequest) => {
    showConfirm(
      "Decline Access Request",
      `Are you sure you want to decline the access request submitted by ${req.fullName}?`,
      () => {
        setRegistrationRequests(prev => 
          prev.map(r => r.id === req.id ? { ...r, status: "Declined" } : r)
        );
        showToast("Request Declined", { 
          message: `The registration request from ${req.fullName} has been marked as declined.`, 
          variant: "error" 
        });
      },
      "Decline Request",
      "danger"
    );
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Users Management"
        description="Review and onboard title companies and notary signers requesting secure Closing Engage access."
      />
      
      <UsersTabs
        active="requests"
        onCompanies={onOpenCompanies}
        onNotaries={onOpenNotaries}
        onRequests={() => {}}
        companyCount={companies.length.toString()}
        notaryCount={notaries.length.toString()}
        requestCount={pendingRequests.length.toString()}
      />
      
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        statusValue={roleFilter}
        onStatusChange={setRoleFilter}
        statusOptions={["All Requests", "Title Company", "Notary"]}
        sortValue={sortOrder}
        onSortChange={setSortOrder}
      />
      
      <div className="grid max-w-[960px] grid-cols-1 md:grid-cols-3 gap-3">
        <SimpleStatCard 
          title="Pending Requests" 
          value={pendingRequests.length.toString()} 
          note="Requires manual compliance check" 
          icon="approval" 
        />
        <SimpleStatCard 
          title="Approved Access" 
          value={approvedRequests.length.toString()} 
          note="Successfully onboarded" 
          icon="shield" 
        />
        <SimpleStatCard 
          title="Declined Requests" 
          value={declinedRequests.length.toString()} 
          note="Dismissed registrations" 
          icon="folder" 
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-line bg-slate-50/50 font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                <th className="px-5 py-4 w-10"></th>
                <th className="px-5 py-4">Applicant Name</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Registration Details</th>
                <th className="px-5 py-4">Coverage Area</th>
                <th className="px-5 py-4">Submitted</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-slate-600">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Sparkles className="h-8 w-8 text-slate-300" />
                      <span className="font-semibold text-slate-500">No requests match your current filters</span>
                      <span className="text-[12px]">New registrations from the website will appear here automatically</span>
                    </div>
                  </td>
                </tr>
              ) : (
                sorted.map((req) => {
                  const isExpanded = expandedRequestId === req.id;
                  
                  return (
                    <Fragment key={req.id}>
                      <tr className={`hover:bg-slate-50/50 transition-colors ${isExpanded ? "bg-slate-50/30" : ""}`}>
                        {/* Toggle Expander Button */}
                        <td className="px-5 py-4">
                          <button 
                            onClick={() => toggleExpand(req.id)}
                            className="text-slate-400 hover:text-brand-500 transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>

                        {/* Name & Contact Info */}
                        <td className="px-5 py-4 font-semibold text-slate-800">
                          <div className="flex flex-col">
                            <span className="text-[14px]">{req.fullName}</span>
                            <span className="text-[11.5px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                              <Mail size={12} /> {req.email}
                            </span>
                          </div>
                        </td>

                        {/* Role Type */}
                        <td className="px-5 py-4">
                          {req.role === "company" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-600 border border-blue-100">
                              <Building2 size={12} /> Title Company
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 border border-emerald-100">
                              <UserCheck size={12} /> Independent Notary
                            </span>
                          )}
                        </td>

                        {/* Details Summary */}
                        <td className="px-5 py-4 text-slate-700">
                          {req.role === "company" ? (
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-850">{req.companyName}</span>
                              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{req.contactType} • {req.phone}</span>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-850">{req.certifications?.split(",")[0] || "Independent Signing Agent"}</span>
                              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">EXP: {req.commissionExpiration || "N/A"} • E&O: {req.eoInsurance || "N/A"}</span>
                            </div>
                          )}
                        </td>

                        {/* State & Coverage Area */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <MapPin size={13} className="text-slate-400 shrink-0" />
                            <span className="truncate max-w-[160px]">{req.coverageArea}</span>
                          </div>
                        </td>

                        {/* Submitted Date */}
                        <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-slate-400 shrink-0" />
                            <span>{req.createdDate}</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            req.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-200/50" :
                            req.status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50" :
                            "bg-slate-50 text-slate-400 border border-slate-200/50"
                          }`}>
                            {req.status === "Pending" ? "Pending Review" : req.status}
                          </span>
                        </td>

                        {/* Row Actions */}
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          {req.status === "Pending" ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleApprove(req)}
                                title="Approve & Onboard User"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-200/40 cursor-pointer"
                              >
                                <Check size={15} />
                              </button>
                              <button
                                onClick={() => handleDecline(req)}
                                title="Decline Request"
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-200/40 cursor-pointer"
                              >
                                <X size={15} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[12px] text-slate-400 font-semibold italic">Action Completed</span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable Details Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50 border-t border-line">
                          <td colSpan={8} className="px-10 py-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13.5px]">
                              {/* Left Side: Custom Details */}
                              <div className="space-y-3">
                                <h4 className="text-[13px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                  <Sparkles size={13} className="text-brand-500" /> Professional Overview
                                </h4>
                                
                                <div className="space-y-2.5">
                                  {req.role === "company" ? (
                                    <>
                                      <div className="flex items-center gap-3">
                                        <Building2 size={15} className="text-slate-400 shrink-0" />
                                        <span><strong>Organization:</strong> {req.companyName}</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <FileText size={15} className="text-slate-400 shrink-0" />
                                        <span><strong>Request Segment:</strong> {req.requestType} • {req.contactType}</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Phone size={15} className="text-slate-400 shrink-0" />
                                        <span><strong>Contact Line:</strong> {req.phone}</span>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-100/80 shadow-sm">
                                        <div className="space-y-1.5">
                                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                            <Award size={12} /> Commission Number
                                          </div>
                                          <div className="font-semibold text-slate-800 text-[13px]">{req.commissionNumber}</div>
                                        </div>
                                        <div className="space-y-1.5">
                                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                            <Calendar size={12} /> Expirations
                                          </div>
                                          <div className="font-semibold text-slate-800 text-[13px]">{req.commissionExpiration}</div>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-100/80 shadow-sm mt-2">
                                        <div className="space-y-1.5">
                                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                            <ShieldCheck size={12} /> E&O Insurance Policy
                                          </div>
                                          <div className="font-semibold text-slate-800 text-[13px]">{req.eoInsurance}</div>
                                        </div>
                                        <div className="space-y-1.5">
                                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                                            <Award size={12} /> Certifications
                                          </div>
                                          <div className="font-semibold text-slate-800 text-[13px]">{req.certifications}</div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  
                                  <div className="flex items-start gap-3 pt-1">
                                    <MapPin size={15} className="text-slate-400 shrink-0 mt-0.5" />
                                    <span><strong>Coverage Boundaries:</strong> {req.coverageArea}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right Side: Message / Integration requirements */}
                              <div className="space-y-3 flex flex-col justify-between">
                                <div>
                                  <h4 className="text-[13px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                    <MessageSquare size={13} className="text-brand-500" /> Applicant Cover Note / Integration Request
                                  </h4>
                                  <div className="mt-2.5 p-3.5 bg-white rounded-xl border border-slate-100/80 text-[13px] leading-relaxed text-slate-600 shadow-inner italic">
                                    "{req.message || "No additional comments provided."}"
                                  </div>
                                </div>

                                {/* Quick Info Alert Banner */}
                                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2.5 items-start text-[11.5px] leading-normal text-blue-900 font-medium">
                                  <CheckCircle2 size={14} className="text-blue-600 shrink-0 mt-0.5" />
                                  <span>
                                    <strong>Compliance Suggestion:</strong> This request has cleared standard automatic email & area validation. You can manual verify or reject.
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
