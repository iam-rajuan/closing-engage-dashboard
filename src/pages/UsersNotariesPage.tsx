import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { PageHeader, PrimaryButton, UsersTabs, FilterBar, SimpleStatCard } from "../components/common";
import { NotaryTable } from "../components/tables";

export function UsersNotariesPage({
  onAddUser,
  onOpenCompanies,
  onViewNotary,
}: {
  onAddUser: () => void;
  onOpenCompanies: () => void;
  onViewNotary: () => void;
}) {
  const { notaries } = useAppContext();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");

  const filtered = notaries.filter((n) => {
    const matchesSearch =
      n[2].toLowerCase().includes(search.toLowerCase()) ||
      n[4].toLowerCase().includes(search.toLowerCase()) ||
      n[6].toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All Status" || n[7] === status;
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
        active="notaries"
        onCompanies={onOpenCompanies}
        onNotaries={() => {}}
        companyCount="24"
        notaryCount={notaries.length.toString()}
      />
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        statusValue={status}
        onStatusChange={setStatus}
        statusOptions={["All Status", "Active", "Inactive", "Verified", "Pending"]}
      />
      <div className="grid max-w-[760px] grid-cols-2 gap-3">
        <SimpleStatCard title="Total Companies" value="24" note="+12% vs last mo" icon="building" />
        <SimpleStatCard title="Active Notaries" value={notaries.length.toString()} note="Global coverage for Closing Engage" icon="shield" />
      </div>
      <NotaryTable onViewNotary={onViewNotary} rows={filtered} />
    </div>
  );
}
