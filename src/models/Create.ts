export class CreateTransaction {
  title: string = "";
  amount: string = "";
  contractor: string = "";
  date: string = new Date().toJSON().slice(0, 10);
  description: string = "";
  postingDate?: string = "";
  category: string = "";
}

export interface CreateTransactionDto {
  title: string;
  amount: string;
  contractor: string;
  date: string;
  description?: string;
  postingDate?: string;
  category?: string;
}

// const month = date.toLocaleString('en-US', {month: 'long'});
// const day = date.toLocaleString('en-US', {day: '2-digit'});
// const year = date.getFullYear();
