export interface Transaction {
  id: number;
  title: string;
  contractor: string;
  amount: number;
  description?: string;
  date: string;
  postingDate?: string;
  categoryId?: number;
}

export class TransactionState {
  transactions: Transaction[] = [];
  isVisible: boolean = false;
  totalAmount: number = 0.0;
  fetchAllStatus: Status = "idle";
  fetchAllError: string | null = null;
  addNewStatus: Status = "idle";
  addNewError: string | null = null;
  deleteStatus: Status = "idle";
  deleteError: string | null = null;
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

export interface IDateRange {
  startDate: string;
  endDate: string;
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
