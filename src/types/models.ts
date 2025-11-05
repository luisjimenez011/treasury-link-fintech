export interface Transaction {
  id: string;
  user_id: string;
  account_id: string; // ✅ Muy importante
  amount: number;
  description: string | null;
  transaction_date: string;
}

export interface BankAccount {
  id: string;
  user_id: string;
  bank_name: string | null;
}
