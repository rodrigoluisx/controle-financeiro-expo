export type TransactionType = 'income' | 'expense';
export type Transaction = {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: TransactionType;
  transaction_date: string;
  created_at: string;
};
