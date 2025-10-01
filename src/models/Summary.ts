export interface ISummaryData {
  totalDebit: number;
  totalCredit: number;
  balance: number;
  categoriesCount: ICategorySum[];
  transactionsCount: number;
  averagePerMonth: {
    totalDebit: number;
    totalCredit: number;
    balance: number;
    categoriesCount: ICategorySum[];
  };
}

export interface ICategorySum {
  name: string;
  amount: number;
}
