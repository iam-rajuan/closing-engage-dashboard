import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { PageHeader, PrimaryButton, UsersTabs, FilterBar, SimpleStatCard } from "../components/common";
import { CompanyTable } from "../components/tables";
import type { CompanyUser } from "../types";
import { usersApi } from "../api/users";

export function UsersCompaniesPage({
  onAddUser,
  onOpenNotaries,
  onOpenRequests,
  onViewCompany,
  onEditCompany,
}: {
  onAddUser: () => void;
  onOpenNotaries: () => void;
  onOpenRequests: () => void;
  onViewCompany: (company: CompanyUser) => void;
  onEditCompany?: (company: CompanyUser) => void;
}) {
  const { companies, setCompanies, notaries, registrationRequests } = useAppContext();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCompanies = async () => {
      setIsLoading(true);
      try {
        const fetched = await usersApi.getCompanies();
        setCompanies(fetched);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    void loadCompanies();
  }, [setCompanies]);

  const filtered = companies.filter((c) => {
    const matchesSearch =
      (c.publicId || "").toLowerCase().includes(search.toLowerCase()) ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      c.businessEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All Status" || c.status === status;
    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    const dateA = new Date(a.createdDate).getTime();
    const dateB = new Date(b.createdDate).getTime();
    return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Users Management"
        description="Manage title companies and notaries within Closing Engage."
        action = {
          <PrimaryButton onClick={onAddUser}>
            <Plus size={16} />
            Add User
          </PrimaryButton>
        }
      />
      <UsersTabs
        active="companies"
        onCompanies={() => {}}
        onNotaries={onOpenNotaries}
        onRequests={onOpenRequests}
        companyCount={companies.length.toString()}
        notaryCount={notaries.length.toString()}
        requestCount={registrationRequests.filter(r => r.status === "Pending").length.toString()}
      />
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        statusValue={status}
        onStatusChange={setStatus}
        statusOptions={["All Status", "Active", "Inactive", "Pending"]}
        sortValue={sortOrder}
        onSortChange={setSortOrder}
      />
      <div className="grid max-w-[760px] grid-cols-2 gap-3">
        <SimpleStatCard title="Total Companies" value={companies.length.toString()} note="+12% vs last mo" icon="building" />
        <SimpleStatCard title="Active Notaries" value={notaries.length.toString()} note="Global coverage for Closing Engage" icon="shield" />
      </div>
      {isLoading ? (
        <div className="flex h-48 w-full items-center justify-center rounded-xl bg-white border border-[#E2E8F0]">
          <Loader2 className="h-7 w-7 text-brand-500 animate-spin" />
        </div>
      ) : (
        <CompanyTable onViewCompany={onViewCompany} onEditCompany={onEditCompany} rows={sorted} />
      )}
    </div>
  );
}
