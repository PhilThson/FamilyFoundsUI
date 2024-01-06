export class CreateTransaction {
  title: string = "";
  contractor: string = "";
  amount?: number;
  description?: string;
  date?: Date;
  postingDate?: Date;
  categoryId?: number;
}
