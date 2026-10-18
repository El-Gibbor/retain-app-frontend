import { AddOutlined, DeleteOutlined, DriveFileRenameOutlineOutlined } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState, type FormEvent } from 'react';
import { adminApi } from '../../api/admin';
import { useNotify } from '../../hooks/useNotify';
import type { Category } from '../../types/category';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import ConfirmDialog from '../common/ConfirmDialog';
import { validateCategoryName } from './categoryName';
import RenameCategoryDialog from './RenameCategoryDialog';

interface CategoryManagerProps {
  categories: Category[];
  /** Expense count per category id, from the platform insights */
  usage: Record<string, number>;
  loading: boolean;
  error: string | null;
  onChanged: () => void;
}

const expensesLabel = (count: number) => `${count} ${count === 1 ? 'expense' : 'expenses'}`;

export default function CategoryManager({
  categories,
  usage,
  loading,
  error,
  onChanged,
}: CategoryManagerProps) {
  const notify = useNotify();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [renaming, setRenaming] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const fallbackName = categories.find((category) => category.isDefault)?.name ?? 'Uncategorized';

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateCategoryName(name);
    setNameError(validationError);
    if (validationError) return;

    setAdding(true);
    try {
      const created = await adminApi.createCategory({ name: name.trim() });
      setName('');
      notify(`Created "${created.name}"`);
      onChanged();
    } catch (submitError) {
      setNameError(getFieldErrors(submitError).name ?? getErrorMessage(submitError));
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeletePending(true);
    try {
      const result = await adminApi.deleteCategory(deleting.id);
      const moved = result.reassignedExpenses;
      notify(
        moved > 0
          ? `Deleted "${deleting.name}" and moved ${expensesLabel(moved)} to ${result.reassignedTo.name}`
          : `Deleted "${deleting.name}"`,
      );
      setDeleting(null);
      onChanged();
    } catch (deleteError) {
      notify(getErrorMessage(deleteError), 'error');
    } finally {
      setDeletePending(false);
    }
  };

  const deletingCount = deleting ? (usage[deleting.id] ?? 0) : 0;

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Typography variant="h6" component="h2">
          Expense categories
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Categories are shared by every user. Deleting one moves its expenses to {fallbackName}.
        </Typography>

        <Stack
          component="form"
          noValidate
          onSubmit={handleAdd}
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ alignItems: { sm: 'flex-start' }, mb: 2 }}
        >
          <TextField
            label="New category"
            size="small"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (nameError) setNameError(null);
            }}
            error={Boolean(nameError)}
            helperText={nameError ?? ' '}
            sx={{ maxWidth: { sm: 360 } }}
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddOutlined />}
            loading={adding}
            sx={{ height: 40, flexShrink: 0 }}
          >
            Add category
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          Array.from({ length: 6 }, (_, index) => <Skeleton key={index} height={52} />)
        ) : (
          <List disablePadding aria-label="Expense categories">
            {categories.map((category) => (
              <ListItem key={category.id} divider disableGutters sx={{ py: 1, gap: 1.5 }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 500 }} noWrap>
                      {category.name}
                    </Typography>
                    {category.isDefault && <Chip label="Default" size="small" variant="outlined" />}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {expensesLabel(usage[category.id] ?? 0)}
                  </Typography>
                </Box>
                <Tooltip title="Rename">
                  <IconButton
                    aria-label={`Rename ${category.name}`}
                    onClick={() => setRenaming(category)}
                    size="small"
                  >
                    <DriveFileRenameOutlineOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={category.isDefault ? 'The default category cannot be deleted' : 'Delete'}>
                  {/* Span keeps the tooltip working on a disabled button */}
                  <span>
                    <IconButton
                      aria-label={`Delete ${category.name}`}
                      onClick={() => setDeleting(category)}
                      disabled={category.isDefault}
                      size="small"
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>

      <RenameCategoryDialog
        category={renaming}
        onClose={() => setRenaming(null)}
        onRenamed={(renamed) => {
          notify(`Renamed to "${renamed.name}"`);
          setRenaming(null);
          onChanged();
        }}
      />
      <ConfirmDialog
        open={deleting !== null}
        title="Delete category?"
        message={
          deleting &&
          (deletingCount > 0 ? (
            <>
              <strong>{deleting.name}</strong> will be deleted and its {expensesLabel(deletingCount)} will
              move to <strong>{fallbackName}</strong>. No expenses are lost.
            </>
          ) : (
            <>
              <strong>{deleting.name}</strong> has no expenses and will be deleted.
            </>
          ))
        }
        confirmLabel="Delete"
        destructive
        loading={deletePending}
        onConfirm={handleDelete}
        onClose={() => setDeleting(null)}
      />
    </Card>
  );
}
