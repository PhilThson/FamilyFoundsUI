export interface UpdateTransactionDto {
  id: number;
  title: string;
  contractor?: string;
  account?: string;
  amount: string;
  currency: string;
  date: string;
  description?: string;
  postingDate?: string;
  category?: string;
  contractorAccountNumber?: string;
  contractorBankName?: string;
}
