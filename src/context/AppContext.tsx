import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export interface AppContextType {
  companies: any[];
  setCompanies: Dispatch<SetStateAction<any[]>>;
  notaries: any[];
  setNotaries: Dispatch<SetStateAction<any[]>>;
  orders: any[];
  setOrders: Dispatch<SetStateAction<any[]>>;
  documents: any[];
  setDocuments: Dispatch<SetStateAction<any[]>>;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("Missing AppContext");
  return ctx;
};
