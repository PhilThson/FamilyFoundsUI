export type CreateTransaction = {
  title?: string | undefined;
  contractor?: string | undefined;
  amount?: number | undefined;
  description?: string | undefined;
  date?: Date | undefined;
  postingDate?: Date | undefined;
  categoryId?: number | undefined;
};
