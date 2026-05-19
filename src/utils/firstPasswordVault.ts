const STORAGE_KEY = "dashboard_initial_passwords";

type AccountRole = "company" | "notary";

type PasswordRecord = {
  password: string;
  userName?: string;
  email: string;
  role: AccountRole;
  createdAt: string;
};

type AccountPasswordVault = {
  role: AccountRole;
  email: string;
  userName?: string;
  records: PasswordRecord[];
};

const readVault = (): Record<string, AccountPasswordVault> => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return {};

  try {
    const parsed = JSON.parse(saved) as Record<string, PasswordRecord | AccountPasswordVault>;
    return Object.fromEntries(
      Object.entries(parsed).map(([accountId, value]) => {
        if ("records" in value) return [accountId, value];
        return [
          accountId,
          {
            role: value.role,
            email: value.email,
            userName: value.userName,
            records: [value],
          },
        ];
      })
    );
  } catch {
    return {};
  }
};

export const firstPasswordVault = {
  save(accountId: string, record: Omit<PasswordRecord, "createdAt">): void {
    if (!record.password.trim()) return;

    const vault = readVault();
    const nextRecord = {
      ...record,
      createdAt: new Date().toISOString(),
    };

    vault[accountId] = {
      role: record.role,
      email: record.email,
      userName: record.userName,
      records: [nextRecord, ...(vault[accountId]?.records ?? [])],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
  },

  get(accountId: string): PasswordRecord | null {
    return readVault()[accountId]?.records[0] ?? null;
  },

  getAll(accountId: string): PasswordRecord[] {
    return readVault()[accountId]?.records ?? [];
  },

  remove(accountId: string): void {
    const vault = readVault();
    delete vault[accountId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
  },
};
