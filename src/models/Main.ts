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
}

export type NotificationStatus = "idle" | "error" | "pending" | "success";
export type NotificationTitle = "Idle" | "Error" | "Pending" | "Success";

export class Notification {
  status: NotificationStatus = "idle";
  title: NotificationTitle = "Idle";
  message?: string;
}

export class NotificationState {
  notification?: Notification;
}

export class DateRange {
  startDate?: Date;
  endDate?: Date;
}
