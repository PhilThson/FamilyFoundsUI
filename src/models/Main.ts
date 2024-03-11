export interface ITransaction {
  id: number;
  title: string;
  contractor?: string;
  account?: string;
  amount: number;
  currency: string;
  description?: string;
  date: string;
  postingDate?: string;
  contractorAccountNumber?: string;
  contractorBankName?: string;
  category?: ICategory;
}

export interface ITransactionState {
  transactions: ITransaction[];
  isVisible: boolean;
  fetchAllState: IActionState;
  addNewState: IActionState;
  updateState: IActionState;
  deleteState: IActionState;
  importState: IActionState;
  summaryData: ISummaryData;
}

export interface IActionState {
  status: Status;
  error: string | null;
}

export interface IAuthState {
  name: null | string;
  email: null | string;
  accessToken: null | string;
  isLoggedIn: boolean;
  loginState: IActionState;
}

export interface IAuthenticateRequest {
  email: string;
  password: string;
}

export interface IAuthenticateResponse {
  jwtToken: string;
  refreshToken: string;
}

export interface ISummaryData {
  totalDebit: number;
  totalCredit: number;
  balance: number;
  categoriesCount: ICategorySum[];
  transactionsCount: number;
}

export interface ICategorySum {
  name: string;
  amount: number;
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

export interface ITransactionPropertyProps {
  name: string;
  displayName?: string;
  initialValue: string | number;
  type?: string;
  onValueChange: (name: string, value: string) => void;
}

export interface ICategoryPropertyProps {
  name: string;
  initialValue?: ICategory;
  onValueChange: (name: string, value: string) => void;
}

export interface TransactionsAreaProps {
  transactionsState: IActionState;
  transactionsCount: number;
}
