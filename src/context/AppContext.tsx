import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { CompanyUser, NotaryUser } from "../types";

export interface AppContextType {
  companies: CompanyUser[];
  setCompanies: Dispatch<SetStateAction<CompanyUser[]>>;
  notaries: NotaryUser[];
  setNotaries: Dispatch<SetStateAction<NotaryUser[]>>;
  orders: any[];
  setOrders: Dispatch<SetStateAction<any[]>>;
  documents: any[];
  setDocuments: Dispatch<SetStateAction<any[]>>;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    variant?: "danger" | "warning" | "info"
  ) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("Missing AppContext");
  return ctx;
};
