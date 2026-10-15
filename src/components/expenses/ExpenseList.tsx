import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  Link,
  List,
  ListItem,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { MouseEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router';
import { visuallyHidden } from '../../utils/a11y';
import type { Expense } from '../../types/expense';
import { formatCurrency, formatDate, PAYMENT_METHOD_LABELS } from '../../utils/format';

interface ExpenseListProps {
  expenses: Expense[];
  /** Shows skeleton rows in place of data */
  skeletonRows?: number;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
}

const detailPath = (expense: Expense) => `/expenses/${expense.id}`;

// Clicks on buttons and links inside a row keep their own behaviour
const isInteractive = (event: MouseEvent) => (event.target as HTMLElement).closest('a, button') !== null;

function ExpenseTitleLink({ expense }: { expense: Expense }) {
  return (
    <Link
      component={RouterLink}
      to={detailPath(expense)}
      color="inherit"
      underline="hover"
      sx={{ fontWeight: 500, display: 'block' }}
      noWrap
    >
      {expense.title}
    </Link>
  );
}

function RowActions({
  expense,
  onEdit,
  onDelete,
}: Pick<ExpenseListProps, 'onEdit' | 'onDelete'> & { expense: Expense }) {
  return (
    <>
      {onEdit && (
        <Tooltip title="Edit">
          <IconButton aria-label={`Edit ${expense.title}`} onClick={() => onEdit(expense)} size="small">
            <EditOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title="Delete">
          <IconButton aria-label={`Delete ${expense.title}`} onClick={() => onDelete(expense)} size="small">
            <DeleteOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}

function CategoryChip({ name }: { name: string }) {
  return <Chip label={name} size="small" variant="outlined" sx={{ maxWidth: '100%' }} />;
}

function ExpenseTable({ expenses, skeletonRows, onEdit, onDelete }: ExpenseListProps) {
  const navigate = useNavigate();
  const hasActions = Boolean(onEdit || onDelete);
  return (
    <TableContainer>
      <Table aria-label="Expenses">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell align="right">Amount</TableCell>
            {hasActions && (
              <TableCell align="right" sx={{ width: 96 }}>
                <Box component="span" sx={visuallyHidden}>
                  Actions
                </Box>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {skeletonRows
            ? Array.from({ length: skeletonRows }, (_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: hasActions ? 6 : 5 }, (_, cell) => (
                    <TableCell key={cell}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : expenses.map((expense) => (
                <TableRow
                  key={expense.id}
                  hover
                  onClick={(event) => !isInteractive(event) && navigate(detailPath(expense))}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell sx={{ maxWidth: 320 }}>
                    <ExpenseTitleLink expense={expense} />
                    {expense.notes && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {expense.notes}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <CategoryChip name={expense.category.name} />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(expense.date)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {PAYMENT_METHOD_LABELS[expense.paymentMethod]}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  {hasActions && (
                    <TableCell align="right" sx={{ py: 0.5, whiteSpace: 'nowrap' }}>
                      <RowActions expense={expense} onEdit={onEdit} onDelete={onDelete} />
                    </TableCell>
                  )}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ExpenseCards({ expenses, skeletonRows, onEdit, onDelete }: ExpenseListProps) {
  const navigate = useNavigate();
  return (
    <List disablePadding aria-label="Expenses">
      {skeletonRows
        ? Array.from({ length: skeletonRows }, (_, index) => (
            <ListItem key={index} divider sx={{ py: 1.5 }}>
              <Box sx={{ width: '100%' }}>
                <Skeleton width="60%" />
                <Skeleton width="40%" />
              </Box>
            </ListItem>
          ))
        : expenses.map((expense) => (
            <ListItem
              key={expense.id}
              divider
              onClick={(event) => !isInteractive(event) && navigate(detailPath(expense))}
              sx={{ py: 1.5, alignItems: 'flex-start', cursor: 'pointer' }}
            >
              <Box sx={{ minWidth: 0, flex: 1, pr: 2 }}>
                <ExpenseTitleLink expense={expense} />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {formatDate(expense.date)} · {PAYMENT_METHOD_LABELS[expense.paymentMethod]}
                </Typography>
                <Box sx={{ mt: 0.75 }}>
                  <CategoryChip name={expense.category.name} />
                </Box>
              </Box>
              <Stack sx={{ alignItems: 'flex-end', flexShrink: 0 }}>
                <Typography sx={{ fontWeight: 600 }}>{formatCurrency(expense.amount)}</Typography>
                <Box sx={{ mt: 0.5, mr: -0.75 }}>
                  <RowActions expense={expense} onEdit={onEdit} onDelete={onDelete} />
                </Box>
              </Stack>
            </ListItem>
          ))}
    </List>
  );
}

export default function ExpenseList(props: ExpenseListProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  return isDesktop ? <ExpenseTable {...props} /> : <ExpenseCards {...props} />;
}
