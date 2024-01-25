import { Currency } from "./Main";

export interface CreateTransactionDto {
  title: string;
  amount: string;
  currency: Currency;
  account?: string;
  contractor: string;
  date: string;
  postingDate?: string;
  description?: string;
  contractorAccountNumber?: string;
  contractorBankName?: string;
  categoryId?: string;
}

// const month = date.toLocaleString('en-US', {month: 'long'});
// const day = date.toLocaleString('en-US', {day: '2-digit'});
// const year = date.getFullYear();
