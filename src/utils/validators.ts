import { CreateTransaction } from "../models/Create";

export const stringHasValue = (value: string): boolean =>
  value ? true : false;

export const amountHasValue = (value: string): boolean => {
  const val = value.trim();
  return val !== "0" && val !== "0.0" && val !== "";
};

export const dateHasValue = (value: string) => {
  const timestamp = Date.parse(value);
  return !isNaN(timestamp);
};

export const newTransactionIsValid = (transaction: CreateTransaction) =>
  stringHasValue(transaction.title) &&
  stringHasValue(transaction.contractor) &&
  amountHasValue(transaction.amount) &&
  dateHasValue(transaction.date);
