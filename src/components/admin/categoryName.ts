export const MAX_CATEGORY_NAME = 50;

export const validateCategoryName = (value: string): string | null => {
  const name = value.trim();
  if (!name) return 'Name is required';
  if (name.length > MAX_CATEGORY_NAME) return `Name must be ${MAX_CATEGORY_NAME} characters or fewer`;
  return null;
};
