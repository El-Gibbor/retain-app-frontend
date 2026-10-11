export interface Category {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface CategoryPayload {
  name: string;
}

export interface CategoryDeletionResult {
  deletedId: string;
  reassignedExpenses: number;
  reassignedTo: Category;
}
