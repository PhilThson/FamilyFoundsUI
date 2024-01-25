import { ITransaction } from "../models/Main";

export function orderByDate(
  transactions: ITransaction[],
  ascending: boolean
): ITransaction[] {
  const orderMultiplier = ascending ? 1 : -1;
  return transactions
    .slice()
    .sort((a, b) => orderMultiplier * b.date.localeCompare(a.date));
}

export function orderByCategory(
  transactions: ITransaction[],
  ascending: boolean
): ITransaction[] {
  return transactions.slice().sort((a, b) => {
    const categoryComparison = (a.category?.id || 0) - (b.category?.id || 0);
    if (categoryComparison === 0) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return ascending ? categoryComparison : -categoryComparison;
  });
}
