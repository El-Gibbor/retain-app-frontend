import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState, type FormEvent } from 'react';
import { adminApi } from '../../api/admin';
import type { Category } from '../../types/category';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import { validateCategoryName } from './categoryName';

interface RenameCategoryDialogProps {
  category: Category | null;
  onClose: () => void;
  onRenamed: (category: Category) => void;
}

function RenameForm({ category, onClose, onRenamed }: RenameCategoryDialogProps & { category: Category }) {
  const [name, setName] = useState(category.name);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const unchanged = name.trim() === category.name;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateCategoryName(name);
    setError(validationError);
    if (validationError) return;

    setSaving(true);
    try {
      onRenamed(await adminApi.renameCategory(category.id, { name: name.trim() }));
    } catch (submitError) {
      setError(getFieldErrors(submitError).name ?? getErrorMessage(submitError));
      setSaving(false);
    }
  };

  return (
    <Dialog
      open
      onClose={saving ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="rename-category-title"
    >
      <form noValidate onSubmit={handleSubmit}>
        <DialogTitle id="rename-category-title">Rename category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError(null);
            }}
            error={Boolean(error)}
            helperText={error ?? ' '}
            autoFocus
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={saving} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" loading={saving} disabled={unchanged}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function RenameCategoryDialog(props: RenameCategoryDialogProps) {
  return props.category ? <RenameForm {...props} category={props.category} /> : null;
}
