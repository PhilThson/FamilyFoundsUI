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
  fetchAllState: IActionState;
  addNewState: IActionState;
  updateState: IActionState;
  deleteState: IActionState;
  importState: IActionState;
}

export interface IActionState {
  status: Status;
  error: string | null;
}

export type Status = "idle" | "error" | "pending" | "success";
export type NotificationTitle = "Brak" | "Błąd" | "Ładowanie" | "Sukces";

export const currencies = ["PLN", "USD", "EUR"] as const;
export type Currency = (typeof currencies)[number];

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

export interface IImportSource {
  id: number;
  name: string;
}

export interface IImportSourceState {
  importSources: IImportSource[];
  fetchAllState: IActionState;
}

export interface ComboBoxProps {
  id: string;
  value: string;
  isValid?: boolean;
  errorText?: string;
  onSelectChange: (event: React.ChangeEvent) => void;
  onSelectBlur: (event: React.FocusEvent<HTMLElement>) => void;
}

export interface ImportSourceComboBoxProps {
  value: number | null;
  onSelectChange: (importSourceId: number | null) => void;
}

export interface CurrencyComboBoxProps {
  value: Currency;
  onSelectChange: (event: React.ChangeEvent) => void;
}
