import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { PageHeader, PrimaryButton, UsersTabs, FilterBar, SimpleStatCard } from "../components/common";
import { CompanyTable } from "../components/tables";

export function UsersCompaniesPage({
  onAddUser,
  onOpenNotaries,
  onViewCompany,
}: {
  onAddUser: () => void;
  onOpenNotaries: () => void;
  onViewCompany: () => void;
}) {
  const { companies } = useAppContext();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");

  const filtered = companies.filter((c) => {
    const matchesSearch =
      c[2].toLowerCase().includes(search.toLowerCase()) ||
      c[3].toLowerCase().includes(search.toLowerCase()) ||
      c[4].toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All Status" || c[6] === status;
    return matchesSearch && matchesStatus;
  });

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
      <UsersTabs
        active="companies"
        onCompanies={() => {}}
        onNotaries={onOpenNotaries}
        companyCount={companies.length.toString()}
        notaryCount="142"
      />
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        statusValue={status}
        onStatusChange={setStatus}
        statusOptions={["All Status", "Active", "Inactive", "Pending"]}
      />
      <div className="grid max-w-[760px] grid-cols-2 gap-3">
        <SimpleStatCard title="Total Companies" value={companies.length.toString()} note="+12% vs last mo" icon="building" />
        <SimpleStatCard title="Active Notaries" value="152" note="Global coverage for Closing Engage" icon="shield" />
      </div>
      <CompanyTable onViewCompany={onViewCompany} rows={filtered} />
    </div>
  );
}
