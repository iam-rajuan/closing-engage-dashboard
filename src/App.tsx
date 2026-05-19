import { useMemo, useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import {
  companyRows as initialCompanyRows,
  documentRows as initialDocumentRows,
  notaryRows as initialNotaryRows,
  orderRows as initialOrderRows,
  pageGroups,
  initialRegistrationRequests,
} from "./data";
import type { PageKey, CompanyUser, NotaryUser } from "./types";
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
  UsersRequestsPage,
} from "./pages";

type UserModalMode = "company" | "notary";

export default function App() {
  const [page, setPage] = useState<PageKey>(() => {
    const saved = localStorage.getItem("dashboard_active_page");
    return (saved as PageKey) || "dashboard";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("admin_auth") === "true");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<UserModalMode>("company");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
  const [ordersInitialFilter, setOrdersInitialFilter] = useState("All Orders");

  useEffect(() => {
    localStorage.setItem("dashboard_active_page", page);
  }, [page]);

  const activeNav = useMemo(() => pageGroups[page], [page]);

  const [companies, setCompanies] = useState<CompanyUser[]>([...initialCompanyRows]);
  const [notaries, setNotaries] = useState<NotaryUser[]>([...initialNotaryRows]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyUser | null>(() => {
    const saved = localStorage.getItem("dashboard_selected_company");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (selectedCompany) {
      localStorage.setItem("dashboard_selected_company", JSON.stringify(selectedCompany));
    } else {
      localStorage.removeItem("dashboard_selected_company");
    }
  }, [selectedCompany]);

  const currentViewedCompany = useMemo(() => {
    if (!selectedCompany) return null;
    return companies.find((c) => c.id === selectedCompany.id) || selectedCompany;
  }, [selectedCompany, companies]);

  const [selectedNotary, setSelectedNotary] = useState<NotaryUser | null>(() => {
    const saved = localStorage.getItem("dashboard_selected_notary");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (selectedNotary) {
      localStorage.setItem("dashboard_selected_notary", JSON.stringify(selectedNotary));
    } else {
      localStorage.removeItem("dashboard_selected_notary");
    }
  }, [selectedNotary]);

  const currentViewedNotary = useMemo(() => {
    if (!selectedNotary) return null;
    return notaries.find((n) => n.id === selectedNotary.id) || selectedNotary;
  }, [selectedNotary, notaries]);

  const [editingCompany, setEditingCompany] = useState<CompanyUser | null>(null);
  const [editingNotary, setEditingNotary] = useState<NotaryUser | null>(null);
  const [prefillRequest, setPrefillRequest] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([...initialOrderRows]);
  const [documents, setDocuments] = useState<any[]>([...initialDocumentRows]);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  
  const [registrationRequests, setRegistrationRequests] = useState<any[]>(() => {
    const saved = localStorage.getItem("registration_requests");
    try {
      return saved ? JSON.parse(saved) : initialRegistrationRequests;
    } catch {
      return initialRegistrationRequests;
    }
  });

  useEffect(() => {
    localStorage.setItem("registration_requests", JSON.stringify(registrationRequests));
  }, [registrationRequests]);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(() => {
    return localStorage.getItem("dashboard_selected_order_id");
  });

  const [orderDetailsBackPage, setOrderDetailsBackPage] = useState<PageKey>(() => {
    return (localStorage.getItem("dashboard_order_back_page") as PageKey) || "orders";
  });

  useEffect(() => {
    if (selectedOrderId) {
      localStorage.setItem("dashboard_selected_order_id", selectedOrderId);
    } else {
      localStorage.removeItem("dashboard_selected_order_id");
    }
  }, [selectedOrderId]);

  useEffect(() => {
    localStorage.setItem("dashboard_order_back_page", orderDetailsBackPage);
  }, [orderDetailsBackPage]);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    variant?: "danger" | "warning" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    variant?: "danger" | "warning" | "info"
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmText,
      variant,
    });
  };

  const openUserModal = (mode: UserModalMode) => {
    setUserModalMode(mode);
    setUserModalOpen(true);
  };

  const openEditCompanyModal = (company: CompanyUser) => {
    setEditingCompany(company);
    setUserModalMode("company");
    setUserModalOpen(true);
  };

  const openEditNotaryModal = (notary: NotaryUser) => {
    setEditingNotary(notary);
    setUserModalMode("notary");
    setUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setUserModalOpen(false);
    setEditingCompany(null);
    setEditingNotary(null);
    setPrefillRequest(null);
  };

  const handleApproveRequest = (req: any) => {
    setPrefillRequest(req);
    setUserModalMode(req.role);
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
          registrationRequests,
          setRegistrationRequests,
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
              localStorage.removeItem("dashboard_active_page");
              localStorage.removeItem("dashboard_selected_company");
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
                    onOpenRequests={() => setPage("usersRequests")}
                    onViewCompany={(company) => {
                      setSelectedCompany(company);
                      setPage("companyDetails");
                    }}
                    onEditCompany={openEditCompanyModal}
                  />
                )}
                {page === "usersNotaries" && (
                  <UsersNotariesPage
                    onAddUser={() => openUserModal("notary")}
                    onOpenCompanies={() => setPage("usersCompanies")}
                    onOpenRequests={() => setPage("usersRequests")}
                    onViewNotary={(notary) => {
                      setSelectedNotary(notary);
                      setPage("notaryProfile");
                    }}
                    onEditNotary={openEditNotaryModal}
                  />
                )}
                {/* 
                {page === "usersRequests" && (
                  <UsersRequestsPage
                    onOpenCompanies={() => setPage("usersCompanies")}
                    onOpenNotaries={() => setPage("usersNotaries")}
                    onApproveRequest={handleApproveRequest}
                  />
                )}
                */}
                {page === "companyDetails" && (
                  <CompanyDetailsPage
                    company={currentViewedCompany}
                    onBack={() => setPage("usersCompanies")}
                    onEdit={openEditCompanyModal}
                  />
                )}
                 {page === "notaryProfile" && (
                  <NotaryProfilePage
                    notary={currentViewedNotary}
                    onBack={() => setPage("usersNotaries")}
                    onEdit={openEditNotaryModal}
                    onViewOrder={(orderId) => {
                      setSelectedOrderId(orderId);
                      setOrderDetailsBackPage("notaryProfile");
                      setPage("orderDetails");
                    }}
                    onViewAllOrders={() => {
                      setOrdersInitialFilter("All Orders");
                      setPage("orders");
                    }}
                  />
                )}
                {page === "orders" && (
                  <OrdersPage
                    initialFilter={ordersInitialFilter}
                    onOpenOrder={(orderId) => {
                      setSelectedOrderId(orderId);
                      setOrderDetailsBackPage("orders");
                      setPage("orderDetails");
                    }}
                    onCreateOrder={() => setCreateOrderModalOpen(true)}
                    onAssign={(orderId) => {
                      setSelectedOrderId(orderId);
                      setAssignModalOpen(true);
                    }}
                  />
                )}
                {page === "orderDetails" && (
                  <OrderDetailsPage
                    orderId={selectedOrderId}
                    onBack={() => setPage(orderDetailsBackPage)}
                    onAssign={() => setAssignModalOpen(true)}
                  />
                )}
                {page === "documents" && (
                  <DocumentsPage
                    onOpenDocument={(doc) => {
                      setSelectedDocument(doc);
                      setPage("documentView");
                    }}
                  />
                )}
                {page === "documentView" && (
                  <DocumentViewPage
                    document={selectedDocument}
                    onBack={() => setPage("documents")}
                  />
                )}
                {page === "analytics" && <AnalyticsPage onNavigate={(newPage) => setPage(newPage)} />}
                {page === "settings" && <SettingsPage />}
                {page === "notifications" && <NotificationsPage />}
              </div>
            </div>
          </main>

          {userModalOpen ? (
            <Modal onClose={handleCloseUserModal} widthClass="max-w-[720px]">
              {userModalMode === "company" ? (
                <AddCompanyUserModal
                  onClose={handleCloseUserModal}
                  onSwitchType={() => setUserModalMode("notary")}
                  companyToEdit={editingCompany}
                  prefillData={
                    prefillRequest && prefillRequest.role === "company"
                      ? {
                          companyName: prefillRequest.companyName,
                          businessEmail: prefillRequest.email,
                          phone: prefillRequest.phone,
                          contactPerson: prefillRequest.fullName,
                          address: prefillRequest.coverageArea,
                          contactEmail: prefillRequest.email,
                          userName: prefillRequest.email.split("@")[0],
                        }
                      : null
                  }
                  requestId={prefillRequest ? prefillRequest.id : null}
                />
              ) : (
                <AddNotaryModal
                  onClose={handleCloseUserModal}
                  notaryToEdit={editingNotary}
                  prefillData={
                    prefillRequest && prefillRequest.role === "notary"
                      ? {
                          fullName: prefillRequest.fullName,
                          email: prefillRequest.email,
                          phone: prefillRequest.phone,
                          license: prefillRequest.commissionNumber,
                          expiry: prefillRequest.commissionExpiration,
                          serviceArea: prefillRequest.coverageArea,
                          userName: prefillRequest.email.split("@")[0],
                        }
                      : null
                  }
                  requestId={prefillRequest ? prefillRequest.id : null}
                />
              )}
            </Modal>
          ) : null}

          {assignModalOpen ? (
            <Modal onClose={() => setAssignModalOpen(false)} widthClass="max-w-[700px]">
              <AssignNotaryModal orderId={selectedOrderId} onClose={() => setAssignModalOpen(false)} />
            </Modal>
          ) : null}

          {createOrderModalOpen ? (
            <Modal onClose={() => setCreateOrderModalOpen(false)} widthClass="max-w-[980px]">
              <CreateOrderModal
                onClose={() => setCreateOrderModalOpen(false)}
                onCreate={() => {
                  setCreateOrderModalOpen(false);
                  setOrderDetailsBackPage("orders");
                  setPage("orderDetails");
                }}
              />
            </Modal>
          ) : null}

          {confirmModal.isOpen ? (
            <Modal onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))} widthClass="max-w-[440px]">
              <div className="p-7">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-6 ${
                  confirmModal.variant === "warning"
                    ? "bg-amber-50 text-amber-600"
                    : confirmModal.variant === "info"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}>
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
                    className={`flex-1 h-12 rounded-xl font-semibold text-white shadow-lg transition-transform active:scale-[0.98] focus:outline-none ${
                      confirmModal.variant === "warning"
                        ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
                        : confirmModal.variant === "info"
                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                        : "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
                    }`}
                  >
                    {confirmModal.confirmText || (confirmModal.variant === "warning" ? "Confirm" : "Delete")}
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
