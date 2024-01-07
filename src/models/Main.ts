export class Transaction {
  id?: number;
  title?: string;
  contractor?: string;
  amount: number = 0.0;
  description?: string;
  date?: Date;
  postingDate?: Date;
  categoryId?: number;
}

export class TransactionState {
  transactions: Transaction[] = [];
  isVisible: boolean = false;
  totalAmount: number = 0.0;
  status: Status = "idle";
  error: string | null = null;
}

export type Status = "idle" | "error" | "pending" | "success";
export type NotificationTitle = "Brak" | "Błąd" | "Ładowanie" | "Sukces";

export class Notification {
  status: Status = "idle";
  title: NotificationTitle = "Brak";
  message?: string;
}

export class NotificationState {
  notification?: Notification;
}

export class DateRange {
  startDate?: Date;
  endDate?: Date;
}

export interface Category {
  id: number;
  name: string;
}

export class CategoryState {
  categories: Category[] = [];
  status: Status = "idle";
  error: string | null = null;
}
