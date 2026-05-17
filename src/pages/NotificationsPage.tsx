import { useState } from "react";
import { Bell, ClipboardList, FileText, ShieldCheck } from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useToast } from "../components/Toast";
import { GhostButton, PrimaryButton, SectionCard } from "../components/common";

export function NotificationsPage() {
  const { notifications, markRead, markAllRead, refetch } = useDashboardData();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { showToast } = useToast();

  const handleMarkRead = async (id: string) => {
    await markRead(id);
    showToast("Notification marked as read", { variant: "success" });
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    showToast("All notifications marked as read", { variant: "success" });
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("order")) return <ClipboardList className="text-blue-500" size={18} />;
    if (t.includes("document") || t.includes("file")) return <FileText className="text-emerald-500" size={18} />;
    if (t.includes("notary") || t.includes("verified")) return <ShieldCheck className="text-purple-500" size={18} />;
    return <Bell className="text-slate-500" size={18} />;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold leading-none text-slate-900">Notifications</h1>
          <p className="mt-2 text-[14px] text-slate-500">
            View and manage all system activities, escrow updates, and compliance logs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {notifications.some((n) => !n.read) && (
            <GhostButton onClick={handleMarkAllRead} className="px-4 py-2.5">
              Mark all read
            </GhostButton>
          )}
          <PrimaryButton onClick={refetch}>Refresh logs</PrimaryButton>
        </div>
      </div>

      <SectionCard className="p-0 overflow-hidden">
        {/* Filters bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`pb-1 text-[13px] font-bold border-b-2 transition focus:outline-none ${
                filter === "all" ? "border-brand-500 text-brand-500" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              All Activity ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`pb-1 text-[13px] font-bold border-b-2 transition focus:outline-none ${
                filter === "unread" ? "border-brand-500 text-brand-500" : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </button>
          </div>
        </div>

        {/* List of notifications */}
        <div className="divide-y divide-slate-100">
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                className={`flex items-start justify-between p-6 transition hover:bg-slate-50/50 ${
                  !n.read ? "bg-[#f5f9ff]/40" : ""
                }`}
              >
                <div className="flex gap-4 min-w-0">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 shrink-0">
                    {getIcon(n.title)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-bold text-slate-800">{n.title}</h4>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-600 max-w-[700px] font-medium">{n.message}</p>
                    <span className="mt-2 block text-[11px] font-medium text-slate-400">{n.time}</span>
                  </div>
                </div>

                {!n.read && (
                  <GhostButton
                    onClick={() => handleMarkRead(n.id)}
                    className="shrink-0 px-3 py-1.5 text-[11px] font-bold text-brand-500 hover:bg-brand-50 border-brand-500/20"
                  >
                    Mark read
                  </GhostButton>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-3">
                <Bell size={22} />
              </div>
              <h3 className="text-[15px] font-bold text-slate-800">All caught up!</h3>
              <p className="mt-1 text-[13px] text-slate-500 font-semibold">You don't have any notifications matching this filter.</p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
