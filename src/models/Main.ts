export interface ITransaction {
  id: number;
  title: string;
  contractor: string;
  amount: number;
  description?: string;
  date: string;
  postingDate?: string;
  category?: ICategory;
}

export interface ITransactionState {
  transactions: ITransaction[];
  isVisible: boolean;
  totalAmount: number;
  fetchAllState: ITransactionActionState;
  addNewState: ITransactionActionState;
  updateState: ITransactionActionState;
  deleteState: ITransactionActionState;
  importState: ITransactionActionState;
}

export interface ITransactionActionState {
  status: Status;
  error: string | null;
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

export interface ICategory {
  id: number;
  name: string;
}

export class CategoryState {
  categories: ICategory[] = [];
  status: Status = "idle";
  error: string | null = null;
}
