import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { PageHeader, PrimaryButton, UsersTabs, FilterBar, SimpleStatCard } from "../components/common";
import { NotaryTable } from "../components/tables";
import type { NotaryUser } from "../types";
import { usersApi } from "../api/users";

export function UsersNotariesPage({
  onAddUser,
  onOpenCompanies,
  onViewNotary,
  onEditNotary,
}: {
  onAddUser: () => void;
  onOpenCompanies: () => void;
  onViewNotary: (notary: NotaryUser) => void;
  onEditNotary?: (notary: NotaryUser) => void;
}) {
  const { notaries, setNotaries } = useAppContext();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [isLoading, setIsLoading] = useState(false);

  // Simulated initial load from usersApi to show mock API integration
  useEffect(() => {
    const loadNotaries = async () => {
      if (notaries.length <= 4) {
        setIsLoading(true);
        try {
          const fetched = await usersApi.getNotaries();
          setNotaries(fetched);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadNotaries();
  }, []);

  const filtered = notaries.filter((n) => {
    const matchesSearch =
      n.fullName.toLowerCase().includes(search.toLowerCase()) ||
      n.specialty.toLowerCase().includes(search.toLowerCase()) ||
      n.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "All Status" || n.status === status;
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
        sortValue={sortOrder}
        onSortChange={setSortOrder}
      />
      <div className="grid max-w-[760px] grid-cols-2 gap-3">
        <SimpleStatCard title="Total Companies" value="24" note="+12% vs last mo" icon="building" />
        <SimpleStatCard title="Active Notaries" value={notaries.length.toString()} note="Global coverage for Closing Engage" icon="shield" />
      </div>
      {isLoading ? (
        <div className="flex h-48 w-full items-center justify-center rounded-xl bg-white border border-[#E2E8F0]">
          <Loader2 className="h-7 w-7 text-brand-500 animate-spin" />
        </div>
      ) : (
        <NotaryTable onViewNotary={onViewNotary} onEditNotary={onEditNotary} rows={sorted} />
      )}
    </div>
  );
}
