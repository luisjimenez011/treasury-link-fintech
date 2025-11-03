export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string | null;
  current_balance: number;
}

export interface BankAccount {
  id: string;
  user_id: string;
  amount: number;
  description: string | null;
  current_balance: number;
}


