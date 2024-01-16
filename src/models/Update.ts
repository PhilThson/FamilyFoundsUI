export interface UpdateTransactionDto {
  id: number;
  title: string;
  amount: string;
  contractor: string;
  date: string;
  description?: string;
  postingDate?: string;
  category?: string;
}
