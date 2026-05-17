import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  companyRows as initialCompanyRows,
  documentRows as initialDocumentRows,
  notaryRows as initialNotaryRows,
  orderRows as initialOrderRows,
  pageGroups,
} from "./data";
import type { PageKey } from "./types";
import { ToastProvider } from "./components/Toast";
import { AppContext } from "./context/AppContext";
import { Sidebar, TopNavbar } from "./components/layout";
import { Modal, AddCompanyUserModal, AddNotaryModal, AssignNotaryModal, CreateOrderModal } from "./components/modals";
import {
  LoginPage,
  DashboardPage,
  UsersCompaniesPage,
  UsersNotariesPage,
  CompanyDetailsPage,
  NotaryProfilePage,
  OrdersPage,
  OrderDetailsPage,
  DocumentsPage,
  DocumentViewPage,
  AnalyticsPage,
  SettingsPage,
  NotificationsPage,
} from "./pages";

type UserModalMode = "company" | "notary";

export default function App() {
  const [page, setPage] = useState<PageKey>("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("admin_auth") === "true");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<UserModalMode>("company");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
  const [ordersInitialFilter, setOrdersInitialFilter] = useState("All Orders");
  const activeNav = useMemo(() => pageGroups[page], [page]);

  const [companies, setCompanies] = useState<any[]>([...initialCompanyRows]);
  const [notaries, setNotaries] = useState<any[]>([...initialNotaryRows]);
  const [orders, setOrders] = useState<any[]>([...initialOrderRows]);
  const [documents, setDocuments] = useState<any[]>([...initialDocumentRows]);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  const openUserModal = (mode: UserModalMode) => {
    setUserModalMode(mode);
    setUserModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={() => {
          localStorage.setItem("admin_auth", "true");
          setIsAuthenticated(true);
          setPage("dashboard");
        }}
      />
    );
  }

  return (
    <ToastProvider>
      <AppContext.Provider
        value={{
          companies,
          setCompanies,
          notaries,
          setNotaries,
          orders,
          setOrders,
          documents,
          setDocuments,
          showConfirm,
        }}
      >
        <div className="h-full bg-canvas text-slate-800">
          {/* Responsive mobile backdrop */}
          {isSidebarOpen && (
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-35 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
            />
          )}
          <Sidebar
            activeKey={activeNav}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onSelect={(key) => {
              if (key === "usersCompanies") {
                setPage("usersCompanies");
                return;
              }
              setPage(key);
            }}
          />
          <TopNavbar
            onLogout={() => {
              localStorage.removeItem("admin_auth");
              setIsAuthenticated(false);
            }}
            onToggleSidebar={() => setIsSidebarOpen(true)}
            onGoToSettings={() => setPage("settings")}
            onViewAllNotifications={() => setPage("notifications")}
          />
          <main className="ml-0 lg:ml-[220px] pt-[68px]">
            <div className="px-4 py-4">
              <div className="w-full max-w-none">
                {page === "dashboard" && (
                  <DashboardPage
                    onQuickUser={() => openUserModal("company")}
                    onAssignOrder={() => {
                      setOrdersInitialFilter("Received");
                      setPage("orders");
                    }}
                    onApproveDocuments={() => {
                      setOrdersInitialFilter("Under Review");
                      setPage("orders");
                    }}
                  />
                )}
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
                {page === "orders" && (
                  <OrdersPage
                    initialFilter={ordersInitialFilter}
                    onOpenOrder={() => setPage("orderDetails")}
                    onCreateOrder={() => setCreateOrderModalOpen(true)}
                  />
                )}
                {page === "orderDetails" && (
                  <OrderDetailsPage onBack={() => setPage("orders")} onAssign={() => setAssignModalOpen(true)} />
                )}
                {page === "documents" && <DocumentsPage onOpenDocument={() => setPage("documentView")} />}
                {page === "documentView" && <DocumentViewPage onBack={() => setPage("documents")} />}
                {page === "analytics" && <AnalyticsPage />}
                {page === "settings" && <SettingsPage />}
                {page === "notifications" && <NotificationsPage />}
              </div>
            </div>
          </main>

          {userModalOpen ? (
            <Modal onClose={() => setUserModalOpen(false)} widthClass="max-w-[720px]">
              {userModalMode === "company" ? (
                <AddCompanyUserModal onClose={() => setUserModalOpen(false)} onSwitchType={() => setUserModalMode("notary")} />
              ) : (
                <AddNotaryModal onClose={() => setUserModalOpen(false)} />
              )}
            </Modal>
          ) : null}

          {assignModalOpen ? (
            <Modal onClose={() => setAssignModalOpen(false)} widthClass="max-w-[700px]">
              <AssignNotaryModal onClose={() => setAssignModalOpen(false)} />
            </Modal>
          ) : null}

          {createOrderModalOpen ? (
            <Modal onClose={() => setCreateOrderModalOpen(false)} widthClass="max-w-[980px]">
              <CreateOrderModal
                onClose={() => setCreateOrderModalOpen(false)}
                onCreate={() => {
                  setCreateOrderModalOpen(false);
                  setPage("orderDetails");
                }}
              />
            </Modal>
          ) : null}

          {confirmModal.isOpen ? (
            <Modal onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))} widthClass="max-w-[440px]">
              <div className="p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-6">
                  <AlertTriangle size={28} />
                </div>
                <h2 className="text-[24px] font-bold text-slate-900">{confirmModal.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-500">{confirmModal.message}</p>
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                    className="flex-1 h-12 rounded-xl border border-slate-200 bg-white font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      confirmModal.onConfirm();
                      setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                    }}
                    className="flex-1 h-12 rounded-xl bg-rose-600 font-semibold text-white shadow-lg shadow-rose-200 hover:bg-rose-700 transition-transform active:scale-[0.98] focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Modal>
          ) : null}
        </div>
      </AppContext.Provider>
    </ToastProvider>
  );
}
