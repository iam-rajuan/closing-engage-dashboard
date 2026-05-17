import { useState, useEffect, useRef } from "react";
import { Menu, Search, X, Bell, User, LogOut } from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { globalSearch } from "../../api/dashboardService";
import type { SearchResult } from "../../api/dashboardService";
import { profileGradients } from "../../data";
import { Avatar } from "../common";

export function TopNavbar({
  onLogout,
  onToggleSidebar,
  onGoToSettings,
  onViewAllNotifications,
}: {
  onLogout: () => void;
  onToggleSidebar: () => void;
  onGoToSettings: () => void;
  onViewAllNotifications: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markRead, markAllRead } = useDashboardData();

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await globalSearch(searchQuery);
      setSearchResults(results);
      setSearchOpen(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const typeIcons: Record<string, string> = {
    order: "📋",
    notary: "👤",
    document: "📄",
    company: "🏢",
  };

  return (
    <header className="fixed left-0 lg:left-[220px] right-0 top-0 z-20 h-[68px] border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="mr-2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 lg:hidden focus:outline-none transition"
          >
            <Menu size={20} />
          </button>
          {/* Functional Search Bar */}
          <div ref={searchRef} className="relative hidden sm:block">
            <div className="flex h-10 w-[380px] items-center gap-2 rounded-xl bg-[#F5F7FB] px-4 text-slate-400 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-brand-500/20 focus-within:shadow-sm">
              <Search size={15} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
                className="w-full border-0 bg-transparent text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Search orders, notaries, or documents..."
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                    setSearchOpen(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {/* Search Results Dropdown */}
            {searchOpen && searchResults.length > 0 && (
              <div className="search-dropdown absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-[#e2e8f3] bg-white py-2 shadow-[0_16px_48px_rgba(15,23,42,0.14)] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                  {searchResults.length} results
                </div>
                {searchResults.map((r) => (
                  <button
                    key={r.id}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-[#f5f8fd] focus:outline-none"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <span className="text-[14px]">{typeIcons[r.type]}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-semibold text-slate-800">{r.title}</div>
                      <div className="truncate text-[12px] text-slate-500">{r.subtitle}</div>
                    </div>
                    <span className="shrink-0 rounded-md bg-[#EEF3FA] px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-500">
                      {r.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-5">
          {/* Notification Bell */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-50 focus:outline-none"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-bold text-white shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="notification-dropdown absolute right-0 top-full z-50 mt-2 w-[380px] overflow-hidden rounded-2xl border border-[#e2e8f3] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.15)] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                  <h3 className="text-[15px] font-semibold text-slate-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[12px] font-semibold text-brand-500 hover:text-brand-600 focus:outline-none transition"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-50">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`flex w-full items-start gap-3 px-5 py-3.5 text-left transition hover:bg-[#f8fafd] focus:outline-none ${
                        !n.read ? "bg-[#f5f9ff]/40" : ""
                      }`}
                    >
                      <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${!n.read ? "bg-brand-500" : "bg-transparent"}`} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-semibold text-slate-800">{n.title}</div>
                        <div className="mt-0.5 text-[12px] leading-5 text-slate-500">{n.message}</div>
                        <div className="mt-1 text-[11px] text-slate-400 font-medium">{n.time}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="border-t border-line px-5 py-3 text-center bg-slate-50/55">
                  <button
                    onClick={() => {
                      setNotifOpen(false);
                      onViewAllNotifications();
                    }}
                    className="text-[13px] font-semibold text-brand-500 hover:text-brand-600 w-full focus:outline-none transition"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-slate-50 text-left focus:outline-none"
            >
              <div className="text-right leading-tight hidden md:block">
                <div className="text-[13px] font-semibold text-slate-800">Alex Sterling</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Admin</div>
              </div>
              <Avatar className="h-8 w-8" gradient={profileGradients.mark} />
            </button>

            {profileOpen && (
              <div className="profile-dropdown absolute right-0 top-full z-50 mt-2 w-[220px] overflow-hidden rounded-2xl border border-[#e2e8f3] bg-white py-2 shadow-[0_20px_60px_rgba(15,23,42,0.15)] animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="border-b border-slate-100 px-4 py-3 bg-slate-50/30">
                  <p className="text-[13px] font-bold text-slate-800">Alex Sterling</p>
                  <p className="text-[11px] text-slate-400 truncate font-medium">alex.sterling@closingengage.com</p>
                </div>

                <div className="px-1.5 py-1.5 space-y-0.5">
                  <button
                    onClick={() => {
                      onGoToSettings();
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition focus:outline-none"
                  >
                    <User size={15} className="text-slate-400" />
                    My Profile
                  </button>
                </div>

                <div className="border-t border-slate-100 px-1.5 pt-1.5 pb-0.5">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold text-red-600 hover:bg-red-50/50 transition focus:outline-none"
                  >
                    <LogOut size={15} className="text-red-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
